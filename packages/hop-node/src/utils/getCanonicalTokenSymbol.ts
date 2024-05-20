import { TokenSymbol } from '@hop-protocol/sdk'

export function getCanonicalTokenSymbol (tokenSymbol: string) {
  const symbols = Object.values(TokenSymbol)
  const pattern = symbols.join('|')

  // remove "h" (lowercase), "W" (wrapped prefix), and "X" prefix (for xDai)
  return tokenSymbol.replace(new RegExp(`^h?W?X?(${pattern})`, 'g'), '$1')
}
