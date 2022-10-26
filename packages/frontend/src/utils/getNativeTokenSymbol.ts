export function getNativeTokenSymbol (chainSlug: string) {
  if (chainSlug === 'polygon') {
    return 'MATIC'
  }

  if (chainSlug === 'gnosis') {
    return 'GNO'
  }

  return 'ETH'
}
