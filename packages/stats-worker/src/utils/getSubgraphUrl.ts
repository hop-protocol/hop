import { mainnet as mainnetAddresses } from '@hop-protocol/sdk/addresses'

export function getSubgraphUrl (
  chain: string,
  regenesisEnabled: boolean = false
) {
  if (regenesisEnabled) {
    return `http://localhost:8000/subgraphs/name/hop-protocol/hop-${chain}`
  }

  const url = (mainnetAddresses as any)[chain]?.subgraphUrl
  if (!url) {
    throw new Error(`subgraph url not found for chain ${chain}`)
  }

  return url
}
