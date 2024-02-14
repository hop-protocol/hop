import { goerli as goerliAddresses, mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'

const addresses: Record<string, any> = {
  mainnet: mainnetAddresses,
  goerli: goerliAddresses
}

export function getProxyAddress (network: string, token: string, destinationChainSlug: string) {
  return addresses[network].bridges?.[token]?.[destinationChainSlug]?.proxy
}
