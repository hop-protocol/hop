import { config } from '../config'

export function getSubgraphChains (network: string): string[] {
  const networks = config[network]?.chains
  const chains = new Set([])
  for (const chain in networks) {
    if (networks[chain]?.subgraphUrl) {
      chains.add(chain)
    }
  }

  return Array.from(chains)
}
