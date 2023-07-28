import { networks } from '../config'

const chainIdToSlugMap :any = {}

for (const chain in networks) {
  chainIdToSlugMap[networks[chain].networkId] = chain
}

export function chainIdToSlug (chainId: number) {
  const slug = chainIdToSlugMap[chainId]
  if (!slug) {
    throw new Error(`Unknown chain id ${chainId}`)
  }
  return slug
}
