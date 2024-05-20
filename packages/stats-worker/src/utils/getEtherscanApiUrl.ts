import { mainnet as mainnetAddresses } from '@hop-protocol/sdk/addresses'

export function getEtherscanApiUrl (chain: string) {
  return (mainnetAddresses as any)?.[chain]?.etherscanApiUrl
}
