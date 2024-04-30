import { config as globalConfig } from '#config/index.js'
import type { ChainSlug } from '@hop-protocol/sdk'

const cache: Record<string, ChainSlug> = {}

export const chainIdToSlug = (chainId: string | number): ChainSlug => {
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
    if (v?.chainId?.toString() === chainId.toString()) {
      const chain = k as ChainSlug
      cache[cacheKey] = chain
      return chain
    }
  }
  throw new Error(`chain ID ${chainId} not found`)
}
