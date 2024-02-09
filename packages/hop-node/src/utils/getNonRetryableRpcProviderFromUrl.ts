import { Provider, JsonRpcProvider } from 'ethers'

const cache: any = {}

const getNonRetryableRpcProviderFromUrl = (
  rpcUrl: string
): Provider => {
  const cacheKey = rpcUrl
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }

  const provider = new JsonRpcProvider({ allowGzip: true, url: rpcUrl })
  cache[cacheKey] = provider
  return provider
}

export default getNonRetryableRpcProviderFromUrl
