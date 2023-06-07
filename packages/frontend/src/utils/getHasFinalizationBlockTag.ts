import { networks } from 'src/config'

export const getHasFinalizationBlockTag = (slug: string): boolean => {
  for (const key in networks) {
    const v = networks[key]
    if (key === slug) {
      return v.hasFinalizationBlockTag
    }
  }

  return false
}
