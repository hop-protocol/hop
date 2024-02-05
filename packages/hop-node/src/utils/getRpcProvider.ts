import getRpcProviderFromUrl from './getRpcProviderFromUrl'
import getRpcUrl from './getRpcUrl'
import { providers } from 'ethers'

export const getRpcProvider = (network: string): providers.Provider => {
  const rpcUrl = getRpcUrl(network)
  return getRpcProviderFromUrl(rpcUrl)
}

export default getRpcProvider
