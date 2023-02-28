import { ChainSlug, NetworkSlug } from '../constants'

export function getChainSlugFromName (name: string) {
  let slug = (name || '').trim().toLowerCase().split(' ')[0]
  if (slug.startsWith('consensys')) {
    slug = ChainSlug.ConsenSysZk
  }
  if (slug.startsWith('xdai')) {
    slug = ChainSlug.Gnosis
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
