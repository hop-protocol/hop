import { providers } from 'ethers'

const cache: any = {}

const getNonRetryableRpcProviderFromUrl = (
  rpcUrl: string
): providers.Provider => {
  const cacheKey = rpcUrl
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }

  const provider = new providers.StaticJsonRpcProvider(rpcUrl)
  cache[cacheKey] = provider
  return provider
}

export default getNonRetryableRpcProviderFromUrl
