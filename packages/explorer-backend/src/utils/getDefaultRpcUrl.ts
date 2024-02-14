import { goerli as goerliAddresses, mainnet as mainnetAddresses } from '@hop-protocol/core/networks'

const networks: Record<string, any> = {
  mainnet: mainnetAddresses,
  goerli: goerliAddresses
}

export function getDefaultRpcUrl (network: string, chain: string) {
  return networks[network]?.[chain]?.publicRpcUrl
}
