import { constants as ethersConstants } from 'ethers'

export enum Network {
  Mainnet = 'mainnet',
  Staging = 'staging',
  Goerli = 'goerli',
  Kovan = 'kovan',
}

export enum Chain {
  Ethereum = 'ethereum',
  Optimism = 'optimism',
  Arbitrum = 'arbitrum',
  Polygon = 'polygon',
  Gnosis = 'gnosis',
}

export enum Token {
  USDC = 'USDC',
  DAI = 'DAI',
}

const AvgBlockTimeSeconds = {
  Ethereum: 13,
  Polygon: 2,
  Gnosis: 5
}

export const SettlementGasLimitPerTx: Record<string, number> = {
  ethereum: 5141,
  polygon: 5933,
  gnosis: 3218,
  optimism: 8545,
  arbitrum: 59105
}

const SecondsInDay = 86400
const SecondsInWeek = SecondsInDay * 7
export const TotalBlocks = {
  Ethereum: Math.floor(SecondsInWeek / AvgBlockTimeSeconds.Ethereum),
  Polygon: Math.floor(SecondsInWeek / AvgBlockTimeSeconds.Polygon),
  Gnosis: Math.floor(SecondsInWeek / AvgBlockTimeSeconds.Gnosis)
}
export const DefaultBatchBlocks = 10000

export const TenSecondsMs = 10 * 1000
export const TenMinutesMs = 10 * 60 * 1000
export const OneHourSeconds = 60 * 60
export const OneHourMs = 60 * 60 * 1000
export const OneWeekMs = 7 * 24 * 60 * 60 * 1000

export const TxRetryDelayMs = OneHourMs
export const RootSetSettleDelayMs = 5 * 60 * 1000
export const ChallengePeriodMs = 24 * OneHourMs

export const MaxInt32 = 2147483647

export enum TxError {
  CallException = 'CALL_EXCEPTION',
  BonderFeeTooLow = 'BONDER_FEE_TOO_LOW',
  NotEnoughLiquidity = 'NOT_ENOUGH_LIQUIDITY',
}

export const MaxGasPriceMultiplier = 1.25
export const MinPriorityFeePerGas = 4
export const PriorityFeePerGasCap = 20
export const MinPolygonGasPrice = 90_000_000_000

export enum TokenIndex {
  CanonicalToken = 0,
  HopBridgeToken = 1,
}

export const DefaultRelayerAddress = ethersConstants.AddressZero
