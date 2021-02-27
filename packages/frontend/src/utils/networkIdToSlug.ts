import { networks } from 'src/config'

export const networkIdToSlug = (networkId: string | number) => {
  for (let key in networks) {
    const v = networks[key]
    if (v.networkId == networkId.toString()) {
      return key
    }
  }

  return ''
}

export default networkIdToSlug
