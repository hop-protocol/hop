import { mainnet as mainnetAddresses } from '@hop-protocol/sdk/networks'

export function getEtherscanApiUrl (chain: string) {
  return (mainnetAddresses as any)?.[chain]?.etherscanApiUrl
}
