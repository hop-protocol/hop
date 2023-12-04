import { chains as chainsMetadata } from '@hop-protocol/core/metadata/chains'

export function getNativeTokenSymbol (chainSlug: string) {
  return (chainsMetadata as any)[chainSlug].nativeTokenSymbol
}
