import { providers } from 'ethers'
import { getProviderWithFallbacks } from '@hop-protocol/sdk-core'

export function getProviderFromUrl (rpcUrl: string | string[]): providers.Provider {
  const rpcUrls = Array.isArray(rpcUrl) ? rpcUrl : [rpcUrl]
  return getProviderWithFallbacks(rpcUrls)
}
