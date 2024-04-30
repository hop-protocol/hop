import { getChain } from '@hop-protocol/sdk'

export function isNativeToken (chainId: number, token: string) {
  const nativeTokenSymbol = getChain(chainId).nativeTokenSymbol
  return nativeTokenSymbol === token
}
