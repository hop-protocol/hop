import { getChainNativeTokenSymbol } from '@hop-protocol/sdk'

export function isNativeToken (chainId: string, token: string): boolean {
  const nativeTokenSymbol = getChainNativeTokenSymbol(chainId)
  return nativeTokenSymbol === token
}
