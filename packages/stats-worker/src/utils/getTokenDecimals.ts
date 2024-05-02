import { TokenSymbol, getToken } from '@hop-protocol/sdk'

export function getTokenDecimals (tokenSymbol: string) {
  return getToken(tokenSymbol as TokenSymbol).decimals
}
