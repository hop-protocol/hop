// TODO: move to config
const chainSlugToNameMap: any = {
  ethereum: 'Ethereum',
  gnosis: 'Gnosis',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism',
  nova: 'Nova',
  linea: 'Linea',
  base: 'Base',
  scroll: 'Scroll'
}

export function chainSlugToName (chainSlug: string) {
  return chainSlugToNameMap[chainSlug]
}
