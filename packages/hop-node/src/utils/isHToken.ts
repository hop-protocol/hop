const hTokens = new Set(['hUSDC', 'hUSDT', 'hDAI', 'hMATIC', 'hETH', 'hHOP', 'hSNX', 'hsUSD', 'hrETH'])

function isHToken (tokenSymbol: string) {
  return hTokens.has(tokenSymbol)
}

export default isHToken
