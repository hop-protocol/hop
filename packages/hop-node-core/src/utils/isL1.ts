import { ChainSlug } from '@hop-protocol/sdk'

export const isL1 = (network: string) => {
  return network === ChainSlug.Ethereum
}
