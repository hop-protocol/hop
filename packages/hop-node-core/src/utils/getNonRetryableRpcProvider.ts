import { getRpcUrl } from './getRpcUrl.js'
import { providers } from 'ethers'

const cache: Record<string, providers.Provider> = {}
export const getNonRetryableRpcProvider = (network: string): providers.Provider => {
  const rpcUrl = getRpcUrl(network)
  const cacheKey = rpcUrl
  const cachedValue = cache[cacheKey]
  if (cachedValue) {
    return cachedValue
  }

  const provider = new providers.StaticJsonRpcProvider({ allowGzip: true, url: rpcUrl })
  cache[cacheKey] = provider
  return provider
}
