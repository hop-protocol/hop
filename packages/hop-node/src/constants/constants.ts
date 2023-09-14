import { chains } from '@hop-protocol/core/metadata'

export enum Network {
  Mainnet = 'mainnet',
  Staging = 'staging',
  Goerli = 'goerli',
  Kovan = 'kovan',
}

// TODO: read from core
export enum Chain {
  Ethereum = 'ethereum',
  Optimism = 'optimism',
  Arbitrum = 'arbitrum',
  Polygon = 'polygon',
  Gnosis = 'gnosis',
  Nova = 'nova',
  ZkSync = 'zksync',
  Linea = 'linea',
  ScrollZk = 'scrollzk',
  Base = 'base',
  PolygonZk = 'polygonzk',
}

// TODO: read from core
export enum Token {
  USDC = 'USDC',
  USDT = 'USDT',
  DAI = 'DAI',
  ETH = 'ETH',
  MATIC = 'MATIC',
  HOP = 'HOP',
  SNX = 'SNX',
  sUSD = 'sUSD',
  rETH = 'rETH',
  MAGIC = 'MAGIC'
}

export enum NativeChainToken {
  ETH = 'ETH',
  XDAI = 'XDAI',
  MATIC = 'MATIC'
}

const nativeChainTokens: Record<string, string> = {}
for (const chain in chains) {
  nativeChainTokens[chain] = (chains as any)[chain].nativeTokenSymbol
}

export { nativeChainTokens }

export const AvgBlockTimeSeconds: Record<string, number> = {
  [Chain.Ethereum]: 12,
  [Chain.Polygon]: 2,
  [Chain.Gnosis]: 6,
  [Chain.Optimism]: 2,
  [Chain.Base]: 2
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
  linea: 10000, // TODO
  scrollzk: 10000, // TODO
  polygonzk: 10000 // TODO
}

export const DefaultBatchBlocks = 10000

export const TenSecondsMs = 10 * 1000
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
  BondTooEarly = 'BOND_TOO_EARLY',
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

export const RelayableChains: string[] = [
  Chain.Arbitrum,
  Chain.Nova,
  Chain.PolygonZk
]

export const MaxDeadline: number = 9999999999

export const stableCoins = new Set(['USDC', 'USDT', 'DAI', 'sUSD'])
export const BondTransferRootDelayBufferSeconds = 5 * 60
export const MaxReorgCheckBackoffIndex = 2 // 120 + 240 + 480 = 840 seconds, 14 minutes

// Optimism: time for relayer to publish state root
//           https://community.optimism.io/docs/developers/bedrock/bedrock/#two-phase-withdrawals
// Arbitrum: arbitrary buffer required
//           https://discord.com/channels/585084330037084172/585085215605653504/912843949855604736
// PolygonZk: typically around 30 minutes but up to a week in rare cases.
//           https://zkevm.polygon.technology/docs/protocol/transaction-execution
const ValidatorExitBufferMs = OneHourMs * 10
export const OruExitTimeMs: Record<string, number> = {
  [Chain.Optimism]: OneHourMs,
  [Chain.Base]: OneHourMs,
  [Chain.Arbitrum]: OneWeekMs + ValidatorExitBufferMs,
  [Chain.Nova]: OneWeekMs + ValidatorExitBufferMs,
  [Chain.PolygonZk]: OneHourMs
}

export const FinalityTag: Record<string, string> = {
  Safe: 'safe',
  Finalized: 'finalized'
}

export const FinalityTagForChain: Record<string, string> = {
  [Chain.Ethereum]: FinalityTag.Safe,
  [Chain.Optimism]: FinalityTag.Finalized,
  [Chain.Arbitrum]: FinalityTag.Safe,
  [Chain.Gnosis]: FinalityTag.Finalized,
  [Chain.Base]: FinalityTag.Finalized,
  [Chain.Nova]: FinalityTag.Safe,
  [Chain.PolygonZk]: FinalityTag.Safe
}

// Time buffer expected to account for the time between when blockHash validation logic is prepared
// and when the transaction is sent
export const BlockHashExpireBufferSec: number = 60
export const NumStoredBlockHashes: number = 256

// These values are currently the same on both mainnet and testnet but this might not always be the case
export const TimeToIncludeOnL1Sec: Record<string, number> = {
  [Chain.Optimism]: 120,
  [Chain.Base]: 20
}

// These values are currently the same on both mainnet and testnet but this might not always be the case
export const TimeToIncludeOnL2Sec: Record<string, number> = {
  [Chain.Ethereum]: 0,
  [Chain.Optimism]: 180,
  [Chain.Base]: 90
}