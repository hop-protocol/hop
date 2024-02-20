import { config as globalConfig } from 'src/config/index.js'

function getTokenMetadata (tokenSymbol: string) {
  return globalConfig.metadata.tokens[tokenSymbol]
}

export default getTokenMetadata
