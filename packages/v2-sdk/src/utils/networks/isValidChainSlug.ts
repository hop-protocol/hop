import { networks } from '../../config/networks/index.js'

export function isValidChainSlug(slug: string): boolean {
  // return true is some network has some chain with the given slug
  return Object.values(networks).some(network =>
    Object.values(network.chains).some(chain =>
      chain.slug === slug
    )
  )
}
