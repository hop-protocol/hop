import { TokenSymbol } from '../types.js'

/**
 * These utils are intended to be used internally by this module only.
 * They are not exported from the main module.
 */

// Return a type predicate
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
export function isValidTokenSymbol(symbol: any): symbol is TokenSymbol {
  return Object.values(TokenSymbol).includes(symbol)
}
