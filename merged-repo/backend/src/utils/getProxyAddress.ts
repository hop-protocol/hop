import { mainnet as mainnetAddresses, goerli as goerliAddresses } from '@hop-protocol/core/addresses'

const addresses = {
  mainnet: mainnetAddresses,
  goerli: goerliAddresses
}

export function getProxyAddress (network: string, token: string, destinationChainSlug: string) {
  return addresses[network].bridges?.[token]?.[destinationChainSlug]?.proxy
}
