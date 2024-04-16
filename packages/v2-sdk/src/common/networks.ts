import { mainnet, sepolia } from '@hop-protocol/sdk-core/networks'

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
const mainnetNetworks: Record<string, Network> = {}
const sepoliaNetworks: Record<string, Network> = {}

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

for (const key in sepolia) {
  const network = (sepolia as any)[key]
  sepoliaNetworks[network.networkId] = {
    name: network.name,
    chainId: network.networkId,
    publicRpcUrl: network.publicRpcUrl,
    fallbackPublicRpcUrls: network.fallbackPublicRpcUrls,
    explorerUrls: network.explorerUrls,
    nativeBridgeUrl: network.nativeBridgeUrl,
    waitConfirmations: network.waitConfirmations
  }
}

export const networks: Record<string, Record<string, Network>> = {
  mainnet: mainnetNetworks,
  sepolia: sepoliaNetworks
}
