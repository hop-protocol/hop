import { config as globalConfig } from 'src/config'

const chainIdToSlug = (chainId: string | number): string | undefined => {
  if (!globalConfig.networks) {
    throw new Error('networks not found')
  }
  for (const k in globalConfig.networks) {
    const v = globalConfig.networks[k]
    if (!v) {
      continue
    }
    if (
      v?.networkId?.toString() === chainId.toString() ||
      v?.chainId?.toString() === chainId.toString()
    ) {
      return k
    }
  }
}

export default chainIdToSlug
