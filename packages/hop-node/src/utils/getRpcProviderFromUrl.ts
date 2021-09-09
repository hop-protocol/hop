import { providers } from 'ethers'

const getRpcProviderFromUrl = (
  rpcUrls: string | string[]
): providers.Provider => {
  const _providers: providers.StaticJsonRpcProvider[] = []
  if (!Array.isArray(rpcUrls)) {
    rpcUrls = [rpcUrls]
  }
  for (const rpcUrl of rpcUrls) {
    const provider = new providers.StaticJsonRpcProvider(rpcUrl)
    if (rpcUrls.length === 1) {
      return provider
    }
    _providers.push(provider)
  }
  const fallbackProvider = new providers.FallbackProvider(_providers, 1)
  return fallbackProvider
}

export default getRpcProviderFromUrl
