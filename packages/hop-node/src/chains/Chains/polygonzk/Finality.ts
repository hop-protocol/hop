import getRpcUrl from 'src/utils/getRpcUrl'
import { Chain } from 'src/constants'
import { FinalityBlockTag } from 'src/chains/IChainBridge'
import { FinalityService, IFinalityService } from '../../Services/FinalityService'
import { IInclusionService } from '../../Services/InclusionService'
import { providers } from 'ethers'

const finalityNameMap: Record<string, string> = {
  safe: 'virtual',
  finalized: 'verified' // also called consolidated in their docs
}

type Batch = {
  number: string
  coinbase: string
  stateRoot: string
  globalExitRoot: string
  mainnetExitRoot: string
  rollupExitRoot: string
  localExitRoot: string
  accInputHash: string
  timestamp: string
  sendSequencesTxHash: string
  // exists only if batch has been verified (finalized)
  verifyBatchTxHash: string | null
  // closed is true after all txs have been included, maybe 1-2s after the batch is created.
  closed: boolean
  blocks: string[]
  transactions: string[]
  batchL2Data: string
}

type RpcResponse = {
  result: any
}

export class PolygonZkFinalityService extends FinalityService implements IFinalityService {
  private readonly inclusionService: IInclusionService
  doesSupportZkEvmRpc: boolean

  constructor () {
    super()

    this.#init()
      .catch((err: any) => {
        this.logger.error('polygonZkEvm Finality initialize error:', err)
      })
  }

  async #init () {
    // Verify that the RPC endpoint supports the zkEVM_* RPC methods
    try {
      await this.#fetchRpcCall(`zkevm_${finalityNameMap[FinalityBlockTag.Safe]}BatchNumber`)
      this.doesSupportZkEvmRpc = true
    } catch (err) {
      this.logger.warn('RPC endpoint does not support zkEVM_* methods')
      this.doesSupportZkEvmRpc = false
    }
  }

  async getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    if (!this.doesSupportZkEvmRpc) {
      this.logger.error('getCustomBlockNumber: RPC endpoint does not support zkEVM_* methods')
      return
    }

    if (!this.#isCustomBlockNumberSupported(blockTag)) {
      this.logger.error(`getCustomBlockNumber: blockTag ${blockTag} not supported`)
      return
    }

    // Use a cache since the granularity of finality updates on l1 is on the order of minutes
    const customBlockNumberCacheKey = `${this.chainSlug}-${blockTag}`
    const cacheValue = this.getCacheValue(customBlockNumberCacheKey)
    if (cacheValue) {
      this.logger.debug('getCustomBlockNumber: using cached value')
      return cacheValue
    }

    // maybe try and then set cache?
    const customBlockNumber = await this.#getCustomBlockNumber(blockTag)
    if (!customBlockNumber) {
      this.logger.error('getCustomBlockNumber: no customBlockNumber found')
      return
    }

    this.updateCache(customBlockNumberCacheKey, customBlockNumber)
    return customBlockNumber
  }

  async #getCustomBlockNumber (blockTag: providers.BlockTag): Promise<number | undefined> {
    const finalityName = finalityNameMap[blockTag]

    // Get batch number
    const batchNumber: number | undefined = await this.#getBatchNumber(finalityName)
    if (!batchNumber) {
      this.logger.error('getCustomBlockNumber: no batchNumber found')
      return
    }

    // Arbitrarily wait for L1 safe by looking back 6 minutes after the batch was posted.
    // As of Dec 2023, it is not trivial to associate L1 blocks with L2 batch data. If Polygon zkEVM
    // ever exposes this ability, update this logic to be exact.
    const appxBatchesPerMin = 3
    const appxL1SafetyMin = 6
    const appxBatches = appxBatchesPerMin * appxL1SafetyMin
    const safeBatchNumber = batchNumber - appxBatches

    // Get batch info
    const batch: Batch | undefined = await this.#getBatch(safeBatchNumber)
    if (!batch?.blocks?.length) {
      this.logger.error('getCustomBlockNumber: no blocks found in batch')
      return
    }

    // Get latest block number from batch. The latest block number is the last block in the batch.
    const latestBlockHashInBatch = batch.blocks[batch.blocks.length - 1]
    const latestBlockInBatch: providers.Block = await this.l2Wallet.provider!.getBlock(latestBlockHashInBatch)
    if (!latestBlockInBatch?.number) {
      this.logger.error('getCustomBlockNumber: no latestBlockInBatch found')
      return
    }

    return latestBlockInBatch.number
  }

  async #getBatchNumber (finalityName: string): Promise<number | undefined> {
    let batchNumber: number | undefined
    try {
      const batchNumberRes: string = await this.#fetchRpcCall(`zkevm_${finalityName}BatchNumber`)
      batchNumber = Number(batchNumberRes)
    } catch {
      return
    }

    return batchNumber
  }

  async #getBatch (batchNumber: number): Promise<Batch | undefined> {
    let batch: Batch | undefined
    try {
      batch = await this.#fetchRpcCall('zkevm_getBatchByNumber', [batchNumber])
    } catch {
      return
    }
    return batch
  }

  async #fetchRpcCall (method: string, params: any[] = []): Promise<any> {
    const res = await fetch(getRpcUrl(Chain.PolygonZk)!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1
      })
    })

    const jsonRes = (await res.json()) as RpcResponse
    if (!jsonRes?.result) {
      throw new Error(`No response for ${method}, with params ${params}`)
    }
    return jsonRes.result
  }

  #isCustomBlockNumberSupported (blockTag: FinalityBlockTag): boolean {
    if (
      blockTag === FinalityBlockTag.Safe ||
      blockTag === FinalityBlockTag.Finalized
    ) {
      return true
    }
    return false
  }
}
