export function normalizeTokenSymbol(symbol: string) {
  if (symbol === 'WETH') {
    symbol = 'ETH'
  }
  if (symbol === 'XDAI') {
    symbol = 'DAI'
  }
  if (symbol === 'WXDAI') {
    symbol = 'DAI'
  }
  if (symbol === 'WMATIC') {
    symbol = 'MATIC'
  }
  return symbol
}
