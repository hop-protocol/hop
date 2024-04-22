import { getTokenMetadata } from './getTokenMetadata.js'

export function getTokenDecimals (tokenSymbol: string): number {
  return getTokenMetadata(tokenSymbol)?.decimals
}
