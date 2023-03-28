import { ChainSlug, NetworkSlug } from '../constants'

export function getChainSlugFromName (name: string) {
  let slug = (name || '').trim().toLowerCase().split(' ')[0]
  if (slug.startsWith('consensys') || slug.startsWith('linea')) {
    slug = ChainSlug.Linea
  }
  if (slug.startsWith('xdai')) {
    slug = ChainSlug.Gnosis
  }
  if (slug.startsWith('scroll')) {
    slug = ChainSlug.ScrollZk
  }
  if (
    slug === NetworkSlug.Kovan ||
    slug === NetworkSlug.Goerli ||
    slug === NetworkSlug.Mainnet ||
    slug === NetworkSlug.Staging ||
    slug === ChainSlug.Ethereum
  ) {
    slug = ChainSlug.Ethereum
  }

  return slug
}
