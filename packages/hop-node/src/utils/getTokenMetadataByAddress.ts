import { config as globalConfig } from 'src/config'

const cache: Record<string, any> = {}

function getTokenMetadataByAddress (address: string, chain: string) {
  const cacheKey = `${chain}:${address}`
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }
  for (const tkn in globalConfig.tokens) {
    if (!globalConfig.tokens[tkn]?.[chain]) {
      continue
    }
    for (const k in globalConfig.tokens[tkn][chain]) {
      const val = globalConfig.tokens[tkn][chain][k]
      if (val === address) {
        const meta = globalConfig.metadata.tokens[
          tkn
        ]
        cache[cacheKey] = meta
        return meta
      }
    }
  }
  return null
}

export default getTokenMetadataByAddress
