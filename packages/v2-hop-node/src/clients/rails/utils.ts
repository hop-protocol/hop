import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { Config } from '#config/index.js'
import { getPathId } from './RailsSDKWrapper.js'
import type { RailsPath } from './types.js'
import type { RequiredEventFilter } from '#types/index.js'

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
  return (DEFAULT_START_BLOCK_NUMBER as any)[Config.GlobalConfig.options.network as NetworkSlug][chainSlug]
}

/**
 * Events
 */

// TODO: Move this to #indexer/utils.ts when aggregation is implemented at the indexer level
export function aggregateFilters(filters: RequiredEventFilter[]): RequiredEventFilter[] {
  const filtersByAddress: Record<string, RequiredEventFilter> = {}

  filters.forEach((filter: RequiredEventFilter) => {
    const address = filter.address
    const existingFilter = filtersByAddress[address] ?? { address, topics: [] }

    filter.topics.forEach((topic, i) => {
      if (!existingFilter.topics![i]) {
        existingFilter.topics![i] = []
      }
      if (!existingFilter.topics![i]!.includes(topic as string)) {
        (existingFilter.topics![i] as string[]).push(topic as string)
      }
    })

    filtersByAddress[address] = existingFilter
  })

  return Object.values(filtersByAddress).map(filter => ({
    ...filter,
  }))
}

/**
 * Paths
 */

export function getPathFromPathId (pathId: string): RailsPath {
  const paths: RailsPath[] = Config.ClientConfig.rails.paths
  const path: RailsPath | undefined = paths.find(path => getPathId(path) === pathId)
  if (!path) {
    throw new Error(`Path not found for pathId: ${pathId}`)
  }

  return path
}

export function getChainIdsForPaths(paths: RailsPath[]): string[] {
  return paths.reduce((chainIds: string[], path: RailsPath) => {
    if (!chainIds.includes(path.srcChainId)) {
      chainIds.push(path.srcChainId)
    }
    if (!chainIds.includes(path.destChainId)) {
      chainIds.push(path.destChainId)
    }
    return chainIds
  }, [])
}

export function getPathIdsPerChainId(chainId: string, paths: RailsPath[]): string[] {
  return paths.reduce((pathIds: string[], path: RailsPath) => {
    if (path.srcChainId === chainId) {
      pathIds.push(getPathId(path))
    }
    if (path.destChainId === chainId) {
      pathIds.push(getPathId(path))
    }
    return pathIds
  }, [])
}
