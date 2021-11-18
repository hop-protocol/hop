import { ethers } from 'ethers'
import memoize from 'fast-memoize'
import { getAllRpcUrls, getRpcUrlByNetworkName } from './getRpcUrl'

const getProvider = memoize((rpcUrl: string) => {
  if (rpcUrl.startsWith('ws')) {
    return new ethers.providers.WebSocketProvider(rpcUrl)
  }

  return new ethers.providers.StaticJsonRpcProvider(rpcUrl)
})

export function getProviderByNetworkName(networkName) {
  const rpcUrl = getRpcUrlByNetworkName(networkName)
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

export default getProvider
