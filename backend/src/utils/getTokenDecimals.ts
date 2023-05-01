// TODO: move to config
const tokenDecimals: any = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ETH: 18,
  FRAX: 18,
  HOP: 18,
  WBTC: 8,
  SNX: 18,
  sUSD: 18,
  UNI: 18
}

export function getTokenDecimals (tokenSymbol: string) {
  return tokenDecimals[tokenSymbol]
}
