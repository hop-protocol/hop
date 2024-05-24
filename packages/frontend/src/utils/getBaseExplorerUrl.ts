import { networks } from '#config/index.js'

export const getBaseExplorerUrl = (slug: string) => {
  for (const key in networks) {
    const v = networks[key]
    if (key === slug) {
      return v.explorerUrl.replace(/\/$/, '')
    }
  }

  return ''
}
