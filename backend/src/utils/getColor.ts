// TODO: move to config
const colorsMap: any = {
  ethereum: '#868dac',
  gnosis: '#46a4a1',
  polygon: '#8b57e1',
  optimism: '#e64b5d',
  arbitrum: '#289fef',
  nova: '#ec772c',
  bonded: '#81ff81',
  pending: '#ffc55a',
  fallback: '#9f9fa3'
}

export function getColor (chain: string) {
  return colorsMap[chain] ?? colorsMap.fallback
}
