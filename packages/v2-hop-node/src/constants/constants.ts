import { ChainSlug } from '@hop-protocol/sdk'
import { getAverageBlockTimeSeconds } from './utils.js'

/**
 * Timing
 */

export enum TimeIntervals {
  ONE_MINUTE_MS = 60 * 1000,
  FIVE_MINUTES_MS = 5 * 60 * 1000,
  TEN_MINUTES_MS = 10 * 60 * 1000,
  THIRTY_MINUTES_MS = 30 * 60 * 1000,
  ONE_HOUR_SECONDS = 60 * 60,
  ONE_HOUR_MS = 60 * 60 * 1000,
  ONE_DAY_SECONDS = 24 * 60 * 60,
  ONE_DAY_MS = 24 * 60 * 60 * 1000,
  ONE_WEEK_SECONDS = 7 * 24 * 60 * 60,
  ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
}

/**
 * Chain
 */

// This value is 2x the min gas price to ensure that the transaction goes through
// Not all Polygon nodes follow recommended 30 Gwei gasPrice
// https://forum.matic.network/t/recommended-min-gas-price-setting/2531
export const MIN_POLYGON_GAS_PRICE: number = 60_000_000_000
// The value is pretty arbitrary but should be some value higher than 1 gwei. Since
// the cost of gas on Gnosis is so cheap, using a buffer this large should be fine.
export const MIN_GNOSIS_GAS_PRICE: number = 15_000_000_000

export const AVG_BLOCK_TIME_SECONDS: Partial<Record<ChainSlug, number>> = getAverageBlockTimeSeconds()

// This represents the custom finality time for each chain plus the time it takes for chain finality to update. There is a buffer.
// which means it could take another 10 minutes.
export const FINALITY_TIME_MS: Record<ChainSlug, number> = {
  [ChainSlug.Ethereum]: 25 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.Polygon]: 25 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.Gnosis]: 30 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.Optimism]: 25 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.Arbitrum]: 25 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.Nova]: 25 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.ZkSync]: 25 * TimeIntervals.ONE_MINUTE_MS, // TODO
  [ChainSlug.Linea]: 25 * TimeIntervals.ONE_MINUTE_MS, // TODO
  [ChainSlug.ScrollZk]: 25 * TimeIntervals.ONE_MINUTE_MS, // TODO
  [ChainSlug.Base]: 25 * TimeIntervals.ONE_MINUTE_MS,
  [ChainSlug.PolygonZk]: 30 * TimeIntervals.ONE_MINUTE_MS
}

/**
 * RPC
 */

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

/**
 * Other
 */

export const RATE_LIMIT_MAX_RETRIES = 5
export const RPC_TIMEOUT_SECONDS = 60

// TODO: When bonder-specific strategies are isolated from the finality dir, use a new
// SyncType const defined there
export enum SyncType {
  Bonder = 'bonder',
  Collateralized = 'collateralized',
  Threshold = 'threshold'
}
