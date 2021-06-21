import { networks } from 'src/config'

export const networkIdToSlug = (networkId: string | number) => {
  for (const key in networks) {
    const v = networks[key]
    if (v.networkId.toString() === networkId.toString()) {
      return key
    }
  }

  return ''
}

export default networkIdToSlug
