import { config as globalConfig } from '#src/config/index.js'

export function getTokenMetadata (tokenSymbol: string) {
  return globalConfig.metadata.tokens[tokenSymbol]
}
