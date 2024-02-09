import getRpcProviderFromUrl from './getRpcProviderFromUrl'
import getRpcUrl from './getRpcUrl'
import { Provider } from 'ethers'

export const getRpcProvider = (network: string): Provider => {
  const rpcUrl = getRpcUrl(network)
  return getRpcProviderFromUrl(rpcUrl)
}

export default getRpcProvider
