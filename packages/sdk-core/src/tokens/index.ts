import type { Token, TokenSymbolish } from './types.js'
import { TokenSymbol } from './types.js'
import { isValidTokenSymbol, _getToken } from './utils/internal.js'

/**
 * Types and utils
 */

export type { Token, TokenSymbolish }
export { TokenSymbol }

/**
 * Main methods to be consumed
 */

export const getToken = (symbol: TokenSymbolish): Token => {
  if (!isValidTokenSymbol(symbol)) {
    throw new Error(`Invalid token symbol: ${symbol}`)
  }
  return _getToken(symbol)
}

export const getTokens = (): Token[] => {
  return Object.values(TokenSymbol).map(tokenSymbol => getToken(tokenSymbol))
}