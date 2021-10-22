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

export enum TokenIndex {
  CanonicalToken = 0,
  HopBridgeToken = 1
}

export enum BondTransferGasLimit {
  Ethereum = '165000',
  Optimism = '100000000',
  Arbitrum = '2500000'
}

export const LpFeeBps = '4'
export const GasPriceMultiplier = '1.3'
export const ORUGasPriceMultiplier = '2'
export const L2ToL1BonderFeeBps = '18'
export const L2ToL2BonderFeeBps = '18'
export const PendingAmountBuffer = '50000'
