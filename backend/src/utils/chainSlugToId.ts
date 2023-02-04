const chainSlugToIdMap: any = {
  ethereum: 1,
  optimism: 10,
  gnosis: 100,
  polygon: 137,
  arbitrum: 42161
}

export function chainSlugToId (chainSlug: string) {
  return chainSlugToIdMap[chainSlug]
}
