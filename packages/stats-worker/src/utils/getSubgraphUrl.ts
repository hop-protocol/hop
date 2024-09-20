import { type NetworkSlug, type ChainSlug, getChain } from '@hop-protocol/sdk/chains'

export function getSubgraphUrl (
  chain: string,
  regenesisEnabled: boolean = false
) {
  if (regenesisEnabled) {
    return `http://localhost:8000/subgraphs/name/hop-protocol/hop-${chain}`
  }

  const networkSlug = 'mainnet' as NetworkSlug
  const chainSlug = chain as ChainSlug
  const url = getChain(networkSlug, chainSlug)?.subgraphUrl
  if (!url) {
    throw new Error(`subgraph url not found for chain ${chain}`)
  }

  return url
}
