import getRpcProviderFromUrl from './getRpcProviderFromUrl'
import getRpcUrls from './getRpcUrls'
import { providers } from 'ethers'

const getRpcProvider = (network: string): providers.Provider | null => {
  const rpcUrls = getRpcUrls(network)
  if (!rpcUrls?.length) {
    return null
  }
  return getRpcProviderFromUrl(rpcUrls)
}

export default getRpcProvider
