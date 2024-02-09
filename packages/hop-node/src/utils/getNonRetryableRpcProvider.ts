import getNonRetryableRpcProviderFromUrl from './getNonRetryableRpcProviderFromUrl'
import getRpcUrl from './getRpcUrl'
import { providers } from 'ethers'

export const getNonRetryableRpcProvider = (network: string): providers.Provider => {
  const rpcUrl = getRpcUrl(network)
  return getNonRetryableRpcProviderFromUrl(rpcUrl)
}

export default getNonRetryableRpcProvider
