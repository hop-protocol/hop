import {
  type TransferSent,
  type TransferPosted,
  type TransferBonded,
  RailsSDKWrapper
} from './RailsSDK.js'
import { OnchainEventIndexer, type IndexerEventFilter } from '#indexer/OnchainEventIndexer.js'
import {
  type IRailsTransfer,
  RailsTransferState
} from './types.js'
import type { providers } from 'ethers'
import { getPathFromPathId, getRailsStartBlockNumber } from './utils.js'
import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'

// TODO: SDK: Sent -> posted
type LookupKey = keyof (TransferSent /*| TransferPosted */| TransferBonded)

/**
 * This class is responsible for abstracting away indexing logic
 * and for mapping concrete states to indexes so that the rest of
 * the Rails implementation doesn't need to concern itself with
 * the details of the indexing.
 */

export class RailsIndexer extends OnchainEventIndexer<RailsTransferState, IRailsTransfer, LookupKey> {

  constructor (dbName: string, states: RailsTransferState[], chainIds: string[]) {
    super(dbName)

    for (const state of states) {
      for (const chainId of chainIds) {
        const indexerEventFilter = this.#getIndexerEventFilterByChainId(chainId, state)
        this.addIndexerEventFilter(indexerEventFilter)
      }
    }
  }

  /**
   * Implementation
   */

  protected override getIndexerEventFilter(state: RailsTransferState, value: IRailsTransfer): IndexerEventFilter<LookupKey> {
    const path = getPathFromPathId(value.pathId)
    const chainId: string = state === RailsTransferState.Sent ? path.srcChainId : path.destChainId
    return this.#getIndexerEventFilterByChainId(chainId, state, value.pathId)
  }

  protected override getLookupKeyValue (lookupKey: LookupKey, value: IRailsTransfer): string {
    // The transferId is unique across all chains and transfers, so we can use it for all states
    return value.transferId
  }

  protected override addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): DecodedLogWithContext {
    return RailsSDKWrapper.addDecodedTypesAndContextToEvent(log, chainId)
  }

  /**
   * Internal
   */

  #getIndexerEventFilterByChainId(chainId: string, state: RailsTransferState, pathId?: string): IndexerEventFilter<LookupKey> {
    return {
      chainId,
      filter: this.#getFilterByState(state, chainId, pathId),
      startBlockNumber: getRailsStartBlockNumber(chainId),
      lookupKeys: ['transferId']
    }
  }

  #getFilterByState (state: RailsTransferState, chainId: string, pathId?: string): RequiredEventFilter {
    const indexes = pathId ? { pathId } : undefined
    switch (state) {
      case RailsTransferState.Sent:
        return RailsSDKWrapper.getTransferSentEventFilter(chainId, indexes)
      case RailsTransferState.Posted:
        return RailsSDKWrapper.getTransferPostedEventFilter(chainId, indexes)
      case RailsTransferState.Bonded:
        return RailsSDKWrapper.getTransferBondedEventFilter(chainId, indexes)
      default:
        throw new Error('Invalid state')
    }
  }
}
