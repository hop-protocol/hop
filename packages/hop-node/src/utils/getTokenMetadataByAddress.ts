import { config as globalConfig } from 'src/config'

function getTokenMetadataByAddress (address: string, chain: string) {
  for (const tkn in globalConfig.tokens) {
    if (!globalConfig.tokens?.[tkn]?.[chain]) {
      continue
    }
    for (const k in globalConfig.tokens[tkn][chain]) {
      const val = globalConfig.tokens[tkn][chain][k]
      if (val === address) {
        return globalConfig.metadata?.tokens[
          tkn
        ]
      }
    }
  }
  return null
}

export default getTokenMetadataByAddress
