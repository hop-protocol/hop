import FinalityService from '../../Services/FinalityService'
import { IFinalityService } from '../../IChainBridge'
import { IInclusionService } from './inclusion/IInclusionService'
import { providers } from 'ethers'

type CachedCustomSafeBlockNumber = {
  lastCacheTimestampMs: number
  l2BlockNumberCustomSafe: number
}

export class Finality extends FinalityService implements IFinalityService {
  private customSafeBlockNumberCache: CachedCustomSafeBlockNumber
  private readonly inclusionService: IInclusionService

  constructor (chainSlug: string, inclusionService: IInclusionService) {
    super(chainSlug)

    this.inclusionService = inclusionService
    this.customSafeBlockNumberCache = {
      lastCacheTimestampMs: 0,
      l2BlockNumberCustomSafe: 0
    }
  }

  async getCustomSafeBlockNumber (): Promise<number | undefined> {
    if (
      !this.inclusionService?.getLatestL1InclusionTxBeforeBlockNumber ||
      !this.inclusionService?.getLatestL2TxFromL1ChannelTx
    ) {
      this.logger.error('getCustomSafeBlockNumber: includeService not available')
      return
    }

    // Use a cache since the granularity of finality updates on l1 is on the order of minutes
    if (
      this._hasCacheBeenSet() &&
      !this._isCacheExpired()
    ) {
      const cacheValue = this.customSafeBlockNumberCache.l2BlockNumberCustomSafe
      this.logger.info(`getCustomSafeBlockNumber: using cached value ${cacheValue}`)
      return cacheValue
    }

    // Always update the cache with the latest block number. If the following calls fail, the cache
    // will never be updated and we will get into a loop.
    const now = Date.now()
    this._updateCache(now)

    // Get the latest checkpoint on L1
    const l1SafeBlock: providers.Block = await this.l1Wallet.provider!.getBlock('safe')
    const l1InclusionTx = await this.inclusionService.getLatestL1InclusionTxBeforeBlockNumber(l1SafeBlock.number)
    if (!l1InclusionTx) {
      this.logger.error(`getCustomSafeBlockNumber: no L1 inclusion tx found before block ${l1SafeBlock.number}`)
      return
    }

    // Derive the L2 block number from the L1 inclusion tx
    const latestSafeL2Tx = await this.inclusionService.getLatestL2TxFromL1ChannelTx(l1InclusionTx.transactionHash)
    const customSafeBlockNumber = latestSafeL2Tx?.blockNumber
    if (!customSafeBlockNumber) {
      this.logger.error(`getCustomSafeBlockNumber: no L2 tx found for L1 inclusion tx ${l1InclusionTx.transactionHash}`)
      return
    }

    this._updateCache(now, customSafeBlockNumber)
    return customSafeBlockNumber
  }

  private _hasCacheBeenSet (): boolean {
    return this.customSafeBlockNumberCache.l2BlockNumberCustomSafe !== 0
  }

  private _isCacheExpired (): boolean {
    const now = Date.now()
    const cacheExpirationTimeMs = 60 * 1000
    const lastCacheTimestampMs = this.customSafeBlockNumberCache.lastCacheTimestampMs
    return now - lastCacheTimestampMs > cacheExpirationTimeMs
  }

  private _updateCache (lastCacheTimestampMs: number, l2BlockNumber?: number): void {
    const l2BlockNumberCustomSafe: number = l2BlockNumber ?? this.customSafeBlockNumberCache.l2BlockNumberCustomSafe
    this.customSafeBlockNumberCache = {
      lastCacheTimestampMs,
      l2BlockNumberCustomSafe
    }
  }
}

export default Finality
