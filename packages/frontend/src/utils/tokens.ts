import { metadata } from 'src/config'

export function getTokenImage(tokenSymbol: string) {
  const token = metadata.tokens[tokenSymbol]
  if (!token) {
    throw new Error(`could not find token: ${tokenSymbol}`)
  }
  return token.image
}
