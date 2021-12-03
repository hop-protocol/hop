import networkIdToSlug from './networkIdToSlug'
import networkSlugToName from './networkSlugToName'

const networkIdToName = (networkId: string | number) => {
  return networkSlugToName(networkIdToSlug(networkId))
}

export default networkIdToName
