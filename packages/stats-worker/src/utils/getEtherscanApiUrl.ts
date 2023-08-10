import { mainnet as mainnetAddresses } from '@hop-protocol/core/networks'

export function getEtherscanApiUrl (chain: string) {
  return (mainnetAddresses as any)?.[chain]?.etherscanApiUrl
}
