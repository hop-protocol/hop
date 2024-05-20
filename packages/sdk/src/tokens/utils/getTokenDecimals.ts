import type { TokenSymbol } from '../types.js'
import { getToken } from '../index.js'

export const getTokenDecimals = (symbol: TokenSymbol): number => {
  return getToken(symbol).decimals
}
