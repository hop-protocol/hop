import { NetworkSlug, sdkConfig } from '@hop-protocol/sdk'

const networks: Record<string, any> = {
  mainnet: sdkConfig[NetworkSlug.Mainnet],
  goerli: sdkConfig[NetworkSlug.Goerli]
}

export function getDefaultRpcUrl (network: string, chain: string) {
  return networks[network]?.[chain]?.publicRpcUrl
}
