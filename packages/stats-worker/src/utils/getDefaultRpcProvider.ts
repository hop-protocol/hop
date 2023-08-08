import { mainnet as mainnetAddresses } from '@hop-protocol/core/networks'

export function getDefaultRpcUrl (chain: string) {
  return (mainnetAddresses as any)?.[chain]?.publicRpcUrl
}
