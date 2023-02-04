const chainLogosMap: any = {
  ethereum: 'https://assets.hop.exchange/logos/ethereum.svg',
  gnosis: 'https://assets.hop.exchange/logos/gnosis.svg',
  polygon: 'https://assets.hop.exchange/logos/polygon.svg',
  optimism: 'https://assets.hop.exchange/logos/optimism.svg',
  arbitrum: 'https://assets.hop.exchange/logos/arbitrum.svg'
}

export function getChainLogo (chainSlug: string) {
  return chainLogosMap[chainSlug]
}
