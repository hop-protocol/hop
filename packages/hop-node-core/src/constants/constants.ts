import {
  ChainSlug,
  type ChainSlugish,
  NetworkSlug,
  getTokens,
  getChains
} from '@hop-protocol/sdk'

const relayableChainsSet = new Set<ChainSlugish>([])
const AvgBlockTimeSeconds: Record<ChainSlugish, number> = {}

/**
 * Some chains have a variable block time with a single tx per block. Use
 * 250ms for these chains as an approximation, following the lead
 * of https://www.rollup.codes/
 */
const BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS = 250

for (const chain of getChains(NetworkSlug.Mainnet)) {
  const blockTimeMs = chain.averageBlockTimeMs
  if (blockTimeMs !== BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS) {
    AvgBlockTimeSeconds[chain.slug] = blockTimeMs / 1000
  }
  if (chain.isManualRelayOnL2) {
    relayableChainsSet.add(chain.slug)
  }
}

export { AvgBlockTimeSeconds }

export const DefaultBatchBlocks = 10000

export const TenSecondsMs = 10 * 1000
export const FiveMinutesMs = 5 * 60 * 1000
export const TenMinutesMs = 10 * 60 * 1000
export const OneHourSeconds = 60 * 60
export const OneHourMs = OneHourSeconds * 1000
export const OneDaySeconds = 24 * 60 * 60
export const OneDayMs = OneDaySeconds * 1000
export const OneWeekSeconds = 7 * 24 * 60 * 60
export const OneWeekMs = OneWeekSeconds * 1000

export const TotalBlocks = {
  Ethereum: Math.floor(OneWeekSeconds / AvgBlockTimeSeconds[ChainSlug.Ethereum]!),
  Polygon: Math.floor(OneWeekSeconds / AvgBlockTimeSeconds[ChainSlug.Polygon]!),
  Gnosis: Math.floor(OneWeekSeconds / AvgBlockTimeSeconds[ChainSlug.Gnosis]!)
}

export const MaxPriorityFeeConfidenceLevel = 95
export const InitialTxGasPriceMultiplier = 1
export const MaxGasPriceMultiplier = 1.25
export const MinPriorityFeePerGas = 0.1
export const PriorityFeePerGasCap = 20
export const MinPolygonGasPrice = 60_000_000_000
export const MinGnosisGasPrice = 5_000_000_000

export const stableCoins = new Set<string>([])
for (const token of getTokens()) {
  if (token.isStableCoin) {
    stableCoins.add(token.symbol)
  }
}

export const DoesSupportCustomFinality: Record<string, boolean> = {
  [ChainSlug.Optimism]: true,
  [ChainSlug.Base]: true
}

// TODO: When bonder-specific strategies are isolated from the finality dir, use a new
// SyncType const defined there
export enum SyncType {
  Bonder = 'bonder',
  Collateralized = 'collateralized',
  Threshold = 'threshold'
}
