import { config } from '../config'

export function getSubgraphUrl (network: string, chain: string): string {
  if (!config[network]) {
    throw new Error(`config for network ${network} not found`)
  }
  const url = config[network]?.chains?.[chain]?.subgraphUrl
  if (!url) {
    throw new Error(`subgraph url not found for chain ${chain}`)
  }

  return url
}
