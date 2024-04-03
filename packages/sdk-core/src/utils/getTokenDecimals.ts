import { tokens as tokensMetadata } from '#metadata/index.js'

export function getTokenDecimals (tokenSymbol: string) {
  const token = (tokensMetadata as any)[tokenSymbol]
  if (!token) {
    throw new Error(`could not find token: ${tokenSymbol}`)
  }

  return token.decimals
}
