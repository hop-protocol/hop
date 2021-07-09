export enum Network {
  Mainnet = 'mainnet',
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

const AVG_BLOCK_TIME_SEC = {
  Ethereum: 13,
  Polygon: 2,
  xDai: 5
}
const SEC_IN_WEEK = 604800
export const TotalBlocks = {
  Ethereum: Math.floor(SEC_IN_WEEK / AVG_BLOCK_TIME_SEC.Ethereum),
  Polygon: Math.floor(SEC_IN_WEEK / AVG_BLOCK_TIME_SEC.Polygon),
  xDai: Math.floor(SEC_IN_WEEK / AVG_BLOCK_TIME_SEC.xDai)
}

const TEN_MINUTES = 10 * 60 * 1000
export const TX_RETRY_DELAY_MS = TEN_MINUTES
export const ETHEREUM_TX_MAX_DELAY_MS = 1 * 1000
export const XDAI_TX_MAX_DELAY_MS = 20 * 1000
export const POLYGON_TX_MAX_DELAY_MS = 10 * 1000
