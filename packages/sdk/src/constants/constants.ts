export enum NetworkSlug {
  Mainnet = 'mainnet',
  Staging = 'staging',
  Goerli = 'goerli',
  Kovan = 'kovan'
}

export enum ChainId {
  Ethereum = 1,
  Optimism = 10,
  Arbitrum = 42161,
  Polygon = 137,
  Gnosis = 100,
}

export enum ChainName {
  Ethereum = 'Ethereum',
  Optimism = 'Optimism',
  Arbitrum = 'Arbitrum',
  Polygon = 'Polygon',
  Gnosis = 'Gnosis',
}

export enum ChainSlug {
  Ethereum = 'ethereum',
  Optimism = 'optimism',
  Arbitrum = 'arbitrum',
  Polygon = 'polygon',
  Gnosis = 'gnosis',
}

export enum Slug {
  ethereum = 'ethereum',
  kovan = 'kovan',
  goerli = 'goerli',
  staging = 'staging',
  mainnet = 'mainnet',
  arbitrum = 'arbitrum',
  optimism = 'optimism',
  gnosis = 'gnosis',
  polygon = 'polygon',
}

export enum CanonicalToken {
  ETH = 'ETH',
  MATIC = 'MATIC',
  XDAI = 'XDAI',
  USDC = 'USDC',
  USDT = 'USDT',
  DAI = 'DAI',
  WBTC = 'WBTC',
  sBTC = 'sBTC',
  sETH = 'sETH',
}

export enum WrappedToken {
  WETH = 'WETH',
  WMATIC = 'WMATIC',
  WXDAI = 'WXDAI',
}

export enum HToken {
  hETH = 'hETH',
  hMATIC = 'hMATIC',
  hUSDC = 'hUSDC',
  hUSDT = 'hUSDT',
  hDAI = 'hDAI',
}

export type TokenSymbol = CanonicalToken | WrappedToken | HToken | string

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
  gnosis: 3218,
  optimism: 8545,
  arbitrum: 59105
}

export const LpFeeBps = '4'
export const PendingAmountBuffer = '50000'
export const MinPolygonGasPrice = 30_000_000_000

export enum Errors {
  NotEnoughAllowance = 'Not enough allowance. Please call `approve` on token contract to allow contract to move tokens.',
  xDaiRebrand = 'NOTICE: xDai has been rebranded to Gnosis. Chain "xdai" is deprecated. Use "gnosis" instead.'
}
