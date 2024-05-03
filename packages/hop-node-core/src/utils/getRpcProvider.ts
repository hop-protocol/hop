import { getRpcProviderFromUrl } from './getRpcProviderFromUrl.js'
import type { providers } from 'ethers'
import { CoreEnvironment } from '#config/index.js'
import { type ChainSlug} from '@hop-protocol/sdk'

export const getRpcProvider = (chainSlug: ChainSlug): providers.Provider => {
  const coreEnvironmentVariables = CoreEnvironment.getInstance().getEnvironment()
  const rpcUrl = coreEnvironmentVariables.rpcUrls?.[chainSlug]
  if (!rpcUrl) {
    throw new Error('rpcUrl not found')
  }
  return getRpcProviderFromUrl(rpcUrl)
}
