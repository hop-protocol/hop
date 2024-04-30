import type { Token, TokenSymbolish } from './types.js'
import { TokenSymbol } from './types.js'
import { tokens } from './tokens.js'
import { isValidTokenSymbol } from './utils/internal.js'

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
  return tokens[symbol]
}
