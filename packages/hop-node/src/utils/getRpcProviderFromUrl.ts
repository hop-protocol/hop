import { Provider } from '../provider'
import { providers } from 'ethers'

const cache: any = {}

const getRpcProviderFromUrl = (
  rpcUrl: string
): providers.Provider => {
  const cacheKey = rpcUrl
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }
  const provider = new Provider(rpcUrl)
  cache[cacheKey] = provider
  return provider
}

export default getRpcProviderFromUrl
