// TODO: move to config
const chainIdToSlugMap: any = {
  1: 'ethereum',
  5: 'ethereum',
  42: 'ethereum',
  10: 'optimism',
  69: 'optimism',
  420: 'optimism',
  77: 'gnosis',
  100: 'gnosis',
  137: 'polygon',
  80001: 'polygon',
  42161: 'arbitrum',
  421611: 'arbitrum',
  421613: 'arbitrum',
  42170: 'nova',
  59140: 'linea',
  84531: 'base',
  534354: 'scroll'
}

export function chainIdToSlug (chainId: number) {
  return chainIdToSlugMap[chainId]
}
