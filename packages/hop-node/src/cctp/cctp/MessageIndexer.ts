import { MessageSDK, HopCCTPTransferSentDecoded, HopCCTPTransferReceivedDecoded } from './MessageSDK.js'
import { OnchainEventIndexer, type IndexerEventFilter } from '../indexer/OnchainEventIndexer.js'
import type { DecodedLogWithContext } from '../types.js'
import { type IMessage, MessageState } from './types.js'
import { providers } from 'ethers'

type LookupKeys = (keyof HopCCTPTransferSentDecoded | keyof HopCCTPTransferReceivedDecoded)

/**
 * This class is responsible for abstracting away indexing logic
 * and for mapping concrete states to indexes so that the rest of
 * the message implementation doesn't need to concern itself with
 * the details of the indexing.
 */

export class MessageIndexer extends OnchainEventIndexer<MessageState, IMessage> {

  constructor (dbName: string, states: MessageState[], chainIds: string[]) {
    super(dbName)

    for (const state of states) {
      for (const chainId of chainIds) {
        const indexerEventFilter = this.getIndexerEventFilter(chainId, state)
        this.addIndexerEventFilter(indexerEventFilter)
      }
    }
  }

  /**
   * Implementation
   */

  override async retrieveItem(state: MessageState, value: IMessage): Promise<DecodedLogWithContext> {
    const chainId: string = this.#getChainIdForItem(state, value)
    const indexerEventFilter = this.getIndexerEventFilter(chainId, state)
    const lookupKeyValues: string[] = this.#getLookupKeyValues(state, value, chainId)
    return this.retrieveIndexedItem(indexerEventFilter, lookupKeyValues)
  }

  protected override addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): DecodedLogWithContext {
    return MessageSDK.addDecodedTypesAndContextToEvent(log, chainId)
  }

  protected override getIndexerEventFilter(chainId: string, state: MessageState): IndexerEventFilter<LookupKeys> {
    switch (state) {
      case MessageState.Sent:
        return {
          chainId,
          filter: MessageSDK.getCCTPTransferSentEventFilter(chainId),
          lookupKeys: ['cctpNonce', 'chainId']
        }
      case MessageState.Relayed:
        return {
          chainId,
          filter: MessageSDK.getMessageReceivedEventFilter(chainId),
          lookupKeys: ['nonce', 'sourceDomain']
        }
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #getChainIdForItem (state: MessageState, value: IMessage): string {
    switch (state) {
      case MessageState.Sent:
        return value.sourceChainId
      case MessageState.Relayed:
        return value.destinationChainId
      default:
        throw new Error('Invalid state')
    }
  }

  #getLookupKeyValues (state: MessageState, value: IMessage, chainId: string): string[] {
    const lookupKeys = this.getIndexerEventFilter(chainId, state).lookupKeys
    return lookupKeys.map((lookupKey: string) => value[lookupKey as keyof IMessage] as string)
  }
}
