import { Chain } from '#constants/index.js'
import { config as globalConfig } from '#config/index.js'

const cache: Record<string, Chain> = {}

export const chainIdToSlug = (chainId: string | number): Chain => {
  const cacheKey = chainId?.toString()
  const cachedValue = cache[cacheKey]
  if (cachedValue) {
    return cachedValue
  }
  if (!globalConfig.networks) {
    throw new Error('networks not found')
  }
  for (const k in globalConfig.networks) {
    const v = (globalConfig as any).networks[k]
    if (!v) {
      continue
    }
    if (
      v?.networkId?.toString() === chainId.toString() ||
      v?.chainId?.toString() === chainId.toString()
    ) {
      const chain = k as Chain
      cache[cacheKey] = chain
      return chain
    }
  }
  throw new Error(`chain ID ${chainId} not found`)
}
