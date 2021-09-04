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
  Optimism = '100000000'
}

export const LpFeeBps = '4'
export const GasPriceMultiplier = '1.6'
export const MinBonderBps = '18'
export const UnbondedRootsBuffer = '50000'
