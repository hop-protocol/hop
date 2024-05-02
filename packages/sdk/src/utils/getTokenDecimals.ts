import { getToken, TokenSymbol, isValidTokenSymbol } from '@hop-protocol/sdk-core'

export function getTokenDecimals (tokenSymbol: TokenSymbol | string): number {
  if (!isValidTokenSymbol(tokenSymbol)) {
    throw new Error('invalid token symbol')
  }
  return getToken(tokenSymbol).decimals
}
