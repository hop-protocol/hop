import { config as globalConfig } from '#config/index.js'

export function getTokenMetadata (tokenSymbol: string) {
  return globalConfig.metadata.tokens[tokenSymbol]
}
