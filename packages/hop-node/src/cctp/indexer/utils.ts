import { getChain } from '@hop-protocol/sdk'
import { utils } from 'ethers'
import { MAX_BLOCK_RANGE_PER_INDEX } from './constants.js'
import { IndexerEventFilter } from './OnchainEventIndexer.js'

export function getUniqueFilterId (indexerEventFilter: IndexerEventFilter): string {
  const { chainId, eventSig, eventContractAddress } = indexerEventFilter 
  return utils.keccak256(`${chainId}${eventSig}${eventContractAddress}`)
}

export function getMaxBlockRangePerIndex (chainId: string): number {
  const chainSlug = getChain(chainId).slug
  return MAX_BLOCK_RANGE_PER_INDEX[chainSlug]
}
