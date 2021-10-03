import { BigNumber } from 'ethers'

export enum Network {
  Mainnet = 'mainnet',
  Staging = 'staging',
  Goerli = 'goerli',
  Kovan = 'kovan'
}

export enum Chain {
  Ethereum = 'ethereum',
  Optimism = 'optimism',
  Arbitrum = 'arbitrum',
  Polygon = 'polygon',
  xDai = 'xdai'
}

export enum Token {
  USDC = 'USDC',
  DAI = 'DAI'
}

export const AvgBlockTimeSeconds = {
  Ethereum: 13,
  Polygon: 2,
  xDai: 5
}

export const SecondsInDay = 86400
export const SecondsInWeek = SecondsInDay * 7
export const TotalBlocks = {
  Ethereum: Math.floor(SecondsInWeek / AvgBlockTimeSeconds.Ethereum),
  Polygon: Math.floor(SecondsInWeek / AvgBlockTimeSeconds.Polygon),
  xDai: Math.floor(SecondsInWeek / AvgBlockTimeSeconds.xDai)
}
export const DefaultBatchBlocks = 10000

export const TenSecondsMs = 10 * 1000
export const TenMinutesMs = 10 * 60 * 1000
export const OneHourSeconds = 60 * 60
export const OneHourMs = 60 * 60 * 1000
export const OneWeekMs = 7 * 24 * 60 * 60 * 1000
export const TxRetryDelayMs = OneHourMs
export enum TxMaxDelayMs {
  Ethereum = 1 * 1000,
  xDai = 20 * 1000,
  Polygon = 10 * 1000,
}
export const RootSetSettleDelayMs = 5 * 60 * 1000

export const MaxInt32 = 2147483647

export enum TxError {
  CallException = 'CALL_EXCEPTION',
  BonderFeeTooLow = 'BONDER_FEE_TOO_LOW',
  NotEnoughLiquidity = 'NOT_ENOUGH_LIQUIDITY'
}

export const MaxGasPriceMultiplier = 1.25
export const MinPriorityFeePerGas = 4
export const PriorityFeePerGasCap = 20

export enum BonderFeeBps {
  L2ToL1 = '18',
  L2ToL2 = '18'
}

export const MinBonderFeeAbsolute = BigNumber.from('0')

export enum TokenIndex {
  CanonicalToken = 0,
  HopBridgeToken = 1
}
