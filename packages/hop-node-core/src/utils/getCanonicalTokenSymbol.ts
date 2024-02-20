import { AssetSymbol } from '@hop-protocol/core/config'

export function getCanonicalTokenSymbol (tokenSymbol: string) {
  const symbols = Object.values(AssetSymbol)
  const pattern = symbols.join('|')

  // remove "h" (lowercase), "W" (wrapped prefix), and "X" prefix (for xDai)
  return tokenSymbol.replace(new RegExp(`^h?W?X?(${pattern})`, 'g'), '$1')
}
