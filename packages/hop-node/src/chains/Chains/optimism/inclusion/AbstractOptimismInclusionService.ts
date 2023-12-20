import Derive, { Frame } from './Derive'
import zlib from 'zlib'
import { AbstractInclusionService } from 'src/chains/Services/AbstractInclusionService'
import { AvgBlockTimeSeconds, Chain, L1ToL2CheckpointTimeInL1Blocks } from 'src/constants'
import { Contract, providers } from 'ethers'
import { NetworkSlug } from '@hop-protocol/core/networks'
import { OptimismAddresses, OptimismCanonicalAddresses, OptimismSuperchainSlugs } from 'src/chains/Chains/optimism/OptimismAddresses'
import { RLP } from '@ethereumjs/rlp'
import { TransactionFactory } from '@ethereumjs/tx'

interface Channel {
  transactionHashes: string[]
  numL1BlocksInChannel: number
}

interface Batch {
  transactionHashes: string[]
  numL1BlocksInBatch: number
}

export abstract class AbstractOptimismInclusionService extends AbstractInclusionService {
  protected readonly derive: Derive = new Derive()
  protected readonly batcherAddress: string
  protected readonly batchInboxAddress: string
  protected readonly l1BlockSetterAddress: string
  protected readonly l1BlockAddress: string
  protected readonly l1BlockContract: Contract

  constructor (chainSlug: string) {
    super(chainSlug)

    const canonicalAddresses: OptimismCanonicalAddresses | undefined = OptimismAddresses.canonicalAddresses?.[this.networkSlug as NetworkSlug]?.[chainSlug as OptimismSuperchainSlugs]
    if (!canonicalAddresses) {
      throw new Error(`canonical addresses not found for ${this.chainSlug}`)
    }
    this.batcherAddress = canonicalAddresses?.batcherAddress
    this.batchInboxAddress = canonicalAddresses?.batchInboxAddress

    // Precompiles
    this.l1BlockSetterAddress = OptimismAddresses.precompiles.l1BlockSetterAddress
    this.l1BlockAddress = OptimismAddresses.precompiles.l1BlockAddress

    const l1BlockAbi: string[] = [
      'function number() view returns (uint64)',
      'function sequenceNumber() view returns (uint64)',
      'function timestamp() view returns (uint64)',
      'function setL1BlockValues(uint64, uint64, uint256, bytes32, uint64, bytes32, uint256, uint256)'
    ]
    this.l1BlockContract = new Contract(this.l1BlockAddress, l1BlockAbi, this.l2Provider)
  }

  protected async getApproximateL2BlockNumberAtL1Timestamp (l1Timestamp: number): Promise<number> {
    // Get the difference between the desired l1 timestamp and the current l2 timestamp
    const currentL1TimestampOnL2: number = Number(await this.l1BlockContract.timestamp())
    const l1TimestampDiffSec = currentL1TimestampOnL2 - l1Timestamp
    const l1TimestampDiffInL2Blocks = Math.floor(l1TimestampDiffSec / AvgBlockTimeSeconds[this.chainSlug])

    // Get the l2 block number at the desired l1 timestamp
    const currentL2BlockNumber: number = await this.l2Provider.getBlockNumber()
    const l2BlockNumberAtTimeOfL1Tx: number = currentL2BlockNumber - l1TimestampDiffInL2Blocks

    // Include the constant buffer time it takes for a message to go from L1 to L2
    const numL2BlocksPerL1Block = AvgBlockTimeSeconds[Chain.Ethereum] / AvgBlockTimeSeconds[this.chainSlug]
    const l1DataLagInL2Blocks = L1ToL2CheckpointTimeInL1Blocks[this.chainSlug] * numL2BlocksPerL1Block
    return l2BlockNumberAtTimeOfL1Tx + l1DataLagInL2Blocks
  }

  protected async getL2TxHashesInChannel (l1TxHash: string): Promise<Channel> {
    const tx = await this.l1Provider.getTransaction(l1TxHash)
    const frames: Frame[] = await this.derive.parseFrames(tx.data)

    let numL1BlocksInChannel: number = 0
    const l2TxHashes: string[] = []
    for (const frame of frames) {
      const decompressedChannel: Buffer = await this.#decompressChannel(frame.data)
      const {
        transactionHashes,
        numL1BlocksInBatch
      } = await this.#decodeBatch(decompressedChannel)
      numL1BlocksInChannel += numL1BlocksInBatch
      for (const txHash of transactionHashes) {
        l2TxHashes.push(txHash.toLowerCase())
      }
    }
    return {
      transactionHashes: l2TxHashes,
      numL1BlocksInChannel
    }
  }

  async #decompressChannel (frameData: Buffer): Promise<Buffer> {
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

  async #decodeBatch (channelDecompressed: Buffer): Promise<Batch> {
    // NOTE: We are using ethereumjs RPL package since ethers does not allow for a stream
    const stream = true
    let remainingBatches: Buffer = channelDecompressed
    let currentL1BlockNumInBatch: number = 0
    let numL1BlocksInBatch: number = 0
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

      const l1BlockNum = Number('0x' + Buffer.from(decodedBatch[1] as Buffer).toString('hex'))
      if (currentL1BlockNumInBatch !== l1BlockNum) {
        numL1BlocksInBatch++
        currentL1BlockNumInBatch = l1BlockNum
      }

      // Prep next loop
      remainingBatches = remainder as Buffer
      if (remainingBatches.length === 0) {
        return {
          transactionHashes,
          numL1BlocksInBatch
        }
      }
    }
  }

  protected isBatcherTx (tx: providers.TransactionResponse): boolean {
    if (
      tx.to &&
      tx.to.toLowerCase() === this.batchInboxAddress.toLowerCase() &&
      tx.from.toLocaleLowerCase() === this.batcherAddress.toLowerCase()
    ) {
      return true
    }
    return false
  }

  protected isL1BlockUpdateTx (tx: providers.TransactionResponse): boolean {
    if (
      tx.to &&
      tx.to.toLowerCase() === this.l1BlockAddress.toLowerCase() &&
      tx.from.toLocaleLowerCase() === this.l1BlockSetterAddress.toLowerCase()
    ) {
      return true
    }
    return false
  }

  protected doesL1BlockUpdateExceedL1BlockNumber (txData: string, l1BlockNumber: number): boolean {
    const setL1BlockValuesCalldata = this.l1BlockContract.interface.decodeFunctionData(
      'setL1BlockValues',
      txData
    )
    const l1BlockNumberFromCalldata: number = Number(setL1BlockValuesCalldata[0])
    if (l1BlockNumberFromCalldata >= l1BlockNumber) {
      return true
    }

    return false
  }
}
