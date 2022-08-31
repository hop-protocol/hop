const hTokens = new Set(['hUSDC', 'hUSDT', 'hDAI', 'hMATIC', 'hETH'])

function isHToken (tokenSymbol: string) {
  return hTokens.has(tokenSymbol)
}

export default isHToken
