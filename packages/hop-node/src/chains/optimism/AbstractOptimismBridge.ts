import AbstractBridge from '../AbstractBridge'
import Derive, { Frame } from './Derive'
import zlib from 'zlib'
import { BigNumber, Contract, providers } from 'ethers'
import { BlockWithTransactions } from '@ethersproject/abstract-provider'
import { CrossChainMessenger, MessageStatus } from '@eth-optimism/sdk'
import { IChainBridge } from '../IChainBridge'
import { OptimismSuperchainCanonicalAddresses } from '@hop-protocol/core/addresses'
import { RLP } from '@ethereumjs/rlp'
import { TransactionFactory } from '@ethereumjs/tx'
import { getCanonicalAddressesForChain, config as globalConfig } from 'src/config'
import { Chain, L1DataLagInL1Blocks } from 'src/constants'

// Transactions have been observed that are less than the expected, which is why div(2) is required
// Mainnet and testnet for all chains are the same now but might not always be. Handle if they are no longer the same.
const CheckpointTxBlockGap: Record<string, number> = {
  [Chain.Optimism]: Math.floor(10 / 2),
  [Chain.Base]: Math.floor(5 / 2)
}

abstract class AbstractOptimismBridge extends AbstractBridge implements IChainBridge {
  csm: CrossChainMessenger
  l1BlockAbi: string[]
  l1BlockContract: Contract
  sequencerAddress: string
  batchInboxAddress: string
  l1BlockSetterAddress: string
  l1BlockAddress: string
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

    // System addresses and precompiles
    this.l1BlockSetterAddress = '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001'
    this.l1BlockAddress = '0x4200000000000000000000000000000000000015'

    // Addresses from config
    const optimismSuperchainCanonicalAddresses: OptimismSuperchainCanonicalAddresses = getCanonicalAddressesForChain(this.chainSlug)
    this.sequencerAddress = optimismSuperchainCanonicalAddresses.sequencerAddress
    this.batchInboxAddress = optimismSuperchainCanonicalAddresses.batchInboxAddress
    if (!this.sequencerAddress || !this.batchInboxAddress) {
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

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    const receipt: providers.TransactionReceipt = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    const lastIncludedBlock = await this.l2Wallet.provider!.getBlock('safe')
    if (receipt.blockNumber > lastIncludedBlock.number) {
      this.logger.debug(`l2 block number ${receipt.blockNumber} is not yet included (last included block ${lastIncludedBlock.number})`)
      return
    }

    this.logger.debug(`getL1InclusionTx: getting l1 inclusion tx for l2 tx hash ${l2TxHash}`)
    return this._getL1InclusionTx(l2TxHash)
  }

  // TODO: Update with inclusion watcher
  private async _getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt> {
    const l2BlockNumber: number = (await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)).blockNumber
    const l1BlockNumberOnL2: number = Number(await this.l1BlockContract.number({ blockTag: l2BlockNumber }))
    let l1Block: BlockWithTransactions = await this.l1Wallet.provider!.getBlockWithTransactions(l1BlockNumberOnL2)

    let counter = 0
    while (true) {
      let blockNumberIncrementer = 1
      for (const tx of l1Block.transactions) {
        if (
          tx.to &&
          tx.to.toLowerCase() === this.batchInboxAddress.toLowerCase() &&
          tx.from.toLowerCase() === this.sequencerAddress.toLowerCase()
        ) {
          blockNumberIncrementer = CheckpointTxBlockGap[this.chainSlug]
          const l2TxHashes = await this._getL2TxHashesInFrame(tx.hash)
          if (l2TxHashes.includes(l2TxHash.toLowerCase())) {
            return this.l1Wallet.provider!.getTransactionReceipt(tx.hash)
          }
        }
      }

      // Increment block and try again
      l1Block = await this.l1Wallet.provider!.getBlockWithTransactions(l1Block.number + blockNumberIncrementer)
      if (!l1Block) {
        throw new Error('no newer l1 blocks to check')
      }

      this.logger.debug(`trying again with l1 block ${l1Block.number} (incremented ${blockNumberIncrementer} blocks)`)
      counter++
      if (counter > 50) {
        throw new Error('_getL1InclusionTx: looped too many times')
      }
    }
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    const l1BlockNumber: number = (await this.l1Wallet.provider!.getTransactionReceipt(l1TxHash)).blockNumber
    const l2InclusionBlockNumber = await this._traverseL2BlocksForInclusion(l1BlockNumber)

    const txs = (await this.l2Wallet.provider!.getBlockWithTransactions(l2InclusionBlockNumber)).transactions
    for (const tx of txs) {
      if (
        tx.to &&
        tx.to.toLowerCase() === this.l1BlockAddress.toLowerCase() &&
        tx.from.toLocaleLowerCase() === this.l1BlockSetterAddress.toLowerCase()
      ) {
        return this.l2Wallet.provider!.getTransactionReceipt(tx.hash)
      }
    }
    throw new Error(`getL2InclusionTx: inclusion tx does not exist in block ${l2InclusionBlockNumber}`)
  }

  private async _traverseL2BlocksForInclusion (l1BlockNumber: number): Promise<number> {
    // L1 data on L2 lags behind true L1 data
    const numL2BlocksPerL1Block = 6
    const l1DataLagInL2Blocks = L1DataLagInL1Blocks[this.chainSlug] * numL2BlocksPerL1Block

    // With the lag, the included block should represent the block that the tx was included in on L1
    let l2BlockNumber: number = await this.l2Wallet.provider!.getBlockNumber() - l1DataLagInL2Blocks
    let includedL1BlockNumber: number = Number(await this.l1BlockContract.number({ blockTag: l2BlockNumber }))

    // If the includedL1BlockNumber is still too large, decrement until it is not
    // This may happen if proposals on L1 are missed
    while (includedL1BlockNumber > l1BlockNumber) {
      const numL2BlocksToDecrement = (includedL1BlockNumber - l1BlockNumber) * numL2BlocksPerL1Block
      l2BlockNumber -= numL2BlocksToDecrement
      includedL1BlockNumber = Number(await this.l1BlockContract.number({ blockTag: l2BlockNumber }))
    }

    // If we are too far behind, then we need to jump ahead. This might happen if less than
    // numL2BlocksPerL1Block were included in the last l1Block for some reason
    while (includedL1BlockNumber < l1BlockNumber) {
      // If we are behind by more than 1 l1 block, there is something wrong and we should throw since
      // that implies there are a number of low-sequence-number transactions
      if (l1BlockNumber - includedL1BlockNumber > numL2BlocksPerL1Block) {
        throw new Error(`getL2InclusionTx: too far behind. l1BlockNumber ${l1BlockNumber} is more than ${numL2BlocksPerL1Block} blocks ahead of l2BlockNumber ${l2BlockNumber}`)
      }

      // If not, increment by one until we get the right block
      l2BlockNumber += 1
      includedL1BlockNumber = Number(await this.l1BlockContract.number({ blockTag: l2BlockNumber }))
    }

    return l2BlockNumber
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

export default AbstractOptimismBridge
