import { ChainSlug } from '@hop-protocol/sdk'
import { getAverageBlockTimeSeconds } from './utils.js'

// Timing
export enum TimeIntervals {
  FIVE_MINUTES_MS = 5 * 60 * 1000,
  TEN_MINUTES_MS = 10 * 60 * 1000,
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
export const MIN_GNOSIS_GAS_PRICE = 5_000_000_000
