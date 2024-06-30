import { getChain } from '@hop-protocol/sdk'
import { utils } from 'ethers'
import { MAX_BLOCK_RANGE_PER_INDEX } from './constants.js'
import { IndexerEventFilter } from './OnchainEventIndexer.js'
import { FinalityService } from '#finality/index.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { getNetworkCustomSyncType } from '#config/index.js'
import { SyncType } from '#constants/index.js'

export function getUniqueFilterId (indexerEventFilter: IndexerEventFilter): string {
  const { chainId, filter } = indexerEventFilter 
  const id = chainId + filter.address + (filter.topics as string[])[0]
  return utils.keccak256(utils.toUtf8Bytes(id))
}

export function getMaxBlockRangePerIndex (chainId: string): number {
  const chainSlug = getChain(chainId).slug
  return MAX_BLOCK_RANGE_PER_INDEX[chainSlug]
}

// TODO: V2: Should not be in CCTP module
export async function getSyncBlockNumber (chainId: string): Promise<number> {
  const chainSlug = getChain(chainId).slug
  const provider = getRpcProvider(chainSlug)

  const syncType = getNetworkCustomSyncType(chainSlug) ?? SyncType.Bonder
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
