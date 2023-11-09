import { config } from '../config'

export function getSubgraphUrl (network: string, chain: string): string {
  const url = config[network]?.chains?.[chain]?.subgraphUrl
  if (!url) {
    throw new Error(`subgraph url not found for chain ${chain}`)
  }

  return url
}
