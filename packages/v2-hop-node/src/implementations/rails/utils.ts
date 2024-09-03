import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { SignerConfig } from '#config/index.js'
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
  return (DEFAULT_START_BLOCK_NUMBER as any)[SignerConfig.network as NetworkSlug][chainSlug]
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
