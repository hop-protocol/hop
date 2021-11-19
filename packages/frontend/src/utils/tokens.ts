import { metadata, addresses } from 'src/config'

export function getTokenImage(tokenSymbol: string) {
  const token = metadata.tokens[tokenSymbol]
  if (!token) {
    throw new Error(`could not find token: ${tokenSymbol}`)
  }
  return token.image
}

export function getTokenByAddress(network: string, address?: string) {
  for (const token in addresses.tokens) {
    const networkContracts = addresses.tokens[token][network]

    if (network === 'ethereum' && networkContracts.l1Bridge === address) {
      return token
    }

    if (
      networkContracts &&
      [
        networkContracts.l2Bridge,
        networkContracts.l2AmmWrapper,
        networkContracts.l2CanonicalToken,
      ].includes(address)
    ) {
      return token
    }
  }

  return `unknown token: ${address}`
}
