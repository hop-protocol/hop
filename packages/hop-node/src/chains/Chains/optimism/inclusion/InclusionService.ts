import Derive, { Frame } from './Derive'
import Logger from 'src/logger'
import zlib from 'zlib'
import { AvgBlockTimeSeconds, Chain, L1ToL2CheckpointTimeInL1Blocks } from 'src/constants'
import { Contract, Signer, providers } from 'ethers'
import { InclusionServiceConfig } from './IInclusionService'
import { OptimismSuperchainCanonicalAddresses } from '@hop-protocol/core/addresses'
import { RLP } from '@ethereumjs/rlp'
import { TransactionFactory } from '@ethereumjs/tx'
import { getCanonicalAddressesForChain } from 'src/config'

interface Channel {
  transactionHashes: string[]
  numL1BlocksInChannel: number
}

interface Batch {
  transactionHashes: string[]
  numL1BlocksInBatch: number
}

abstract class InclusionService {
  derive: Derive = new Derive()
  chainSlug: string
  l1Wallet: Signer
  l2Wallet: Signer
  logger: Logger
  batcherAddress: string
  batchInboxAddress: string
  l1BlockSetterAddress: string
  l1BlockAddress: string
  l1BlockContract: Contract

  constructor (config: InclusionServiceConfig) {
    this.chainSlug = config.chainSlug
    this.l1Wallet = config.l1Wallet
    this.l2Wallet = config.l2Wallet
    const prefix = `${this.chainSlug}`
    const tag = this.constructor.name
    this.logger = new Logger({
      tag,
      prefix,
      color: 'blue'
    })

    // System addresses and precompiles
    this.l1BlockSetterAddress = '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001'
    this.l1BlockAddress = '0x4200000000000000000000000000000000000015'

    // Addresses from config
    const canonicalAddresses: OptimismSuperchainCanonicalAddresses = getCanonicalAddressesForChain(this.chainSlug)
    this.batcherAddress = canonicalAddresses?.batcherAddress ?? ''
    this.batchInboxAddress = canonicalAddresses?.batchInboxAddress ?? ''
    if (!this.batcherAddress || !this.batchInboxAddress) {
      throw new Error(`canonical addresses not found for ${this.chainSlug}`)
    }

    const l1BlockAbi: string[] = [
      'function number() view returns (uint64)',
      'function sequenceNumber() view returns (uint64)',
      'function timestamp() view returns (uint64)',
      'function setL1BlockValues(uint64, uint64, uint256, bytes32, uint64, bytes32, uint256, uint256)'
    ]
    this.l1BlockContract = new Contract(this.l1BlockAddress, l1BlockAbi, this.l2Wallet)
  }

  async getApproximateL2BlockNumberAtL1Timestamp (l1Timestamp: number): Promise<number> {
    // Get the difference between the desired l1 timestamp and the current l2 timestamp
    const currentL1TimestampOnL2: number = Number(await this.l1BlockContract.timestamp())
    const l1TimestampDiffSec = currentL1TimestampOnL2 - l1Timestamp
    const l1TimestampDiffInL2Blocks = Math.floor(l1TimestampDiffSec / AvgBlockTimeSeconds[this.chainSlug])

    // Get the l2 block number at the desired l1 timestamp
    const currentL2BlockNumber: number = await this.l2Wallet.provider!.getBlockNumber()
    const l2BlockNumberAtTimeOfL1Tx: number = currentL2BlockNumber - l1TimestampDiffInL2Blocks

    // Include the constant buffer time it takes for a message to go from L1 to L2
    const numL2BlocksPerL1Block = AvgBlockTimeSeconds[Chain.Ethereum] / AvgBlockTimeSeconds[this.chainSlug]
    const l1DataLagInL2Blocks = L1ToL2CheckpointTimeInL1Blocks[this.chainSlug] * numL2BlocksPerL1Block
    return l2BlockNumberAtTimeOfL1Tx + l1DataLagInL2Blocks
  }

  async getL2TxHashesInChannel (l1TxHash: string): Promise<Channel> {
    const tx = await this.l1Wallet.provider!.getTransaction(l1TxHash)
    const frames: Frame[] = await this.derive.parseFrames(tx.data)

    let numL1BlocksInChannel: number = 0
    const l2TxHashes: string[] = []
    for (const frame of frames) {
      const decompressedChannel: Buffer = await this._decompressChannel(frame.data)
      const {
        transactionHashes,
        numL1BlocksInBatch
      } = await this._decodeBatch(decompressedChannel)
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

  private async _decodeBatch (channelDecompressed: Buffer): Promise<Batch> {
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

  isBatcherTx (tx: providers.TransactionResponse): boolean {
    if (
      tx.to &&
      tx.to.toLowerCase() === this.batchInboxAddress.toLowerCase() &&
      tx.from.toLocaleLowerCase() === this.batcherAddress.toLowerCase()
    ) {
      return true
    }
    return false
  }

  isL1BlockUpdateTx (tx: providers.TransactionResponse): boolean {
    if (
      tx.to &&
      tx.to.toLowerCase() === this.l1BlockAddress.toLowerCase() &&
      tx.from.toLocaleLowerCase() === this.l1BlockSetterAddress.toLowerCase()
    ) {
      return true
    }
    return false
  }

  doesL1BlockUpdateExceedL1BlockNumber (txData: string, l1BlockNumber: number): boolean {
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

export default InclusionService
