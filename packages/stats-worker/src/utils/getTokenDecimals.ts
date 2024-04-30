import { getToken } from '@hop-protocol/sdk'

export function getTokenDecimals (tokenSymbol: string) {
  return getToken(tokenSymbol).decimals
}
