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

export const AVG_BLOCK_TIME_SEC = {
  Ethereum: 13,
  Polygon: 2,
  xDai: 5
}

export const SEC_IN_DAY = 86400
export const SEC_IN_WEEK = SEC_IN_DAY * 7
export const TotalBlocks = {
  Ethereum: Math.floor(SEC_IN_WEEK / AVG_BLOCK_TIME_SEC.Ethereum),
  Polygon: Math.floor(SEC_IN_WEEK / AVG_BLOCK_TIME_SEC.Polygon),
  xDai: Math.floor(SEC_IN_WEEK / AVG_BLOCK_TIME_SEC.xDai)
}
export const DEFAULT_BATCH_BLOCKS = 10000

export const TEN_MINUTES_MS = 10 * 60 * 1000
export const TX_RETRY_DELAY_MS = TEN_MINUTES_MS
export const ETHEREUM_TX_MAX_DELAY_MS = 1 * 1000
export const XDAI_TX_MAX_DELAY_MS = 20 * 1000
export const POLYGON_TX_MAX_DELAY_MS = 10 * 1000

export const MAX_INT_32 = 2147483647

export enum TxError {
  CallException = 'CALL_EXCEPTION'
}
