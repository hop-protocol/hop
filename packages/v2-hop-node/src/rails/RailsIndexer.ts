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
import type { EthersEventWithDecodedTypes } from '#types/index.js'
import { type IRailsTransfer, RailsTransferState } from './types.js'
import type { providers } from 'ethers'
import { getRailsStartBlockNumber } from './utils.js'

// TODO: Update with correct types
// type LookupKey = (keyof HopCCTPTransferSentDecoded | keyof HopCCTPTransferReceivedDecoded)
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
    const chainId: string = this.#getChainIdForContext(state, value)
    return this.#getIndexerEventFilterByChainId(chainId, state)
  }

  protected override getLookupKeyValue (lookupKey: LookupKey, value: IRailsTransfer): string {
    switch (lookupKey) {
      // TODO: Fill this in
      // case 'transferId':
      //   return value.transferId.toString()
      // TODO: I did above, now do below
      // case 'chainId':
      //   return value.sourceChainId
      // case 'nonce':
      //   return value.messageNonce.toString()
      // case 'sourceDomain':
      //   return MessageSDK.getDomainFromChainId(value.sourceChainId)
      default:
        throw new Error('Invalid lookup key')
    }
  }

  protected override addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): EthersEventWithDecodedTypes {
    // TODO: Ensure this method is exposed from SDK && that it accepts a providers.Log
    return addTypedEvent(log, chainId)
  }

  /**
   * Internal
   */

  #getIndexerEventFilterByChainId(chainId: string, state: RailsTransferState): IndexerEventFilter<LookupKey> {
    switch (state) {
      case RailsTransferState.Sent:
        return {
          chainId,
          filter: getTransferSentEventFilter(chainId),
          startBlockNumber: getRailsStartBlockNumber(chainId),
          // TODO: Fill this in
          lookupKeys: ['TODO']
        }
      case RailsTransferState.Posted:
        return {
          chainId,
          filter: getTransferPostedEventFilter(chainId),
          startBlockNumber: getRailsStartBlockNumber(chainId),
          // TODO: Fill this in
          lookupKeys: ['TODO']
        }
      case RailsTransferState.Bonded:
        return {
          chainId,
          filter: getTransferBondedEventFilter(chainId),
          startBlockNumber: getRailsStartBlockNumber(chainId),
          // TODO: Fill this in
          lookupKeys: ['TODO']
        }
      default:
        throw new Error('Invalid state')
    }
  }

  #getChainIdForContext (state: RailsTransferState, value: IRailsTransfer): string {
    switch (state) {
      // TODO: Fill this in
      case RailsTransferState.Sent:
        // return value.sourceChainId
      case RailsTransferState.Posted:
        // return value.sourceChainId
      case RailsTransferState.Bonded:
        // return value.destinationChainId
      default:
        throw new Error('Invalid state')
    }
  }
}
