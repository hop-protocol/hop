import { networks } from '../config'

const getSlugFromChainIdMap:any = {}

for (const chain in networks) {
  getSlugFromChainIdMap[(networks as any)[chain].chainId] = chain
}

export function getSlugFromChainId (chainId: number) {
  const slug = getSlugFromChainIdMap[chainId.toString()]
  if (!slug) {
    throw new Error(`Unknown chain id ${chainId}`)
  }
  return slug
}
