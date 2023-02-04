const chainSlugToNameMap: any = {
  ethereum: 'Ethereum',
  gnosis: 'Gnosis',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism'
}

export function chainSlugToName (chainSlug: string) {
  return chainSlugToNameMap[chainSlug]
}
