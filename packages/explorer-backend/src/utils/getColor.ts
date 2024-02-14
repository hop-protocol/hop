import { chains } from '@hop-protocol/core/metadata'

const colorsMap: Record<string, string> = {
  bonded: '#81ff81',
  pending: '#ffc55a',
  fallback: '#9f9fa3'
}

for (const chain in chains) {
  colorsMap[chain] = (chains as any)[chain].primaryColor
}

export function getColor (chain: string) {
  return colorsMap[chain] ?? colorsMap.fallback
}
