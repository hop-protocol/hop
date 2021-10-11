function isHToken (tokenSymbol: string) {
  return ['hUSDC', 'hUSDT', 'hDAI', 'hMATIC', 'hETH'].includes(tokenSymbol)
}

export default isHToken
