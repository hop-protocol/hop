import AbstractChainWatcher from '../AbstractChainWatcher'
import Derive, { Frame } from '../../chains/optimism/Derive'
import Logger from 'src/logger'
import wallets from 'src/wallets'
import zlib from 'zlib'
import { BigNumber, Contract, Signer, providers } from 'ethers'
import { Chain } from 'src/constants'
import { CrossChainMessenger, MessageStatus } from '@eth-optimism/sdk'
import { IChainWatcher } from '../../classes/IChainWatcher'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { RLP } from '@ethereumjs/rlp'
import { TransactionFactory } from '@ethereumjs/tx'
import { config as globalConfig, getCanonicalAddressesForChain } from 'src/config'
import { BlockWithTransactions } from '@ethersproject/abstract-provider'
import { OptimismSuperchainCanonicalAddresses } from '@hop-protocol/core/addresses'

abstract class AbstractOptimismBridgeWatcher extends AbstractChainWatcher implements IChainWatcher {
  csm: CrossChainMessenger
  l1BlockAbi: string[]
  l1BlockAddress: string
  l1BlockContract: Contract
  sequencerAddress: string
  batchInboxAddress: string
  derive: Derive = new Derive()

  constructor (chainSlug: string) {
    super(chainSlug)

    this.csm = new CrossChainMessenger({
      bedrock: true,
      l1ChainId: globalConfig.isMainnet ? 1 : 5,
      l2ChainId: this.chainId,
      l1SignerOrProvider: this.l1Wallet,
      l2SignerOrProvider: this.l2Wallet
    })

    const optimismSuperchainCanonicalAddresses: OptimismSuperchainCanonicalAddresses = getCanonicalAddressesForChain(this.chainSlug)
    this.l1BlockAddress = optimismSuperchainCanonicalAddresses.l1BlockAddress
    this.sequencerAddress = optimismSuperchainCanonicalAddresses.sequencerAddress
    this.batchInboxAddress = optimismSuperchainCanonicalAddresses.batchInboxAddress
    if (!this.l1BlockAddress || !this.sequencerAddress || !this.batchInboxAddress) {
      throw new Error(`canonical addresses not found for ${this.chainSlug}`)
    }

    this.l1BlockAbi = [
      'function number() view returns (uint64)',
      'function sequenceNumber() view returns (uint64)'
    ]
    this.l1BlockContract = new Contract(this.l1BlockAddress, this.l1BlockAbi, this.l2Wallet)
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    try {
      const message = await this.csm.toCrossChainMessage(l1TxHash)
      const gasLimit = 1000000
      // Signer is needed to execute tx with SDK
      const txOpts: any = {
        signer: this.l2Wallet,
        overrides: {
          gasLimit
        }
      }
      return this.csm.resendMessage(message, txOpts)
    } catch (err) {
      throw new Error(`relayL1ToL2Message error: ${err.message}`)
    }
  }

  // This function will only handle one stage at a time. Upon completion of a stage, the poller will re-call
  // this when the next stage is ready.
  // It is expected that the poller re-calls this message every hour during the challenge period, if the
  // transfer was challenged. The complexity of adding DB state to track successful/failed root prove txs
  // and challenges is not worth saving the additional RPC calls (2) per hour during the challenge period.
  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    const messageStatus: MessageStatus = await this.csm.getMessageStatus(l2TxHash)
    if (
      messageStatus === MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE ||
      messageStatus === MessageStatus.FAILED_L1_TO_L2_MESSAGE ||
      messageStatus === MessageStatus.RELAYED
    ) {
      throw new Error(`unexpected message status: ${messageStatus}, l2TxHash: ${l2TxHash}`)
    }

    if (messageStatus === MessageStatus.STATE_ROOT_NOT_PUBLISHED) {
      throw new Error('state root not published')
    }

    if (messageStatus === MessageStatus.READY_TO_PROVE) {
      this.logger.info('sending proveMessage tx')
      const resolved = await this.csm.toCrossChainMessage(l2TxHash)
      return this.csm.proveMessage(resolved)
    }

    if (messageStatus === MessageStatus.IN_CHALLENGE_PERIOD) {
      throw new Error('message in challenge period')
    }

    if (messageStatus === MessageStatus.READY_FOR_RELAY) {
      this.logger.info('sending finalizeMessage tx')
      return this.csm.finalizeMessage(l2TxHash)
    }

    throw new Error(`state not handled for tx ${l2TxHash}`)
  }

  // TODO: This is expensive. Optimize calls.
  async getL1InclusionBlock (l2TxHash: string, l2BlockNumber: number): Promise<providers.Block | undefined> {
    // Get the receipt instead of trusting the block number because the block number may have been reorged out
    const receipt: providers.TransactionReceipt = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    const onchainBlockNumber: number = receipt?.blockNumber

    if (!onchainBlockNumber) {
      throw new Error(`no block number found for tx l2TxHash ${l2TxHash} on chain ${this.chainSlug}`)
    }

    // TODO: Handle reorgs here when implementing reorg watcher
    if (onchainBlockNumber !== l2BlockNumber) {
      throw new Error(`reorg detected. tx l2TxHash ${l2TxHash} on chain ${this.chainSlug} is not included in block ${l2BlockNumber}`)
    }

    const lastIncludedBlock = await this.l2Wallet.provider!.getBlock('safe')
    if (l2BlockNumber > lastIncludedBlock.number) {
      this.logger.debug(`l2 block number ${l2BlockNumber} is not yet included (last included block ${lastIncludedBlock.number})`)
      return
    }

    this.logger.debug(`getL1InclusionBlock: getting l1 inclusion block for l2 tx hash ${l2TxHash}`)
    return this._getL1InclusionBlockByL2TxHash(l2TxHash)
  }

  async getL2BlockByL1BlockNumber (l1BlockNumber: number): Promise<providers.Block | undefined> {
    let l2BlockNumber: number = await this.l2Wallet.provider!.getBlockNumber()
    let l1BlockNumberOnL2: number = Number(await this.l1BlockContract.number({ blockTag: l2BlockNumber }))

    // If the L2 is unaware of the L1 block, then we are too early and need to try later
    if (l1BlockNumberOnL2 < l1BlockNumber) {
      const numBlocksEarly = l1BlockNumber - l1BlockNumberOnL2
      this.logger.debug(`getL2BlockByL1BlockNumber: too early by ${numBlocksEarly} blocks. l1BlockNumber ${l1BlockNumber} does not yet exist on l2 (${l1BlockNumberOnL2})`)
      return
    }

    let counter = 0
    while (true) {
      if (l1BlockNumberOnL2 === l1BlockNumber) {
        return this.l2Wallet.provider!.getBlock(l2BlockNumber)
      }

      // If the L2 is aware of the L1 block, then we are too late and need to try earlier
      // Jump to the block that contains the previous l1Block by skipping the remaining sequences in the block
      const seqNum: BigNumber = await this.l1BlockContract.sequenceNumber({ blockTag: l2BlockNumber })
      const numL2BlocksSinceLastL1Block = Number(seqNum) + 1
      const newL2BlockNumber = l2BlockNumber - numL2BlocksSinceLastL1Block
      const numBlocksAhead = l1BlockNumberOnL2 - l1BlockNumber
      this.logger.info(`getL2BlockByL1BlockNumber: ${numBlocksAhead} blocks ahead. l1BlockNumberOnL2 ${l1BlockNumberOnL2} at l2Block ${l2BlockNumber} is greater than l1BlockNumber ${l1BlockNumber}, seqNum: ${seqNum}, trying again with ${newL2BlockNumber}`)

      l2BlockNumber = newL2BlockNumber
      l1BlockNumberOnL2 = Number(await this.l1BlockContract.number({ blockTag: l2BlockNumber }))
      counter++
      if (counter > 10) {
        throw new Error('getL2BlockByL1BlockNumber looped too many times')
      }
    }
  }

  // TODO: This takes too long, get more efficient. Possibly just get all the blocks from now + 5 min in parallel and
  // TODO: This assumes that all channels close within the same frame. This is not always true and needs to be handled
  // TODO: This is expensive. Optimize calls.
  private async _getL1InclusionBlockByL2TxHash (l2TxHash: string): Promise<providers.Block> {
    // Start at the timestamp of l2 block and iterate forward on L1. Slightly inefficient, but guaranteed
    // to start behind where we need to look so we can iterate forward.
    const receipt: providers.TransactionReceipt = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    const l1BlockNumberOnL2: number = Number(await this.l1BlockContract.number({ blockTag: receipt.blockNumber }))
    let l1Block: BlockWithTransactions = await this.l1Wallet.provider!.getBlockWithTransactions(l1BlockNumberOnL2)

    const maxIterations = 100
    const maxL1BlockNumberToCheck = l1Block.number + maxIterations
    let counter = 0
    while (true) {
      for (const tx of l1Block.transactions) {
        if (
          tx.to &&
          tx.to.toLowerCase() === this.batchInboxAddress.toLowerCase() &&
          tx.from.toLowerCase() === this.sequencerAddress.toLowerCase()
        ) {
          const l2TxHashes = await this._getL2TxHashesInFrame(tx.hash)
          if (l2TxHashes.includes(l2TxHash.toLowerCase())) {
            // Get Block type without full txs
            // TODO: More typescript way of doing this
            return this.l1Wallet.provider!.getBlock(l1Block.number)
          }
        }
      }

      // Increment block and try again
      l1Block = await this.l1Wallet.provider!.getBlockWithTransactions(l1Block.number + 1)

      if (!l1Block) {
        throw new Error('no newer l1 blocks to check')
      }
      counter++
      if (counter > maxL1BlockNumberToCheck) {
        throw new Error('_getL1InclusionBlockByL2TxHash looped too many times')
      }
    }
  }

  private async _getL2TxHashesInFrame (l1TxHash: string): Promise<string[]> {
    const tx = await this.l1Wallet.provider!.getTransaction(l1TxHash)
    const frames: Frame[] = await this.derive.parseFrames(tx.data)

    const l2TxHashes: string[] = []
    for (const frame of frames) {
      const decompressedChannel: Buffer = await this._decompressChannel(frame.data)
      const decodedTxHashes: string[] = await this._decodeTxHashesFromChannel(decompressedChannel)
      for (const txHash of decodedTxHashes) {
        l2TxHashes.push(txHash.toLowerCase())
      }
    }
    return l2TxHashes
  }

  private async _decompressChannel (frameData: Buffer): Promise<Buffer> {
    // When decompressing a channel, we limit the amount of decompressed data to MAX_RLP_BYTES_PER_CHANNEL
    // (currently 10,000,000 bytes), in order to avoid "zip-bomb" types of attack (where a small compressed
    // input decompresses to a humongous amount of data). If the decompressed data exceeds the limit, things
    // proceeds as though the channel contained only the first MAX_RLP_BYTES_PER_CHANNEL decompressed bytes.
    // The limit is set on RLP decoding, so all batches that can be decoded in MAX_RLP_BYTES_PER_CHANNEL will
    // be accepted ven if the size of the channel is greater than MAX_RLP_BYTES_PER_CHANNEL. The exact requirement
    // is that length(input) <= MAX_RLP_BYTES_PER_CHANNEL.
    // https://github.com/ethereum-optimism/optimism/blob/develop/specs/derivation.md#channel-format
    const maxOutputLength = 10_000_000
    const channelCompressed: Buffer = Buffer.concat([frameData])
    return zlib.inflateSync(channelCompressed, { maxOutputLength })
  }

  private async _decodeTxHashesFromChannel (channelDecompressed: Buffer): Promise<string[]> {
    // NOTE: We are using ethereumjs RPL package since ethers does not allow for a stream
    const stream = true
    let remainingBatches: Buffer = channelDecompressed
    const transactionHashes: string[] = []
    while (true) {
      // Parse decoded data
      const encodedTxs: string = '0x' + Buffer.from(remainingBatches).toString('hex')
      const { data: batch, remainder } = RLP.decode(encodedTxs, stream)

      // Decode batch and parse
      const batchHex = '0x' + Buffer.from(batch as Buffer).toString('hex').slice(2)
      const decodedBatch = RLP.decode(batchHex)
      for (const tx of (decodedBatch[4] as Buffer[])) {
        const txData = TransactionFactory.fromSerializedData(Buffer.from(tx))
        transactionHashes.push('0x' + Buffer.from(txData.hash()).toString('hex'))
      }

      // Prep next loop
      remainingBatches = remainder as Buffer
      if (remainingBatches.length === 0) {
        return transactionHashes
      }
    }
  }
}

export default AbstractOptimismBridgeWatcher
