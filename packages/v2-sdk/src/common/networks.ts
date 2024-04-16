import { mainnet, goerli } from '@hop-protocol/sdk-core/networks'

export type Network = {
  name: string
  chainId: number
  publicRpcUrl: string
  fallbackPublicRpcUrls: string[]
  explorerUrls: string[]
  nativeBridgeUrl?: string
  waitConfirmations: number
}

export type Networks = Record<string, Network>

export const mainnetNetworks : Networks = {}
export const goerliNetworks : Networks = {}

for (const key in mainnet) {
  const network = (mainnet as any)[key]
  mainnetNetworks[network.networkId] = {
    name: network.name,
    chainId: network.networkId,
    publicRpcUrl: network.publicRpcUrl,
    fallbackPublicRpcUrls: network.fallbackPublicRpcUrls,
    explorerUrls: network.explorerUrls,
    nativeBridgeUrl: network.nativeBridgeUrl,
    waitConfirmations: network.waitConfirmations
  }
}

for (const key in goerli) {
  const network = (goerli as any)[key]
  goerliNetworks[network.networkId] = {
    name: network.name,
    chainId: network.networkId,
    publicRpcUrl: network.publicRpcUrl,
    fallbackPublicRpcUrls: network.fallbackPublicRpcUrls,
    explorerUrls: network.explorerUrls,
    nativeBridgeUrl: network.nativeBridgeUrl,
    waitConfirmations: network.waitConfirmations
  }
}
