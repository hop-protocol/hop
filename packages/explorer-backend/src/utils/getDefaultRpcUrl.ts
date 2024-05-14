import { getNetwork, NetworkSlug } from '@hop-protocol/sdk'

export function getDefaultRpcUrl (network: string, chain: string) {
  return (getNetwork(network as NetworkSlug)?.chains as any)?.[chain]?.publicRpcUrl
}
