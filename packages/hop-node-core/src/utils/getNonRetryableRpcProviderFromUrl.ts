import { providers } from 'ethers'

const cache: Record<string, providers.Provider> = {}

const getNonRetryableRpcProviderFromUrl = (
  rpcUrl: string
): providers.Provider => {
  const cacheKey = rpcUrl
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }

  const provider = new providers.StaticJsonRpcProvider({ allowGzip: true, url: rpcUrl })
  cache[cacheKey] = provider
  return provider
}

export default getNonRetryableRpcProviderFromUrl
