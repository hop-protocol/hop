import { MessageSDK, HopCCTPTransferSentDecoded, HopCCTPTransferReceivedDecoded } from './MessageSDK.js'
import { OnchainEventIndexer, type IndexerEventFilter } from '../indexer/OnchainEventIndexer.js'
import type { DecodedLogWithContext } from '../types.js'
import { type IMessage, type ISentMessage, type IRelayedMessage, MessageState } from './types.js'
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
        const indexerEventFilter = this.#getIndexerEventFilterByChainId(chainId, state)
        this.addIndexerEventFilter(indexerEventFilter)
      }
    }
  }

  /**
   * Implementation
   */

  protected override getIndexerEventFilter(state: MessageState, value: IMessage): IndexerEventFilter<LookupKeys> {
    const chainId: string = this.#getChainIdForContext(state, value)
    return this.#getIndexerEventFilterByChainId(chainId, state)
  }

  protected override getLookupKeyValues (state: MessageState, value: IMessage): string[] {
    const lookupKeys = this.getIndexerEventFilter(state, value).lookupKeys
    return lookupKeys.map(
      (lookupKey: string) => value[lookupKey as keyof IMessage] as string
    )
  }

  protected override addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): DecodedLogWithContext {
    return MessageSDK.addDecodedTypesAndContextToEvent(log, chainId)
  }

  /**
   * Internal
   */

  #getIndexerEventFilterByChainId(chainId: string, state: MessageState): IndexerEventFilter<LookupKeys> {
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

  #getChainIdForContext (state: MessageState, value: IMessage): string {
    switch (state) {
      case MessageState.Sent:
        return (value as ISentMessage).sourceChainId
      case MessageState.Relayed:
        return (value as IRelayedMessage).destinationChainId
      default:
        throw new Error('Invalid state')
    }
  }
}
