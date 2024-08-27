import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { SignerConfig } from '#config/index.js'
import { RailsConfig } from '#config/index.js'
import type { RailsPath } from './types.js'
import { RailsSDK } from './RailsSDK.js'

const DEFAULT_START_BLOCK_NUMBER: Record<string, Partial<Record<ChainSlug, number>>> = {
  // TODO: SDK: Fill in the start block numbers
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

export function getPathFromPathId (pathId: string): RailsPath {
  const paths: RailsPath[] = RailsConfig.paths
  const path: RailsPath | undefined = paths.find(path => RailsSDK.getPathId(path) === pathId)
  if (!path) {
    throw new Error(`Path not found for pathId: ${pathId}`)
  }

  return path
}
