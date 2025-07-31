import { networks } from '../../config/networks/index.js'

export function isValidNetworkSlug(slug: string): boolean {
  return networks[slug] !== undefined
}
