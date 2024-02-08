import { networks } from '../config'

const chainSlugToIdMap :any = {}

for (const chain in networks) {
  chainSlugToIdMap[chain] = (networks as any)[chain].networkId
}

export function chainSlugToId (chainSlug: string) {
  const id = chainSlugToIdMap[chainSlug]
  if (!id) {
    throw new Error(`Unknown chain slug ${chainSlug}`)
  }
  return id
}
