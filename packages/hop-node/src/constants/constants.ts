import { AssetSymbol } from '@hop-protocol/core/config'
import { ChainSlug as Chain, NativeChainToken, NetworkSlug as Network, CanonicalToken as Token } from '@hop-protocol/core/networks/enums'
import { RpcProviderSlug, rpcProviders } from '@hop-protocol/core/metadata/providers'
import { chains } from '@hop-protocol/core/metadata'
import { networks } from '@hop-protocol/core/networks'
import { tokens } from '@hop-protocol/core/metadata/tokens'

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

export const SettlementGasLimitPerTx: Record<string, number> = {
  ethereum: 5141,
  polygon: 5933,
  gnosis: 3218,
  optimism: 8545,
  arbitrum: 19843,
  nova: 19843,
  base: 8545,
  zksync: 10000, // TODO
  linea: 10416,
  scrollzk: 10000, // TODO
  polygonzk: 6270
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

export const RootSetSettleDelayMs = 5 * 60 * 1000
export const ChallengePeriodMs = 24 * OneHourMs

export const MaxInt32 = 2147483647

export enum TxError {
  CallException = 'CALL_EXCEPTION',
  BonderFeeTooLow = 'BONDER_FEE_TOO_LOW',
  RelayerFeeTooLow = 'RELAYER_FEE_TOO_LOW',
  NotEnoughLiquidity = 'NOT_ENOUGH_LIQUIDITY',
  RedundantRpcOutOfSync = 'REDUNDANT_RPC_OUT_OF_SYNC',
  RpcServerError = 'RPC_SERVER_ERROR',
  UnfinalizedTransferBondError = 'UNFINALIZED_TRANSFER_BOND_ERROR',
  MessageUnknownStatus = 'MESSAGE_UNKNOWN_STATUS',
  MessageRelayTooEarly = 'MESSAGE_RELAY_TOO_EARLY',
  MessageAlreadyRelayed = 'MESSAGE_ALREADY_RELAYED',
  MessageInvalidState = 'MESSAGE_INVALID_STATE'
}

export const MaxPriorityFeeConfidenceLevel = 95
export const InitialTxGasPriceMultiplier = 1
export const MaxGasPriceMultiplier = 1.25
export const MinPriorityFeePerGas = 0.1
export const PriorityFeePerGasCap = 20
export const MinPolygonGasPrice = 60_000_000_000
export const MinGnosisGasPrice = 5_000_000_000

export enum TokenIndex {
  CanonicalToken = 0,
  HopBridgeToken = 1,
}

export enum GasCostTransactionType {
  BondWithdrawal = 'bondWithdrawal',
  BondWithdrawalAndAttemptSwap = 'bondWithdrawalAndAttemptSwap',
  Relay = 'relay'
}

export const MaxDeadline: number = 9999999999

export const stableCoins = new Set<string>([])
for (const tokenSymbol in tokens) {
  const tokenObj = tokens[tokenSymbol as AssetSymbol]
  if (tokenObj?.isStablecoin) {
    stableCoins.add(tokenSymbol)
  }
}

export const BondTransferRootDelayBufferSeconds = 5 * 60
export const MaxReorgCheckBackoffIndex = 2 // 120 + 240 + 480 = 840 seconds, 14 minutes

export const DoesSupportCustomFinality: Record<string, boolean> = {
  [Chain.Optimism]: true,
  [Chain.Base]: true
}

// Poll certain chains at a slower cadence if they are not widely used
export const ChainPollMultiplier: Record<string, number> = {
  [Chain.Ethereum]: 1,
  [Chain.Gnosis]: 2,
  [Chain.Polygon]: 2,
  [Chain.Optimism]: 1,
  [Chain.Arbitrum]: 1,
  [Chain.Base]: 1,
  [Chain.Nova]: 2,
  [Chain.Linea]: 1,
  [Chain.PolygonZk]: 1
}

// Optimism-chain resource metering is not accurate with all RPC providers. Because of this,
// confirmations entering into an Optimism chain need a custom gasLimit to ensure the
// tx is propagated to the chain.
export const CanonicalMessengerRootConfirmationGasLimit: number = 1500000

const DoesRootProviderSupportWs: Partial<Record<RpcProviderSlug, boolean>> = {}

for (const providerSlug in rpcProviders) {
  const providerObj = rpcProviders[providerSlug as RpcProviderSlug]
  DoesRootProviderSupportWs[providerSlug as RpcProviderSlug] = providerObj?.wsSupported
}

export { DoesRootProviderSupportWs }
export { RpcProviderSlug as RootProviderName }

export const DefaultBondThreshold = 5
// TODO: When bonder-specific strategies are isolated from the finality dir, use a new
// SyncType const defined there
export enum SyncType {
  Bonder = 'bonder',
  Collateralized = 'collateralized',
  Threshold = 'threshold'
}

/// ///////
//////////
// TODO: Clean this up. Below this consider moving to core -- but consider pretty much all should be relayable both ways
/// ///////

type IRelayableChains = {
  L1_TO_L2: string[]
  L2_TO_L1: string[]
}

export const RelayableChains: IRelayableChains = {
  L1_TO_L2: [
    Chain.Arbitrum,
    Chain.Nova,
    Chain.Linea,
    Chain.PolygonZk
  ],
  L2_TO_L1: [
    Chain.Gnosis,
    Chain.Polygon,
    Chain.PolygonZk
  ]
}

type IRelayableWaitTimeMs = {
  L1_TO_L2: {
    [chain: string]: number
  }
  L2_TO_L1: {
    [chain: string]: number
  }
}
export const RelayWaitTimeMs: IRelayableWaitTimeMs = {
  L1_TO_L2: {
    [Chain.Arbitrum]: 12 * 60 * 1000, // L1 safe
    [Chain.Nova]: 12 * 60 * 1000, // L1 safe
    [Chain.Linea]: 25 * 60 * 1000, // L1 finalized
    [Chain.PolygonZk]: 8 * 60 * 1000 // 32 L1 Blocks + buffer
  },
  L2_TO_L1: {
    [Chain.Gnosis]: 1 * OneHourMs,
    [Chain.Polygon]: 1 * OneHourMs,
    [Chain.PolygonZk]: 1 * OneHourMs
  }
}

export const BondTransferRootChains: string[] = [
  Chain.Optimism,
  Chain.Arbitrum,
  Chain.Nova,
  Chain.Base,
  Chain.Linea
]
