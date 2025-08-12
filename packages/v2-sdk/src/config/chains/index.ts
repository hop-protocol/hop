import type { ChainConfig, NetworkConfig } from './types.js'
import { chains as mainnetChains } from './mainnet.js'
import { chains as sepoliaChains } from './sepolia.js'

export type { ChainConfig, NetworkConfig }

export const allChains: Record<string, ChainConfig> = {
  ...mainnetChains,
  ...sepoliaChains
}
