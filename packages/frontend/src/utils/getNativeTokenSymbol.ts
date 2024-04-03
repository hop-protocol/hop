import { chains as chainsMetadata } from '@hop-protocol/sdk/metadata'

export function getNativeTokenSymbol (chainSlug: string) {
  return (chainsMetadata as any)[chainSlug].nativeTokenSymbol
}
