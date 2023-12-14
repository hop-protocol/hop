import AlchemyInclusionService from 'src/chains/Chains/optimism/inclusion/AlchemyInclusionService'
import { FinalityBlockTag } from 'src/chains/IChainBridge'
import { AbstractFinalityService, IFinalityService } from 'src/chains/Services/AbstractFinalityService'
import { providers } from 'ethers'

export class OptimismFinalityService extends AbstractFinalityService implements IFinalityService {
  readonly #inclusionService: AlchemyInclusionService

  constructor (chainSlug: string) {
    super(chainSlug)

    this.#inclusionService = new AlchemyInclusionService({
      chainSlug,
      l1Provider: this.l1Wallet.provider!,
      l2Provider: this.l2Wallet.provider!
    })
  }

  async getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    if (!this.#isCustomBlockNumberSupported(blockTag)) {
      throw new Error(`getCustomBlockNumber: blockTag ${blockTag} not supported`)
    }

    // Use a cache since the granularity of finality updates on l1 is on the order of minutes
    const customBlockNumberCacheKey = `${this.chainSlug}-${blockTag}`
    const cacheValue = this.cache.getCacheValue(customBlockNumberCacheKey)
    if (cacheValue) {
      this.logger.debug('getCustomBlockNumber: using cached value')
      return cacheValue
    }

    const customBlockNumber = await this.#getCustomBlockNumber(blockTag)
    if (!customBlockNumber) {
      this.logger.error('getCustomBlockNumber: no customBlockNumber found')
      return
    }

    this.cache.updateCache(customBlockNumberCacheKey, customBlockNumber)
    return customBlockNumber
  }

  async #getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    if (!this.#isCustomBlockNumberSupported(blockTag)) {
      throw new Error(`getCustomBlockNumber: blockTag ${blockTag} not supported`)
    }

    if (
      !this.#inclusionService?.getLatestL1InclusionTxBeforeBlockNumber ||
      !this.#inclusionService?.getLatestL2TxFromL1ChannelTx
    ) {
      this.logger.error('getCustomSafeBlockNumber: includeService not available')
      return
    }

    // Get the latest checkpoint on L1
    const l1SafeBlock: providers.Block = await this.l1Wallet.provider!.getBlock('safe')
    const l1InclusionTx = await this.#inclusionService.getLatestL1InclusionTxBeforeBlockNumber(l1SafeBlock.number)
    if (!l1InclusionTx) {
      this.logger.error(`getCustomSafeBlockNumber: no L1 inclusion tx found before block ${l1SafeBlock.number}`)
      return
    }

    // Derive the L2 block number from the L1 inclusion tx
    const latestSafeL2Tx = await this.#inclusionService.getLatestL2TxFromL1ChannelTx(l1InclusionTx.transactionHash)
    const customSafeBlockNumber = latestSafeL2Tx?.blockNumber
    if (!customSafeBlockNumber) {
      this.logger.error(`getCustomSafeBlockNumber: no L2 tx found for L1 inclusion tx ${l1InclusionTx.transactionHash}`)
      return
    }

    return customSafeBlockNumber
  }
  #isCustomBlockNumberSupported (blockTag: FinalityBlockTag): boolean {
    return blockTag === FinalityBlockTag.Safe
  }
}
