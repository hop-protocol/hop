import { providers } from 'ethers'
import { CoreEnvironment } from '#config/config.js'
import type { ChainSlug } from '@hop-protocol/sdk'

const cache: Record<string, providers.Provider> = {}
export const getNonRetryableRpcProvider = (chainSlug: ChainSlug): providers.Provider => {
  const coreEnvironmentVariables = CoreEnvironment.getInstance().getEnvironment()
  const rpcUrl = coreEnvironmentVariables.rpcUrls?.[chainSlug]
  const cacheKey = rpcUrl
  const cachedValue = cache[cacheKey]
  if (cachedValue) {
    return cachedValue
  }

  const provider = new providers.StaticJsonRpcProvider({ allowGzip: true, url: rpcUrl })
  cache[cacheKey] = provider
  return provider
}
