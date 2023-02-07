const tokenDecimalsMap: any = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ETH: 18,
  HOP: 18,
  SNX: 18
}

export function getTokenDecimals (tokenSymbol: string) {
  return tokenDecimalsMap[tokenSymbol]
}
