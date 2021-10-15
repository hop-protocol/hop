function getCanonicalTokenSymbol (tokenSymbol: string) {
  return tokenSymbol.replace(/^h/, '')
}

export default getCanonicalTokenSymbol
