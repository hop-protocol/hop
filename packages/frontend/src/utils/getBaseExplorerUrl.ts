import { networks } from 'src/config'

export const getBaseExplorerUrl = (slug: string) => {
  for (const key in networks) {
    const v = networks[key]
    if (key === slug) {
      return v.explorerUrl
    }
  }

  return ''
}

export default getBaseExplorerUrl
