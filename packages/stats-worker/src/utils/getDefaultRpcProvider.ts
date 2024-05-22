import { mainnet as mainnetAddresses } from '@hop-protocol/sdk/addresses'

export function getDefaultRpcUrl (chain: string) {
  return (mainnetAddresses as any)?.[chain]?.publicRpcUrl
}
