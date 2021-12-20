type Bps = {
  ethereum?: number
  polygon?: number
  xdai?: number
  optimism?: number
  arbitrum?: number
}

export type Fees = {
  USDC?: Bps
  USDT?: Bps
  DAI?: Bps
  MATIC?: Bps
  ETH?: Bps
  WBTC?: Bps
}

export type Config = {
  bonderFeeBps: Fees
  destinationFeeGasPriceMultiplier: number
}
