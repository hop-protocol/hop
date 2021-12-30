import { networkIdToSlug } from './networkIdToSlug'
import { networkSlugToName } from './networkSlugToName'

export const networkIdToName = (networkId: string | number) => {
  return networkSlugToName(networkIdToSlug(networkId))
}
