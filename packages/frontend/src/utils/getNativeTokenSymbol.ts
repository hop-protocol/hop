import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'

export function getNativeTokenSymbol (chainSlug: string) {
  // The native token is the same on all networks so default to Ethereum
  const chain = getChain(NetworkSlug.Mainnet, chainSlug as ChainSlug)
  return chain.nativeTokenSymbol
}
