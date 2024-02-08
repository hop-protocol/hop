import { networks } from '../config'

const chainSlugToNameMap :any = {}

for (const chain in networks) {
  chainSlugToNameMap[chain] = networks[chain].name
}

export function chainSlugToName (chainSlug: string) {
  return chainSlugToNameMap[chainSlug]
}
