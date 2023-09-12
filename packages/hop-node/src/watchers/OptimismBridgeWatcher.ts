import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { CrossChainMessenger, MessageStatus } from '@eth-optimism/sdk'
import { IChainWatcher } from './classes/IChainWatcher'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { BigNumber, Contract, Signer, providers } from 'ethers'
import { config as globalConfig } from 'src/config'
import zlib from 'zlib'
import { RLP } from '@ethereumjs/rlp'
import { TransactionFactory } from '@ethereumjs/tx'


type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class OptimismBridgeWatcher extends BaseWatcher implements IChainWatcher {
  l1Provider: any
  l2Provider: any
  l1Wallet: Signer
  l2Wallet: Signer
  csm: CrossChainMessenger
  chainId: number
  private _l1BlockContract: Contract
  private _sequencerAddress: string
  private _batchInboxAddress: string
  private _derive: Derive = new Derive()

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Optimism)
    this.l1Provider = this.l1Wallet.provider
    this.l2Provider = this.l2Wallet.provider

    this.chainId = chainSlugToId(config.chainSlug)

    this.csm = new CrossChainMessenger({
      bedrock: true,
      l1ChainId: globalConfig.isMainnet ? 1 : 5,
      l2ChainId: this.chainId,
      l1SignerOrProvider: this.l1Wallet,
      l2SignerOrProvider: this.l2Wallet
    })

    // Replace this with SDK function when it becomes available
    const l1BlockAddr = '0x4200000000000000000000000000000000000015'
    const l1BlockAbi = [
      'function number() view returns (uint64)',
      'function sequenceNumber() view returns (uint64)',
    ]
    this._l1BlockContract = new Contract(l1BlockAddr, l1BlockAbi, this.l2Provider)
    this._sequencerAddress = '0x6887246668a3b87F54DeB3b94Ba47a6f63F32985'
    this._batchInboxAddress = '0xFF00000000000000000000000000000000000010'
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger): Promise<void> {
    logger.debug(
      `attempting to send relay message on optimism for commit tx hash ${commitTxHash}`
    )

    if (this.dryMode || globalConfig.emergencyDryMode) {
      logger.warn(`dry: ${this.dryMode}, emergencyDryMode: ${globalConfig.emergencyDryMode}, skipping relayL2ToL1Message`)
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })

    try {
      const tx = await this.relayL2ToL1Message(commitTxHash)
      if (!tx) {
        logger.warn(`No tx exists for exit, commitTxHash ${commitTxHash}`)
        return
      }

      const msg = `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx ${tx.hash}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err) {
      this.logger.error('relayL2ToL1Message error:', err.message)

      const {
        unexpectedPollError,
        unexpectedRelayErrors,
        invalidMessageError,
        onchainError,
        cannotReadPropertyError,
        preBedrockErrors
      } = this._getErrorType(err.message)

      // This error occurs if a poll happened while a message was either not yet published or in the challenge period
      if (unexpectedPollError) {
        return
      }

      if (unexpectedRelayErrors) {
        throw new Error('unexpected message status')
      }
      if (invalidMessageError) {
        throw new Error('invalid message')
      }
      if (onchainError) {
        throw new Error('message has already been relayed')
      }
      if (cannotReadPropertyError) {
        throw new Error('event not found in optimism sdk')
      }
      if (preBedrockErrors) {
        throw new Error('unexpected Optimism SDK error')
      }

      throw err
    }
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
      console.log('sending proveMessage tx')
      const resolved = await this.csm.toCrossChainMessage(l2TxHash)
      return this.csm.proveMessage(resolved)
    }

    if (messageStatus === MessageStatus.IN_CHALLENGE_PERIOD) {
      throw new Error('message in challenge period')
    }

    if (messageStatus === MessageStatus.READY_FOR_RELAY) {
      console.log('sending finalizeMessage tx')
      return this.csm.finalizeMessage(l2TxHash)
    }

    throw new Error(`state not handled for tx ${l2TxHash}`)
  }

  // At this time, most aof these errors are only informational and not explicitly handled
  private _getErrorType (errMessage: string) {
    // Hop errors
    const unexpectedPollError =
      errMessage.includes('state root not published') ||
      errMessage.includes('message in challenge period')

    const unexpectedRelayErrors =
      errMessage.includes('unexpected message status') ||
      errMessage.includes('state not handled for tx ')

    // Optimism SDK errors
    const invalidMessageError =
      errMessage.includes('unable to find transaction receipt for') ||
      errMessage.includes('message is undefined') ||
      errMessage.includes('could not find SentMessage event for message') ||
      errMessage.includes('expected 1 message, got')

    const onchainError = errMessage.includes('message has already been relayed')

    // isEventLow() does not handle the case where `batchEvents` is null
    // https://github.com/ethereum-optimism/optimism/blob/26b39199bef0bea62a2ff070cd66fd92918a556f/packages/message-relayer/src/relay-tx.ts#L179
    const cannotReadPropertyError = errMessage.includes('Cannot read property')

    const preBedrockErrors =
      errMessage.includes('unable to find state root batch for tx') ||
      errMessage.includes('messagePairs not found') ||
      errMessage.includes('exit within challenge window')

    return {
      unexpectedPollError,
      unexpectedRelayErrors,
      invalidMessageError,
      onchainError,
      cannotReadPropertyError,
      preBedrockErrors
    }
  }

  // TODO: Handle reorgs in the try...catch of the watchers...
  // TODO: I believe this makes a ton of calls. See if it can be optimized.

  async getL1InclusionBlock (l2TxHash: string, l2BlockNumber: number): Promise<providers.Block> {
    // Get the receipt instead of trusting the block number because the block number may have been reorged out
    const receipt: providers.TransactionReceipt = await this.l2Provider.getTransactionReceipt(l2TxHash)
    const onchainBlockNumber: number = receipt?.blockNumber

    if (!onchainBlockNumber) {
      throw new Error(`no block number found for tx l2TxHash ${l2TxHash} on chain ${this.chainSlug}`)
    }

    if (onchainBlockNumber !== l2BlockNumber) {
      throw new Error(`reorg detected. tx l2TxHash ${l2TxHash} on chain ${this.chainSlug} is not included in block ${l2BlockNumber}`)
    }

    const lastIncludedBlockNumber = await this.bridge.getSafeBlockNumber()
    if (l2BlockNumber > lastIncludedBlockNumber) {
      throw new Error(`l2TxHash ${l2TxHash} on chain ${this.chainSlug} is included in block ${l2BlockNumber} which is not yet included (last included block ${lastIncludedBlockNumber})`)
    }

    return this._getL1InclusionBlockByL2TxHash(l2TxHash)
  }

  async getL2BlockByL1BlockNumber (l1BlockNumber: number): Promise<providers.Block | undefined> {
    let l2BlockNumber: number = await this.bridge.getBlockNumber()
    let l1BlockNumberOnL2: number = Number(await this._l1BlockContract.number({ blockTag: l2BlockNumber }))
    let counter = 0
    while (true) {
      if (l1BlockNumberOnL2 < l1BlockNumber) {
        console.log(`too early. l1BlockNumberOnL2 ${l1BlockNumberOnL2} is less than l1BlockNumber ${l1BlockNumber}`)
        return
      } else if (l1BlockNumberOnL2 === l1BlockNumber) {
        return this.l2Provider.getBlock(l2BlockNumber)
      } else if (l1BlockNumberOnL2 > l1BlockNumber) {
        const seqNum: BigNumber = await this._l1BlockContract.sequenceNumber({ blockTag: l2BlockNumber })
        // Add 1 since index starts at 0
        const numL2BlocksSinceLastL1Block = Number(seqNum) + 1
        const newL2BlockNumber = l2BlockNumber - numL2BlocksSinceLastL1Block
        console.log(`l1BlockNumberOnL2 ${l1BlockNumberOnL2} at l2Block ${l2BlockNumber} is greater than l1BlockNumber ${l1BlockNumber}, seqNum: ${seqNum}, trying again with ${newL2BlockNumber}`)

        l2BlockNumber = newL2BlockNumber
        l1BlockNumberOnL2 = Number(await this._l1BlockContract.number({ blockTag: l2BlockNumber }))
        counter++
        if (counter > 10) {
          throw new Error(`getL2BlockByL1BlockNumber looped too many times`)
        }
      }
    }
  }

  // TODO: This assumes that all channels close within the same frame. This is not always true and needs to be handled
  // TODO: This is expensive. Optimize calls.
  private async _getL1InclusionBlockByL2TxHash (l2TxHash: string): Promise<providers.Block> {
    // Start at the timestamp of l2 block and iterate forward on L1. Slightly inefficient, but guaranteed
    // to start behind where we need to look so we can iterate forward.
    const receipt: providers.TransactionReceipt = await this.l2Provider.getTransactionReceipt(l2TxHash)
    let l1BlockNumberOnL2: number = Number(await this._l1BlockContract.number({ blockTag: receipt.blockNumber }))
    let l1Block = await this.l1Provider.getBlockWithTransactions(l1BlockNumberOnL2)

    const maxIterations = 100
    const maxL1BlockNumberToCheck = l1Block.number + maxIterations
    let counter = 0
    while (true) {
      for (const tx of l1Block.transactions) {
        if (
          tx.to &&
          tx.to.toLowerCase() === this._batchInboxAddress.toLowerCase() &&
          tx.from.toLowerCase() === this._sequencerAddress.toLowerCase()
        ) {
          const l2TxHashes = await this._getL2TxHashesInFrame(tx.hash)
          if (l2TxHashes.includes(l2TxHash.toLowerCase())) {
            return l1Block
          }
        }
      }

      // Increment block and try again
      l1Block = await this.l1Provider.getBlockWithTransactions(l1Block.number + 1)
      counter++
      if (counter > maxL1BlockNumberToCheck) {
        throw new Error(`_getL1InclusionBlockByL2TxHash looped too many times`)
      }
    }
  }

  private async _getL2TxHashesInFrame (l1TxHash: string): Promise<string[]> {
    const tx = await this.l1Provider.getTransaction(l1TxHash)
    let frames: Frame[] = await this._derive.parseFrames(tx.data)

    let l2TxHashes: string[] = []
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
    let transactionHashes: string[] = []
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
      if (remainingBatches.length === 0){
        return transactionHashes
      }
    }
  }
}
export type Frame = {
  channelId: string
  frameNumber: number
  data: Buffer
  isLast: boolean
}

interface UnmarshalBinaryRes {
  frame: Frame
  offset: number
}

class Derive {
  private readonly DerivationVersion0: number = 0
  private readonly MaxFrameLen: number = 1_000_000
  private readonly DataLengths: any

  constructor () {
    this.DataLengths = {
      ChannelIDLength: 16,
      FrameNumberLength: 2,
      FrameDataLength: 4,
      IsLastLength: 1
    }
  }

  async parseFrames (data: Buffer | string): Promise<Frame[]> {
    if (typeof data === 'string') {
      if (data.startsWith('0x')) {
        data = data.slice(2)
      }
      data = Buffer.from(data, 'hex')
    }
  
    if (data.length === 0) {
      throw new Error('data array must not be empty')
    }
  
    if (data[0] !== this.DerivationVersion0) {
      throw new Error(`invalid derivation format byte: got ${data[0]}`)
    }
  
    let buf = data.subarray(1)
    let frames: Frame[] = []
    if (buf.length > 0) {
      try {
        const { frame, offset } = await this.unmarshalBinary(buf)
        frames.push(frame)
        buf = buf.subarray(offset)
      } catch (err) {
        throw new Error(`parsing frame ${frames.length}: ${err.message}`)
      }
    }
  
    if (buf.length !== 0) {
      throw new Error(`did not fully consume data: have ${frames.length} frames and $${buf.length} bytes left`)
    }
  
    if (frames.length === 0) {
      throw new Error('was not able to find any frames')
    }
  
    return frames
  }
  
  private async unmarshalBinary (buf: Buffer): Promise<UnmarshalBinaryRes> {
    let offset: number = 0
  
    if (buf.length < offset + this.DataLengths.ChannelIDLength) {
      throw new Error('reading channel_id: unexpected EOF')
    }
    const channelId: string = buf.subarray(offset, offset + this.DataLengths.ChannelIDLength).toString('hex')
    offset += this.DataLengths.ChannelIDLength
  
    if (buf.length < offset + this.DataLengths.FrameNumberLength) {
      throw new Error('reading frameNumber: unexpected EOF')
    }
    const frameNumber: number = buf.readUInt16BE(offset)
    offset += this.DataLengths.FrameNumberLength
  
    if (buf.length < offset + this.DataLengths.FrameDataLength) {
      throw new Error('reading frameDataLength: unexpected EOF')
    }
    const frameLength: number = buf.readUInt32BE(offset)
    offset += this.DataLengths.FrameDataLength
  
    if (frameLength > this.MaxFrameLen) {
      throw new Error(`frameDataLength is too large: ${frameLength}`)
    }
  
    if (buf.length < offset + frameLength) {
      throw new Error('reading frameData: unexpected EOF')
    }
    const data = buf.subarray(offset, offset + frameLength)
    offset += frameLength
  
    if (buf.length < offset + this.DataLengths.IsLastLength) {
      throw new Error('reading isLast: unexpected EOF')
    }
    const isLastByte = buf.readUInt8(offset)
    offset += this.DataLengths.IsLastLength
  
    let isLast: boolean
    if (isLastByte === 0) {
      isLast = false
    } else if (isLastByte === 1) {
      isLast = true
    } else {
      throw new Error('invalid byte as isLast')
    }
  
    return {
      frame: {
        channelId,
        frameNumber,
        data,
        isLast
      },
      offset
    }
  }
}


export default OptimismBridgeWatcher
