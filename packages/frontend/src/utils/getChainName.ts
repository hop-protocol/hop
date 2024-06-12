import { NetworkSlug, ChainSlug, getChain } from '@hop-protocol/sdk'
import { reactAppNetwork } from '#config/index.js'
import { networkIdToSlug } from './networks.js'

export function getChainName (chainId: string) {
  const chain = getChain(reactAppNetwork as NetworkSlug, networkIdToSlug(chainId) as ChainSlug)
  return chain?.name ?? ''
}
