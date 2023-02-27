import { BigNumber } from 'ethers'

export enum NetworkSlug {
  Mainnet = 'mainnet',
  Staging = 'staging',
  Goerli = 'goerli',
  Kovan = 'kovan'
}

// mainnet chain ids
export enum ChainId {
  Ethereum = 1,
  Optimism = 10,
  Arbitrum = 42161,
  Polygon = 137,
  Gnosis = 100,
  Nova = 42170,
  ZkSync = 324
}

export enum ChainName {
  Ethereum = 'Ethereum',
  Optimism = 'Optimism',
  Arbitrum = 'Arbitrum',
  Polygon = 'Polygon',
  Gnosis = 'Gnosis',
  Nova = 'Nova',
  ZkSync = 'zkSync',
  ConsenSysZk = 'ConsenSys zkEVM'
}

export enum ChainSlug {
  Ethereum = 'ethereum',
  Optimism = 'optimism',
  Arbitrum = 'arbitrum',
  Polygon = 'polygon',
  Gnosis = 'gnosis',
  Nova = 'nova',
  ZkSync = 'zksync',
  ConsenSysZk = 'consensyszk'
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
  nova = 'nova',
  zksync = 'zksync',
  consensyszk = 'consensyszk'
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
  HOP = 'HOP',
  SNX = 'SNX',
  sUSD = 'sUSD',
  rETH = 'rETH'
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
  hHop = 'hHOP',
  hrETH = 'hrETH',
}

export type TokenSymbol = CanonicalToken | WrappedToken | HToken | string

export enum TokenIndex {
  CanonicalToken = 0,
  HopBridgeToken = 1
}

export enum BondTransferGasLimit {
  Ethereum = '165000',
  Optimism = '100000000',
  Arbitrum = '2500000',
  Nova = '2500000',
}

export const SettlementGasLimitPerTx: Record<string, number> = {
  ethereum: 5141,
  polygon: 5933,
  gnosis: 3218,
  optimism: 8545,
  arbitrum: 19843,
  nova: 19843,
  zksync: 10000, // TODO
  consensyzk: 10000 // TODO
}

export const LpFeeBps = '4'
export const PendingAmountBufferUsd = '50000'
export const MinPolygonGasPrice = 30_000_000_000
export const MinPolygonGasLimit = BigNumber.from(1_000_000)

export enum Errors {
  NotEnoughAllowance = 'Not enough allowance. Please call `approve` on the token contract to allow contract to move tokens and make sure you are connected to the correct network.',
  xDaiRebrand = 'NOTICE: xDai has been rebranded to Gnosis. Chain "xdai" is deprecated. Use "gnosis" instead.'
}

export enum EventNames {
  TransferSent = 'TransferSent',
  TransferSentToL2 = 'TransferSentToL2',
}

export const MaxDeadline: number = 9999999999
// Low liquidity or single-chain tokens should have a buffer of appx 10% of their L1 stake
export const LowLiquidityTokens: string[] = ['HOP', 'SNX']
export const LowLiquidityTokenBufferAmountsUsd: Record<string, string> = {
  HOP: '8000',
  SNX: '40000'
}
export const SecondsInDay = 86400
