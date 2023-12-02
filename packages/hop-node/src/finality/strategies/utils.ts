import getChainBridge from 'src/chains/getChainBridge'
import { Chain } from 'src/constants'

export async function getCustomOptimismSafeBlockNumber (chainSlug: Chain): Promise<number | undefined> {
  const chainBridge = getChainBridge(chainSlug)
  if (!chainBridge?.getCustomSafeBlockNumber) {
    throw new Error(`getCustomOptimismSafeBlockNumber not implemented for chain ${this.chainSlug}`)
  }

  try {
    const customSafeBlockNumber: number | undefined = await chainBridge.getCustomSafeBlockNumber()
    if (customSafeBlockNumber) {
      return customSafeBlockNumber
    }
  } catch {}
}
