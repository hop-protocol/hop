import { getChain } from '@hop-protocol/sdk'

export function isNativeToken (chainId: string, token: string): boolean {
  const nativeTokenSymbol = getChain(chainId).nativeTokenSymbol
  return nativeTokenSymbol === token
}
