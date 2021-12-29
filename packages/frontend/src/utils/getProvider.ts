import { ethers } from 'ethers'
import memoize from 'fast-memoize'
import { getAllRpcUrls, getRpcUrl } from '.'

export const getProvider = memoize((rpcUrl: string) => {
  if (rpcUrl.startsWith('ws')) {
    return new ethers.providers.WebSocketProvider(rpcUrl)
  }

  return new ethers.providers.StaticJsonRpcProvider({
    url: rpcUrl,
    timeout: 60 * 1000,
  })
})

export function getProviderByNetworkName(networkName: string) {
  const rpcUrl = getRpcUrl(networkName)
  return getProvider(rpcUrl)
}

export function getAllProviders() {
  const allRpcUrls = getAllRpcUrls()
  const allProviders = {}
  for (const networkKey in allRpcUrls) {
    allProviders[networkKey] = getProvider(allRpcUrls[networkKey])
  }
  return allProviders
}
