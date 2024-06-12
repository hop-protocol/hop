import { NetworkSlug, getNetwork } from '@hop-protocol/sdk'

const colorsMap: Record<string, string> = {
  bonded: '#81ff81',
  pending: '#ffc55a',
  fallback: '#9f9fa3'
}

// Colors are the same for each network so just default to Mainnet
for (const chains of Object.values(getNetwork(NetworkSlug.Mainnet))) {
  for (const chain of Object.values(chains)) {
    colorsMap[chain.slug] = chain.primaryColor
  }
}

export function getColor (chain: string) {
  return colorsMap[chain] ?? colorsMap.fallback
}
