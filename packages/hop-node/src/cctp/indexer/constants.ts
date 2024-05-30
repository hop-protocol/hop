import { ChainSlug, getChain } from '@hop-protocol/sdk'

export const DATA_INDEXED_EVENT = 'DATA_INDEXED_EVENT'

export const POLL_INTERVAL_MS = 60_000

const DEFAULT_MAX_BLOCK_RANGE = 2000
export const MAX_BLOCK_RANGE_PER_INDEX: Record<ChainSlug, number> = {
  [ChainSlug.Ethereum]: DEFAULT_MAX_BLOCK_RANGE,
  [ChainSlug.Polygon]: DEFAULT_MAX_BLOCK_RANGE,
  [ChainSlug.Gnosis]: DEFAULT_MAX_BLOCK_RANGE,
  [ChainSlug.Optimism]: DEFAULT_MAX_BLOCK_RANGE,
  [ChainSlug.Arbitrum]: DEFAULT_MAX_BLOCK_RANGE,
  [ChainSlug.Nova]: DEFAULT_MAX_BLOCK_RANGE,
  [ChainSlug.ZkSync]: DEFAULT_MAX_BLOCK_RANGE,
  [ChainSlug.Linea]: DEFAULT_MAX_BLOCK_RANGE,
  [ChainSlug.ScrollZk]: DEFAULT_MAX_BLOCK_RANGE,
  [ChainSlug.Base]: DEFAULT_MAX_BLOCK_RANGE,
  [ChainSlug.PolygonZk]: DEFAULT_MAX_BLOCK_RANGE,
}
