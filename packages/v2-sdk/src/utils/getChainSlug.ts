import { BigNumberish } from 'ethers'
import { chainSlugMap } from '#utils/index.js'

export function getChainSlug(chainId: BigNumberish): string {
  const chainSlug = chainSlugMap[chainId.toString()]
  if (!chainSlug) {
    // throw new Error(`Invalid chain: ${chainId}`)
    console.warn(`Invalid chain: ${chainId}, returning unknown chain slug`) // TODO: check if this is the correct way to handle this
    return 'unknown'
  }

  return chainSlug
}
