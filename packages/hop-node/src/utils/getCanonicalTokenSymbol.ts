function getCanonicalTokenSymbol (tokenSymbol: string) {
  return tokenSymbol.replace(/^[hWX]/g, '')
}

export default getCanonicalTokenSymbol
