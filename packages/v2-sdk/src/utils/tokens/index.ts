import type { TokenConfig } from '../../config/tokens/types.js'
import { tokens } from '../../config/tokens/tokens.js'

export function getToken(symbol: string): TokenConfig {
  return tokens[symbol]
}

export function getTokens(): TokenConfig[] {
  return Object.values(tokens)
}

export function isValidTokenSymbol(symbol: string): boolean {
  return tokens[symbol] !== undefined
}

export function getTokenDecimals(symbol: string): number {
  return getToken(symbol).decimals
}
