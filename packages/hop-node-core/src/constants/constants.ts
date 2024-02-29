import { AssetSymbol } from '@hop-protocol/core/config'
import { ChainSlug as Chain, NativeChainToken, NetworkSlug as Network, CanonicalToken as Token } from '@hop-protocol/core/networks'
import { RpcProviderSlug } from '@hop-protocol/core/metadata'
import { chains } from '@hop-protocol/core/metadata'
import { networks } from '@hop-protocol/core/networks'
import { tokens } from '@hop-protocol/core/metadata'

export { Network, Chain, Token, NativeChainToken }

const nativeChainTokens: Record<string, string> = {}
for (const chain in chains) {
  nativeChainTokens[chain] = chains[chain as Chain].nativeTokenSymbol
}

export { nativeChainTokens }

const relayableChainsSet = new Set<string>([])
const AvgBlockTimeSeconds: Record<string, number> = {}
const OruExitTimeMs: Record<string, number> = {}
const TimeToIncludeOnL1Sec: Record<string, number> = {}
const TimeToIncludeOnL2Sec: Record<string, number> = {}
const L1ToL2CheckpointTimeInL1Blocks: Record<string, number> = {}

for (const network in networks) {
  for (const chain in networks[network as Network]) {
    const chainObj = networks[network as Network][chain as Chain]
    const seconds = chainObj?.averageBlockTimeSeconds
    if (seconds != null) {
      AvgBlockTimeSeconds[chain] = seconds
    }
    if (chainObj?.isRelayable) {
      relayableChainsSet.add(chain)
    }
    if (chainObj?.oruExitTimeSeconds != null) {
      OruExitTimeMs[chain] = chainObj.oruExitTimeSeconds * 1000
    }
    if (chainObj?.timeToIncludeOnL1Seconds != null) {
      TimeToIncludeOnL1Sec[chain] = chainObj.timeToIncludeOnL1Seconds
    }
    if (chainObj?.timeToIncludeOnL2Seconds != null) {
      TimeToIncludeOnL2Sec[chain] = chainObj.timeToIncludeOnL2Seconds
    }
    if (chainObj?.L1ToL2CheckpointTimeInL1Blocks != null) {
      L1ToL2CheckpointTimeInL1Blocks[chain] = chainObj.L1ToL2CheckpointTimeInL1Blocks
    }
  }
}

export {
  AvgBlockTimeSeconds,
  OruExitTimeMs,
  TimeToIncludeOnL1Sec,
  TimeToIncludeOnL2Sec,
  L1ToL2CheckpointTimeInL1Blocks
}

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
  Ethereum: Math.floor(OneWeekSeconds / AvgBlockTimeSeconds[Chain.Ethereum]),
  Polygon: Math.floor(OneWeekSeconds / AvgBlockTimeSeconds[Chain.Polygon]),
  Gnosis: Math.floor(OneWeekSeconds / AvgBlockTimeSeconds[Chain.Gnosis])
}

export const MaxPriorityFeeConfidenceLevel = 95
export const InitialTxGasPriceMultiplier = 1
export const MaxGasPriceMultiplier = 1.25
export const MinPriorityFeePerGas = 0.1
export const PriorityFeePerGasCap = 20
export const MinPolygonGasPrice = 60_000_000_000
export const MinGnosisGasPrice = 5_000_000_000

export const stableCoins = new Set<string>([])
for (const tokenSymbol in tokens) {
  const tokenObj = tokens[tokenSymbol as AssetSymbol]
  if (tokenObj?.isStablecoin) {
    stableCoins.add(tokenSymbol)
  }
}

export const DoesSupportCustomFinality: Record<string, boolean> = {
  [Chain.Optimism]: true,
  [Chain.Base]: true
}

export { RpcProviderSlug as RootProviderName }

// TODO: When bonder-specific strategies are isolated from the finality dir, use a new
// SyncType const defined there
export enum SyncType {
  Bonder = 'bonder',
  Collateralized = 'collateralized',
  Threshold = 'threshold'
}
