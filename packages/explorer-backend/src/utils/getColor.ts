import { chains } from '@hop-protocol/core/metadata'

const colorsMap: any = {
  bonded: '#81ff81',
  pending: '#ffc55a',
  fallback: '#9f9fa3'
}

for (const chain in chains) {
  colorsMap[chain] = chains[chain].primaryColor
}

export function getColor (chain: string) {
  return colorsMap[chain] ?? colorsMap.fallback
}
