import { providers } from 'ethers'

const cache: Record<string, providers.Provider> = {}

export const getNonRetryableRpcProviderFromUrl = (
  rpcUrl: string
): providers.Provider => {
  const cacheKey = rpcUrl
  const cachedValue = cache[cacheKey]
  if (cachedValue) {
    return cachedValue
  }

  const provider = new providers.StaticJsonRpcProvider({ allowGzip: true, url: rpcUrl })
  cache[cacheKey] = provider
  return provider
}
