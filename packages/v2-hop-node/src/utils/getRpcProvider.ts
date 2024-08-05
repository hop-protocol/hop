import { getRpcProviderFromUrl } from './getRpcProviderFromUrl.js'
import type { providers } from 'ethers'
import { SharedConfig } from '#config/index.js'
import { type ChainSlug, getChain, isValidChainSlug } from '@hop-protocol/sdk'

export const getRpcProvider = (chainSlugOrId: ChainSlug | string): providers.Provider => {
  let chainSlug: ChainSlug
  if (isValidChainSlug(chainSlugOrId)) {
    chainSlug = chainSlugOrId
  } else {
    chainSlug = getChain(chainSlugOrId).slug
  }

  const rpcUrl = SharedConfig.chains[chainSlug as ChainSlug]?.rpcUrl
  if (!rpcUrl) {
    throw new Error(`rpcUrl not found for chainSlug: ${chainSlug}`)
  }
  return getRpcProviderFromUrl(rpcUrl)
}
