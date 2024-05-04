import type { providers } from 'ethers'
import type { ChainSlug } from '@hop-protocol/sdk'

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

export type Strategy = new (provider: providers.Provider, chainSlug: ChainSlug) => IFinalityStrategy

export type Strategies = Partial<{
  [value in ChainSlug]: Strategy
}>
