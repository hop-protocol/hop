import chainIdToSlug from './chainIdToSlug'
import getRpcProviderFromUrl from './getRpcProviderFromUrl'
import getRpcUrl from './getRpcUrl'
import { providers } from 'ethers'

export const getRpcProvider = (chainOrChainId: string | number): providers.Provider => {
  if (typeof chainOrChainId === 'number') {
    chainOrChainId = chainIdToSlug(chainOrChainId)
  }
  const rpcUrl = getRpcUrl(chainOrChainId)
  return getRpcProviderFromUrl(rpcUrl)
}

export default getRpcProvider
