import { ethers } from 'ethers'
import memoize from 'fast-memoize'
import { getRpcUrlByNetworkName } from './getRpcUrl'

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

export default getProvider
