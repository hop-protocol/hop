import { config as globalConfig } from 'src/config'

function getTokenMetadataByAddress (address: string) {
  for (const tkn in globalConfig.tokens) {
    for (const key in globalConfig.tokens[tkn]) {
      for (const net in globalConfig.tokens[tkn]) {
        for (const k in globalConfig.tokens[tkn][net]) {
          const val = globalConfig.tokens[tkn][net][k]
          if (val === address) {
            return globalConfig.metadata.tokens[
              tkn
            ]
          }
        }
      }
    }
  }
  return null
}

export default getTokenMetadataByAddress
