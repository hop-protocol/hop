import { goerli as goerliAddresses, mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'

const getSubgraphUrl = (chain: string, network: string): string => {
  // TODO: Generalize for multiple networks
  const addresses = network === 'mainnet' ? (mainnetAddresses as any) : (goerliAddresses as any)
  const url = addresses?.[chain]?.subgraphUrl
  if (!url) {
    throw new Error(`subgraph url not found for chain ${chain}`)
  }

  return url
}

export default getSubgraphUrl 
