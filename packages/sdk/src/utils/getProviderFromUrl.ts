import { providers } from 'ethers'
import { getProviderWithFallbacks } from '#utils/getProviderWithFallbacks.js'

export function getProviderFromUrl (rpcUrl: string | string[]): providers.Provider {
  const rpcUrls = Array.isArray(rpcUrl) ? rpcUrl : [rpcUrl]
  return getProviderWithFallbacks(rpcUrls)
}
