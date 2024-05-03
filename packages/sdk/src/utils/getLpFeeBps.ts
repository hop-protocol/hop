import { BigNumber } from 'ethers'
import { Chain, ChainSlug } from '@hop-protocol/sdk-core'

// TODO: This is a temporary solution. Should retrieve from onchain and cache value.

const defaultFeeBps = 4
const customFeeBps: Record<string, number> = {
  [ChainSlug.PolygonZk]: 1,
  [ChainSlug.Nova]: 1
}

export function getLpFeeBps (chain: Chain): BigNumber {
  if (customFeeBps[chain.slug]) {
    return BigNumber.from(customFeeBps[chain.slug])
  }
  return BigNumber.from(defaultFeeBps)
}
