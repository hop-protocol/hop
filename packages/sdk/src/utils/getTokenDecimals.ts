import { getToken } from '@hop-protocol/sdk-core'

export function getTokenDecimals (tokenSymbol: string): number {
  return getToken(tokenSymbol).decimals
}
