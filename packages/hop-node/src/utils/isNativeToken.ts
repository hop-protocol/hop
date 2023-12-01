import { Chain } from 'src/constants'
import { chains as chainMetadata } from '@hop-protocol/core/metadata/chains'

export function isNativeToken (network: Chain, token: string) {
  const nativeTokenSymbol = chainMetadata[network]?.nativeTokenSymbol
  const isNative = nativeTokenSymbol === token
  return isNative
}
