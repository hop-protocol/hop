import { TokenSymbol, getToken } from '@hop-protocol/sdk'

export function getTokenDecimals (tokenSymbol: string) {
  const decimals = getToken(tokenSymbol as TokenSymbol).decimals
  return decimals
}
