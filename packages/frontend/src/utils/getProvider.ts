import memoize from 'fast-memoize'
import { networks } from 'src/config'
import { getRpcUrls } from './getRpcUrl'
import { FallbackProvider } from '@hop-protocol/sdk'

export const getProvider = memoize((rpcUrl: string | string[]) => {
  const rpcUrls = Array.isArray(rpcUrl) ? rpcUrl : [rpcUrl]
  return FallbackProvider.fromUrls(rpcUrls)
})

export function getProviderByNetworkName(networkName: string) {
  const rpcUrls = getRpcUrls(networkName)
  return getProvider(rpcUrls)
}

export function getAllProviders() {
  const allProviders = {}
  for (const chain in networks) {
    allProviders[chain] = getProvider(chain)
  }
  return allProviders
}
