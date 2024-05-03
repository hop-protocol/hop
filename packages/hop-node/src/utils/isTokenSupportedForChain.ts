import { ChainSlug, TokenSymbol } from '@hop-protocol/sdk'
import { config as globalConfig } from '#config/index.js'

const isTokenSupportedForChain = (token: string, chainSlug: string): boolean => {
  if (!Object.values(TokenSymbol).includes(token as TokenSymbol)) {
    throw new Error(`token ${token} does not exist`)
  }
  if (!Object.values(ChainSlug).includes(chainSlug as ChainSlug)) {
    throw new Error(`chainSlug ${chainSlug} does not exist`)
  }

  return globalConfig.addresses[token][chainSlug] !== undefined
}

export default isTokenSupportedForChain
