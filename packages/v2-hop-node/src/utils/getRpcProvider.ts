import { getRpcProviderFromUrl } from './getRpcProviderFromUrl.js'
import type { providers } from 'ethers'
import { CoreEnvironment } from '#config/index.js'
import { type ChainSlug, getChain, isValidChainSlug } from '@hop-protocol/sdk'

export const getRpcProvider = (chainSlugOrId: ChainSlug | string): providers.Provider => {
  let chainSlug: ChainSlug
  if (isValidChainSlug(chainSlugOrId)) {
    chainSlug = chainSlugOrId
  } else {
    chainSlug = getChain(chainSlugOrId).slug
  }

  const coreEnvironmentVariables = CoreEnvironment.getInstance().getEnvironment()
  const rpcUrl = coreEnvironmentVariables.rpcUrls?.[chainSlug]
  if (!rpcUrl) {
    throw new Error('rpcUrl not found')
  }
  return getRpcProviderFromUrl(rpcUrl)
}
