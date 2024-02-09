import getNonRetryableRpcProviderFromUrl from './getNonRetryableRpcProviderFromUrl'
import getRpcUrl from './getRpcUrl'
import { Provider } from 'ethers'

export const getNonRetryableRpcProvider = (network: string): Provider => {
  const rpcUrl = getRpcUrl(network)
  return getNonRetryableRpcProviderFromUrl(rpcUrl)
}

export default getNonRetryableRpcProvider
