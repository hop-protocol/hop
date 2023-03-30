import getRpcProviderFromUrl from './getRpcProviderFromUrl'
import getRpcUrl from './getRpcUrl'
import { providers } from 'ethers'

export const getRpcProvider = (network: string): providers.Provider | null => {
  const rpcUrl = getRpcUrl(network)
  if (!rpcUrl) {
    return null
  }
  return getRpcProviderFromUrl(rpcUrl)
}

export default getRpcProvider
