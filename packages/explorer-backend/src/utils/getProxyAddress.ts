import { NetworkSlug, sdkConfig } from '@hop-protocol/sdk'

const addresses: Record<string, any> = {
  mainnet: sdkConfig[NetworkSlug.Mainnet].addresses,
  goerli: sdkConfig[NetworkSlug.Goerli].addresses
}

export function getProxyAddress (network: string, token: string, destinationChainSlug: string) {
  return addresses[network].bridges?.[token]?.[destinationChainSlug]?.proxy
}
