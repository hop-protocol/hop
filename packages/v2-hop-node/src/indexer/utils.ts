import { getChain } from '@hop-protocol/sdk'
import { utils } from 'ethers'
import { MAX_BLOCK_RANGE_PER_GET_LOG_CALL } from '#constants/index.js'
import type { IndexerEventFilter } from './OnchainEventIndexer.js'
import { FinalityService } from '#finality/index.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { SignerConfig } from '#config/index.js'
import type { ChainSlug } from '@hop-protocol/sdk'

export function getUniqueFilterId (indexerEventFilter: IndexerEventFilter): string {
  const { chainId, filter } = indexerEventFilter
  const id = chainId + filter.address + (filter.topics as string[])[0]
  return utils.keccak256(utils.toUtf8Bytes(id))
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
