import { networks } from '../../config/networks/index.js'
import type { ChainConfig } from '../../config/networks/types.js'

/**
 * These utils are intended to be used internally by this module only.
 * They are not exported from the main module.
 */

export function getChainByChainId(chainId: string): ChainConfig {
  chainId = preprocessChainId(chainId)
  for (const network of Object.values(networks)) {
    for (const chain of Object.values(network.chains)) {
      if (chain.chainId === chainId) {
        return chain
      }
    }
  }
  throw new Error(`ChainConfig with chainId ${chainId} not found`)
}

export function getChainByNetworkSlugAndChainSlug(networkSlug: string, chainSlug: string): ChainConfig {
  const chain: ChainConfig | undefined = networks[networkSlug].chains?.[chainSlug]
  if (!chain) {
    throw new Error(`ChainConfig with networkSlug ${networkSlug} and chainSlug ${chainSlug} not found`)
  }
  return chain
}

function preprocessChainId(chainId: string): string {
  if (chainId.startsWith('0x')) {
    const decimal = parseInt(chainId.substring(2), 16)
    if (isNaN(decimal)) {
      throw new Error(`Invalid hexadecimal chainId: ${chainId}`)
    }
    return decimal.toString()
  }

  const decimal = parseInt(chainId, 10)
  if (isNaN(decimal)) {
    throw new Error(`Invalid hexadecimal chainId: ${chainId}`)
  }

  return chainId
}
