import { Chain } from 'src/constants'
import { chains as chainMetadata } from '@hop-protocol/core/metadata'

export function isNativeToken (chain: Chain, token: string) {
  const nativeTokenSymbol = chainMetadata[chain]?.nativeTokenSymbol
  const isNative = nativeTokenSymbol === token
  return isNative
}
