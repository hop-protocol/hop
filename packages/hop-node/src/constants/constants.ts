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
export const Total_Blocks = {
  Ethereum: Math.floor(SEC_IN_WEEK / AVG_BLOCK_TIME_SEC.Ethereum),
  Polygon: Math.floor(SEC_IN_WEEK / AVG_BLOCK_TIME_SEC.Polygon),
  xDai: Math.floor(SEC_IN_WEEK / AVG_BLOCK_TIME_SEC.xDai)
}
