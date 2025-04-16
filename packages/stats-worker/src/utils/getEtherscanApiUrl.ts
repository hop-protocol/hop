import { getChain, NetworkSlug, ChainSlug } from '@hop-protocol/sdk'

export function getEtherscanApiUrl (chain: string) {
  return getChain(NetworkSlug.Mainnet, chain as ChainSlug)?.etherscanApiUrl
}
