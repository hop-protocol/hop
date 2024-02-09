import { Chain } from 'src/constants'
import { Provider } from 'ethers'

export enum FinalityStrategyType {
  Bonder = 'bonder',
  Collateralized = 'collateralized',
  Default = 'default',
  Threshold = 'threshold'
}

export interface IFinalityStrategy {
  getBlockNumber(): Promise<number>
  getSafeBlockNumber(): Promise<number>
  getFinalizedBlockNumber(): Promise<number>
  getCustomBlockNumber?(): Promise<number>
}

export type Strategy = new (provider: Provider, chainSlug: Chain) => IFinalityStrategy

export type Strategies = Partial<{
  [value in Chain]: Strategy
}>
