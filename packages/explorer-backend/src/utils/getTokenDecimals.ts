import { getToken } from '@hop-protocol/sdk'

export function getTokenDecimals (tokenSymbol: string) {
  const decimals = getToken(tokenSymbol).decimals
  return decimals
}
