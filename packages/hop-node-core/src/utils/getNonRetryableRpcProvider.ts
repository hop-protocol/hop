import { getNonRetryableRpcProviderFromUrl } from './getNonRetryableRpcProviderFromUrl.js'
import { getRpcUrl } from './getRpcUrl.js'
import type { providers } from 'ethers'

export const getNonRetryableRpcProvider = (network: string): providers.Provider => {
  const rpcUrl = getRpcUrl(network)
  return getNonRetryableRpcProviderFromUrl(rpcUrl)
}
