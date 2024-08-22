import {
  type EthersEventWithDecodedTypes,
  type TransferBonded,
  type TransferPosted,
  type TransferSent,
  addTypedEvent,
  getTransferSentEventFilter,
  getTransferPostedEventFilter,
  getTransferBondedEventFilter
} from '@hop-protocol/sdk'
import { OnchainEventIndexer, type IndexerEventFilter } from '#indexer/OnchainEventIndexer.js'
import { type IRailsTransfer, RailsTransferState } from './types.js'
import type { providers } from 'ethers'
import { getChainsFromPathId, getRailsStartBlockNumber } from './utils.js'

// TODO: Update with correct types
type LookupKey = (
  keyof EthersEventWithDecodedTypes<TransferSent> |
  keyof EthersEventWithDecodedTypes<TransferPosted> |
  keyof EthersEventWithDecodedTypes<TransferBonded>
)

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
    const path = getChainsFromPathId(value.pathId)
    const chainId: string = state === RailsTransferState.Sent ? path.srcChainId : path.destChainId
    return this.#getIndexerEventFilterByChainId(chainId, state)
  }

  protected override getLookupKeyValue (lookupKey: LookupKey, value: IRailsTransfer): string {
    // The transferId is unique across all chains and transfers, so we can use it for all states
    return value.transferId
  }

  protected override addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): EthersEventWithDecodedTypes {
    // TODO: V2: Ensure this method is exposed from SDK && that it accepts a providers.Log
    return addTypedEvent(log, chainId)
  }

  /**
   * Internal
   */

  #getIndexerEventFilterByChainId(chainId: string, state: RailsTransferState): IndexerEventFilter<LookupKey> {
    return {
      chainId,
      filter: this.#getFilterByState(state, chainId),
      startBlockNumber: getRailsStartBlockNumber(chainId),
      lookupKeys: ['transferId']
    }
  }

  #getFilterByState (state: RailsTransferState, chainId: string): IndexerEventFilter<LookupKey> {
    switch (state) {
      case RailsTransferState.Sent:
        return getTransferSentEventFilter(chainId)
      case RailsTransferState.Posted:
        return getTransferPostedEventFilter(chainId)
      case RailsTransferState.Bonded:
        return getTransferBondedEventFilter(chainId)
      default:
        throw new Error('Invalid state')
    }
  }
}
