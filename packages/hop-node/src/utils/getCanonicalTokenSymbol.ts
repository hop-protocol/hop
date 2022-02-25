function getCanonicalTokenSymbol (tokenSymbol: string) {
  // remove "h", "W", and "X" prefix
  return tokenSymbol.replace(/^h?W?X?(ETH|MATIC|USDC|USDT|DAI|WBTC)/g, '$1')
}

export default getCanonicalTokenSymbol
