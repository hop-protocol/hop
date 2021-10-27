import { providers } from 'ethers'

const cache: any = {}

const getRpcProviderFromUrl = (
  rpcUrls: string | string[]
): providers.Provider => {
  if (!Array.isArray(rpcUrls)) {
    rpcUrls = [rpcUrls]
  }
  const cacheKey = rpcUrls.join(',')
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }
  const _providers: providers.StaticJsonRpcProvider[] = []
  for (const rpcUrl of rpcUrls) {
    const provider = new providers.StaticJsonRpcProvider(rpcUrl)
    if (rpcUrls.length === 1) {
      cache[cacheKey] = provider
      return provider
    }
    _providers.push(provider)
  }
  const fallbackProvider = new providers.FallbackProvider(_providers, 1)
  cache[cacheKey] = fallbackProvider
  return fallbackProvider
}

export default getRpcProviderFromUrl
