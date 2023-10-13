import getNonRetryableRpcProviderFromUrl from './getNonRetryableRpcProviderFromUrl'
import getRpcUrl from './getRpcUrl'
import { providers } from 'ethers'

export const getNonRetryableRpcProvider = (network: string): providers.Provider | null => {
  const rpcUrl = getRpcUrl(network)
  if (!rpcUrl) {
    return null
  }
  return getNonRetryableRpcProviderFromUrl(rpcUrl)
}

export default getNonRetryableRpcProvider
