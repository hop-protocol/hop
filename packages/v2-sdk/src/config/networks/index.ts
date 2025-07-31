import type { ChainConfig, NetworkConfig } from './types.js'
import { chains as mainnetChains } from './mainnet.js'
import { chains as sepoliaChains } from './sepolia.js'

export type { ChainConfig, NetworkConfig }

export const networks: Record<string, NetworkConfig> = {
  'mainnet': {
    slug:'mainnet',
    isMainnet: true,
    chains: mainnetChains
  },
  'sepolia': {
    slug: 'sepolia',
    isMainnet: false,
    chains: sepoliaChains
  }
}
