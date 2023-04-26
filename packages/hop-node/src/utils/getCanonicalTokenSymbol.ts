// TODO: read from core
function getCanonicalTokenSymbol (tokenSymbol: string) {
  // remove "h" (lowercase), "W", and "X" prefix
  return tokenSymbol.replace(/^h?W?X?(ETH|MATIC|USDC|USDT|DAI|WBTC|HOP|SNX|sUSD|rETH|UNI)/g, '$1')
}

export default getCanonicalTokenSymbol
