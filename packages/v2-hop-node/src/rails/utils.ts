import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { SignerConfig } from '#config/index.js'
import type { PathIDElements } from './types.js'

const DEFAULT_START_BLOCK_NUMBER: Record<string, Partial<Record<ChainSlug, number>>> = {
  // TODO: Fill in the start block numbers
  [NetworkSlug.Mainnet]: {
    [ChainSlug.Ethereum]: 0,
    [ChainSlug.Optimism]: 0,
    [ChainSlug.Arbitrum]: 0,
    [ChainSlug.Base]: 0,
    [ChainSlug.Polygon]: 0
  },
  [NetworkSlug.Sepolia]: {
    [ChainSlug.Ethereum]: 0,
    [ChainSlug.Optimism]: 0,
    [ChainSlug.Arbitrum]: 0,
    [ChainSlug.Base]: 0
  }
}

export function getRailsStartBlockNumber (chainId: string): number {
  const chainSlug = getChain(chainId).slug
  return (DEFAULT_START_BLOCK_NUMBER as any)[SignerConfig.network as NetworkSlug][chainSlug]
}

export function getChainsFromPathId (pathId: string): PathIDElements {
  const path: PathIDElements | undefined = SignerConfig.chains?.[pathId]
  if (!path) {
    throw new Error(`Unknown pathId: ${pathId}`)
  }

  return path
}
