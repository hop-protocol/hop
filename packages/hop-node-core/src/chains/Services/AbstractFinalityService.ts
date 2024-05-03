import { AbstractService } from '../Services/AbstractService.js'
import { CacheService } from '../Services/CacheService.js'
import { ChainSlug } from '@hop-protocol/sdk'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import type { FinalityBlockTag } from '../IChainBridge.js'
import type { providers } from 'ethers'

export interface IFinalityService {
  getCustomBlockNumber(blockTag: FinalityBlockTag): Promise<number | undefined>
}

export abstract class AbstractFinalityService extends AbstractService {
  protected cache: CacheService
  protected l1Provider: providers.Provider
  protected l2Provider: providers.Provider

  constructor (chainSlug: ChainSlug) {
    super(chainSlug)
    this.cache = new CacheService()
    this.l1Provider = getRpcProvider(ChainSlug.Ethereum)
    this.l2Provider = getRpcProvider(this.chainSlug as ChainSlug)
  }

  /**
   * To be overridden by subclasses that support custom block numbers
   */
  async getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    throw new Error(`Custom block number not supported for ${this.chainSlug}`)
  }
}
