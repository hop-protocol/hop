import { Chain } from 'src/constants'
import { providers } from 'ethers'

// TODO: Can chains be more specific?

export type Strategy = new (provider: providers.Provider, chainSlug: Chain) => any

export type Strategies = Partial<{
  [value in Chain]: Strategy
}>

export interface IFinalityStrategy {
  getBlockNumber(): Promise<number>
  getSafeBlockNumber(): Promise<number>
  getFinalizedBlockNumber(): Promise<number>
  getSyncHeadBlockNumber(): Promise<number>
}
