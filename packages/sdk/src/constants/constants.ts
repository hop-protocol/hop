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

export const SettlementGasLimitPerTx: Record<string, number> = {
  ethereum: 5141,
  polygon: 5933,
  xdai: 3218,
  optimism: 8545,
  arbitrum: 59105
}

export const LpFeeBps = '4'
export const PendingAmountBuffer = '50000'
export const MinPolygonGasPrice = 30_000_000_000

export enum Errors {
  NotEnoughAllowance = 'Not enough allowance. Please call `approve` on token contract to allow contract to move tokens.'
}
