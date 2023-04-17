import * as metadata from '@hop-protocol/core/metadata'

export function getTokenDecimals (tokenSymbol: string) {
  const token = (metadata as any).tokens[tokenSymbol]
  if (!token) {
    throw new Error(`could not find token: ${tokenSymbol}`)
  }

  return token.decimals
}
