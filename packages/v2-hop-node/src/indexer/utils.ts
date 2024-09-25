import { getChain } from '@hop-protocol/sdk'
import { MAX_BLOCK_RANGE_PER_GET_LOG_CALL } from '#constants/index.js'
import { FinalityService } from '#finality/index.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { SignerConfig } from '#config/index.js'
import type { ChainSlug } from '@hop-protocol/sdk'

/**
 * Indexer
 */

export function getUniqueFilterId (eventName: string, chainId: string, contractAddress: string): string {
  return`${eventName}!${chainId}!${contractAddress}`
}

export function getMaxBlockRangePerIndex (chainId: string): number {
  const chainSlug = getChain(chainId).slug
  return MAX_BLOCK_RANGE_PER_GET_LOG_CALL[chainSlug]
}

export async function getIndexerSyncBlockNumber (chainId: string): Promise<number> {
  const chainSlug = getChain(chainId).slug
  const provider = getRpcProvider(chainSlug)

  const syncType = SignerConfig.chains[chainSlug as ChainSlug]?.syncType
  const finalityService = new FinalityService(
    provider,
    chainSlug,
    syncType as any
  )

  if (finalityService.isCustomBlockNumberImplemented()) {
    return finalityService.getCustomBlockNumber()
  }
  return finalityService.getSafeBlockNumber()
}

/**
 * General
 */

export function stringifyObjectValues (obj: Record<string, unknown>): string[] {
  return Object.values(obj)
    .map(value => value?.toString() ?? '')
    .filter(x => x !== '')
}
