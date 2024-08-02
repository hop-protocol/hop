import { ChainSlug } from '@hop-protocol/sdk'
import { getAverageBlockTimeSeconds } from './utils.js'

// Timing
export enum TimeIntervals {
  ONE_MINUTE_MS = 60 * 1000,
  FIVE_MINUTES_MS = 5 * 60 * 1000,
  TEN_MINUTES_MS = 10 * 60 * 1000,
  THIRTY_MINUTES_MS = 30 * 60 * 1000,
  ONE_HOUR_SECONDS = 60 * 60,
  ONE_HOUR_MS =  60 * 60 * 1000,
  ONE_DAY_SECONDS = 24 * 60 * 60,
  ONE_DAY_MS = 24 * 60 * 60 * 1000,
  ONE_WEEK_SECONDS = 7 * 24 * 60 * 60,
  ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
}

// Chain
export const AVG_BLOCK_TIME_SECONDS: Partial<Record<ChainSlug, number>> = getAverageBlockTimeSeconds()
export const MIN_POLYGON_GAS_PRICE = 60_000_000_000
// This represents the custom finality time for each chain. There is a buffer.
export const FINALITY_TIME_MS: Record<ChainSlug, number> = {
  [ChainSlug.Ethereum]: 12 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.Polygon]: 12 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.Gnosis]: 30 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.Optimism]: 12 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.Arbitrum]: 12 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.Nova]: 12 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.ZkSync]: 12 * TimeIntervals.ONE_MINUTE_MS, // TODO
  [ChainSlug.Linea]: 12 * TimeIntervals.ONE_MINUTE_MS, // TODO
  [ChainSlug.ScrollZk]: 12 * TimeIntervals.ONE_MINUTE_MS, // TODO
  [ChainSlug.Base]: 12 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.PolygonZk]: 30 * TimeIntervals.ONE_MINUTE_MS
}

// RPC
const DEFAULT_MAX_BLOCK_RANGE = 5_000
export const MAX_BLOCK_RANGE_PER_GET_LOG_CALL: Record<ChainSlug, number> = {
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

//Other
export const RATE_LIMIT_MAX_RETRIES = 5
export const RPC_TIMEOUT_SECONDS = 60

// TODO: When bonder-specific strategies are isolated from the finality dir, use a new
// SyncType const defined there
export enum SyncType {
  Bonder = 'bonder',
  Collateralized = 'collateralized',
  Threshold = 'threshold'
}
