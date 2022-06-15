const hTokens = new Set(['hUSDC', 'hUSDT', 'hDAI', 'hMATIC', 'hETH', 'hFRAX'])

function isHToken (tokenSymbol: string) {
  return hTokens.has(tokenSymbol)
}

export default isHToken
