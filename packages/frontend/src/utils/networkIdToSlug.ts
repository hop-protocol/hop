import { networks } from 'src/config'

export const networkIdToSlug = (networkId: string | number): string => {
  for (const key in networks) {
    const v = networks[key]
    if (v.networkId.toString() === networkId.toString()) {
      return key
    }
  }

  return ''
}
