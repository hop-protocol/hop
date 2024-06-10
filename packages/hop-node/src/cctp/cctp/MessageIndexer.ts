import { MessageSDK, HopCCTPTransferSentDecoded, HopCCTPTransferReceivedDecoded } from './MessageSDK.js'
import { OnchainEventIndexer, type IndexerEventFilter } from '../indexer/OnchainEventIndexer.js'
import type { TypedLogWithChainId } from '../types.js'
import { type IMessage, MessageState } from './types.js'

type IndexNames = (keyof HopCCTPTransferSentDecoded | keyof HopCCTPTransferReceivedDecoded)[]

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

  override async retrieveItem(state: MessageState, value: IMessage): Promise<TypedLogWithChainId> {
    const chainId: string = this.#getChainIdForItem(state, value)
    const indexerEventFilter = this.getIndexerEventFilter(chainId, state)
    const indexValues: string[] = this.#getIndexValues(state, value, chainId)
    return this.retrieveIndexedItem(indexerEventFilter, indexValues)
  }

  protected override getIndexerEventFilter(chainId: string, state: MessageState): IndexerEventFilter<IndexNames> {
    switch (state) {
      case MessageState.Sent:
        return {
          chainId,
          eventSig: MessageSDK.HOP_CCTP_TRANSFER_SENT_SIG,
          eventContractAddress: MessageSDK.getCCTPTransferSentEventFilter(chainId).address,
          indexTopicNames: ['cctpNonce', 'chainId']
        }
      case MessageState.Relayed:
        return {
          chainId,
          eventSig: MessageSDK.MESSAGE_RECEIVED_EVENT_SIG,
          eventContractAddress: MessageSDK.getMessageReceivedEventFilter(chainId).address,
          indexTopicNames: ['nonce', 'sourceDomain']
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

  #getIndexValues (state: MessageState, value: IMessage, chainId: string): string[] {
    const indexTopicNames = this.getIndexerEventFilter(chainId, state).indexTopicNames
    return indexTopicNames.map(indexTopicName => value[indexTopicName as keyof IMessage] as string)
  }
}
