import { type Token, TokenSymbol } from '../types.js'
import { tokens } from '../tokens.js'

/**
 * These utils are intended to be used internally by this module only.
 * They are not exported from the main module.
 */

// Use an internal _getToken to keep the tokens object private from index.ts
export function _getToken (symbol: TokenSymbol): Token {
  return tokens[symbol]
}
