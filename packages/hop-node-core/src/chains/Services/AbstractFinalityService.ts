import getRpcProvider from 'src/utils/getRpcProvider'
import { AbstractService } from 'src/chains/Services/AbstractService'
import { CacheService } from 'src/chains/Services/CacheService'
import { Chain } from 'src/constants'
import { FinalityBlockTag } from 'src/chains/IChainBridge'
import { providers } from 'ethers'

export interface IFinalityService {
  getCustomBlockNumber(blockTag: FinalityBlockTag): Promise<number | undefined>
}

export abstract class AbstractFinalityService extends AbstractService {
  protected cache: CacheService
  protected l1Provider: providers.Provider
  protected l2Provider: providers.Provider

  constructor (chainSlug: string) {
    super(chainSlug)
    this.cache = new CacheService()
    this.l1Provider = getRpcProvider(Chain.Ethereum)
    this.l2Provider = getRpcProvider(this.chainSlug)
  }

  /**
   * To be overridden by subclasses that support custom block numbers
   */
  async getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    throw new Error(`Custom block number not supported for ${this.chainSlug}`)
  }
}
