import InclusionService from './InclusionService'
import { AvgBlockTimeSeconds, Chain } from 'src/constants'
import { BlockWithTransactions } from '@ethersproject/abstract-provider'
import { providers } from 'ethers'

class JsonRpcInclusionService extends InclusionService {
  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    const receipt: providers.TransactionReceipt = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    const safeL2Block: providers.Block = await this.l2Wallet.provider!.getBlock('safe')

    // If the tx is not yet safe, it is not checkpointed
    if (receipt.blockNumber > safeL2Block.number) {
      this.logger.debug(`l2 block number ${receipt.blockNumber} is not yet included (last included block ${safeL2Block.number})`)
      return
    }

    // Retrieve the L1 block the tx was included in
    const l1InclusionTxForSafeBlock = await this._getL1InclusionTxFromSafeL2Block(safeL2Block)
    if (!l1InclusionTxForSafeBlock) {
      this.logger.debug(`could not find l1 inclusion tx for l2 tx hash ${l2TxHash}`)
      return
    }

    // If the tx was checkpointed in the current epoch, then the tx is in the checkpoint block
    const { transactionHashes } = await this.getL2TxHashesInChannel(l1InclusionTxForSafeBlock.transactionHash)
    if (transactionHashes.includes(l2TxHash.toLowerCase())) {
      return l1InclusionTxForSafeBlock
    }

    // This does not guarantee that the tx was checkpointed in the previous epoch, but it is all
    // that is needed for practical purposes. Finding an exact checkpoint block for any given
    // tx is very resource intensive (RPC calls).
    // To look back farther, we can put the next function through a while loop until found

    // Return the previous checkpoint block
    return this._getPreviousCheckpointBlock(l1InclusionTxForSafeBlock)
  }

  private async _getL1InclusionTxFromSafeL2Block (safeL2Block: providers.Block | BlockWithTransactions): Promise<providers.TransactionReceipt | undefined> {
    const [
      l1OriginBlockNum,
      l1OriginTimestamp
    ] = await Promise.all([
      Number(await this.l1BlockContract.number({ blockTag: safeL2Block.number })),
      Number(await this.l1BlockContract.timestamp({ blockTag: safeL2Block.number }))
    ])

    // Get num blocks from l1 origin tx to expected checkpoint of safe l2 tx
    const timestampDiff: number = safeL2Block.timestamp - l1OriginTimestamp
    const numL1BlocksAfterOriginTx = Math.floor(Math.floor(timestampDiff) / AvgBlockTimeSeconds[Chain.Ethereum]) + 1
    const expectedCheckpointBlock = l1OriginBlockNum + numL1BlocksAfterOriginTx

    // Some variance may exist so get multiple blocks
    const possibleCheckpointBlocks = await this._getPossibleCheckpointBlock(expectedCheckpointBlock)
    for (const checkpointBlock of possibleCheckpointBlocks) {
      for (const tx of checkpointBlock.transactions) {
        if (this.isBatcherTx(tx)) {
          return this.l1Wallet.provider!.getTransactionReceipt(tx.hash)
        }
      }
    }
  }

  private async _getPreviousCheckpointBlock (l1InclusionTx: providers.TransactionReceipt): Promise<providers.TransactionReceipt | undefined> {
    const { numL1BlocksInChannel } = await this.getL2TxHashesInChannel(l1InclusionTx.transactionHash)

    // Some variance may exist so get multiple blocks
    const expectedCheckpointBlock = l1InclusionTx.blockNumber - numL1BlocksInChannel
    const possibleCheckpointBlocks = await this._getPossibleCheckpointBlock(expectedCheckpointBlock)

    for (const checkpointBlock of possibleCheckpointBlocks) {
      for (const tx of checkpointBlock.transactions) {
        if (this.isBatcherTx(tx)) {
          return this.l1Wallet.provider!.getTransactionReceipt(tx.hash)
        }
      }
    }
  }

  private async _getPossibleCheckpointBlock (expectedCheckpointBlockNum: number): Promise<BlockWithTransactions[]> {
    return Promise.all([
      await this.l1Wallet.provider!.getBlockWithTransactions(expectedCheckpointBlockNum - 1),
      await this.l1Wallet.provider!.getBlockWithTransactions(expectedCheckpointBlockNum),
      await this.l1Wallet.provider!.getBlockWithTransactions(expectedCheckpointBlockNum + 1)
    ])
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    const l1BlockNumber: number = (await this.l1Wallet.provider!.getTransactionReceipt(l1TxHash)).blockNumber
    const l2InclusionBlockNumber = await this._traverseL2BlocksForInclusion(l1BlockNumber)

    const txs = (await this.l2Wallet.provider!.getBlockWithTransactions(l2InclusionBlockNumber)).transactions
    for (const tx of txs) {
      if (this.isL1BlockUpdateTx(tx)) {
        return this.l2Wallet.provider!.getTransactionReceipt(tx.hash)
      }
    }
    throw new Error(`getL2InclusionTx: inclusion tx does not exist in block ${l2InclusionBlockNumber}`)
  }

  private async _traverseL2BlocksForInclusion (l1BlockNumber: number): Promise<number> {
    const l1Block = await this.l1Wallet.provider!.getBlock(l1BlockNumber)
    let l2BlockNumber = await this.getApproximateL2BlockNumberAtL1Timestamp(l1Block.timestamp)
    let includedL1BlockNumber: number = Number(await this.l1BlockContract.number({ blockTag: l2BlockNumber }))

    // If the includedL1BlockNumber is still too large, decrement until it is not
    // This may happen if proposals on L1 are missed
    const numL2BlocksPerL1Block = AvgBlockTimeSeconds[Chain.Ethereum] / AvgBlockTimeSeconds[this.chainSlug]
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
}

export default JsonRpcInclusionService
