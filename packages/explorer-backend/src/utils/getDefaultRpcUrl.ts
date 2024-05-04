import { goerli as goerliAddresses, mainnet as mainnetAddresses } from '@hop-protocol/sdk/addresses'

const networks: Record<string, any> = {
  mainnet: mainnetAddresses,
  goerli: goerliAddresses
}

export function getDefaultRpcUrl (network: string, chain: string) {
  return networks[network]?.[chain]?.publicRpcUrl
}
