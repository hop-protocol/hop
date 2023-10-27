import { providers } from 'ethers'
import { Chain } from 'src/constants'

export abstract class HopChainFinalityStrategy {
  readonly provider: providers.Provider
  readonly chainSlug: Chain

  constructor (provider: providers.Provider, chainSlug: Chain) {
    this.provider = provider
    this.chainSlug = chainSlug
  }
}