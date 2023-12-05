export enum ChainSlug {
  ethereum = 'ethereum',
  polygon = 'polygon',
  gnosis = 'gnosis',
  optimism = 'optimism',
  arbitrum = 'arbitrum',
  nova = 'nova',
  zkSync = 'zksync',
  linea = 'linea',
  scrollzk = 'scrollzk',
  base = 'base',
  polygonzk = 'polygonzk'
}

export enum AssetSymbol {
  USDC = 'USDC',
  USDT = 'USDT',
  DAI = 'DAI',
  MATIC = 'MATIC',
  ETH = 'ETH',
  WBTC = 'WBTC',
  HOP = 'HOP',
  SNX = 'SNX',
  sUSD = 'sUSD',
  rETH = 'rETH',
  UNI = 'UNI',
  MAGIC = 'MAGIC',
  // sBTC = 'sBTC',
  // sETH = 'sETH',
  // FRAX = 'FRAX',
}

export enum FinalityState {
  Latest = 'latest',
  Safe = 'safe',
  Finalized = 'finalized'
}

export type Bps = {
  [key in ChainSlug]: number
}

export type Fees = {
  [key in AssetSymbol]: Partial<Bps>
}

type RelayerFeeWei = {
  [key in ChainSlug]: string
}

type RelayerFeeEnabled = {
  [key in ChainSlug]: boolean
}

export type BridgeDeprecated = {
  [key in AssetSymbol]: boolean
}

export type TotalStake = {
  [key in AssetSymbol]: number
}

export type DefaultSendGasLimit = {
  native: Partial<{
    [key in ChainSlug]: number
  }>,
  token: Partial<{
    [key in ChainSlug]: number
  }>
}

export type Config = {
  bonderFeeBps: Partial<Fees>
  bonderTotalStake: Partial<TotalStake>
  destinationFeeGasPriceMultiplier: number
  relayerFeeWei: Partial<RelayerFeeWei>
  relayerFeeEnabled: Partial<RelayerFeeEnabled>
  bridgeDeprecated: Partial<BridgeDeprecated>
  defaultSendGasLimit: Partial<DefaultSendGasLimit>
}
