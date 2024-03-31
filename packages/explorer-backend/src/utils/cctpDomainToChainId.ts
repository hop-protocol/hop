import { chainSlugToId } from './chainSlugToId'

const domainMap: Record<string, string> = {
  '0': 'ethereum',
  '2': 'optimism',
  '3': 'arbitrum',
  '6': 'base',
  '7': 'polygon'
}

export function cctpDomainToChainId (sourceDomain: number): number | null {
  const slug = domainMap[sourceDomain.toString()]
  return slug ? chainSlugToId(slug) : null
}
