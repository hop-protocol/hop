import getChainBridge from 'src/chains/getChainBridge'
import { Chain } from 'src/constants'
import { FinalityState } from '@hop-protocol/core/config'
import { HopChainFinalityStrategy } from './HopChainFinalityStrategy'
import { IFinalityStrategy } from '../IFinalityStrategy'
import { providers } from 'ethers'

export class HopOptimismFinalityStrategy extends HopChainFinalityStrategy implements IFinalityStrategy {
  constructor (provider: providers.Provider) {
    super(provider, Chain.Optimism)
  }

  getBlockNumber = async (): Promise<number> => {
    return this.provider.getBlockNumber()
  }

  getSafeBlockNumber = async (): Promise<number> => {
    return this._getSafeBlockNumber()
  }

  getFinalizedBlockNumber = async (): Promise<number> => {
    const block = await this.provider.getBlock(FinalityState.Finalized)
    return Number(block.number)
  }

  getSyncHeadBlockNumber = async (): Promise<number> => {
    return this.getBlockNumber()
  }

  private readonly _getSafeBlockNumber = async (): Promise<number> => {
    const chainBridge = getChainBridge(this.chainSlug)
    if (!chainBridge?.getCustomSafeBlockNumber) {
      throw new Error(`getCustomFinalityBlockNumber not implemented for chain ${this.chainSlug}`)
    }

    try {
      const customSafeBlockNumber: number | undefined = await chainBridge.getCustomSafeBlockNumber()
      if (customSafeBlockNumber) {
        return customSafeBlockNumber
      }
    } catch {}

    // Optimism's safe can be reorged, so we must use finalized block number as the safe block number if
    // the custom implementation is not available.
    return this.getFinalizedBlockNumber()
  }
}
