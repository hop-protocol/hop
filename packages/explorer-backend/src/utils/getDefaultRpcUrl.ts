import { mainnet as mainnetAddresses, goerli as goerliAddresses } from '@hop-protocol/core/networks'

const networks: any = {
  mainnet: mainnetAddresses,
  goerli: goerliAddresses
}

export function getDefaultRpcUrl (network: string, chain: string) {
  return networks[network]?.[chain]?.publicRpcUrl
}
