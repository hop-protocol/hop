import { MessageSDK } from './MessageSDK.js'
import { OnchainEventIndexer, type IndexerEventFilter } from '../indexer/OnchainEventIndexer.js'
import type { LogWithChainId } from '../types.js'
import { MessageState } from './Message.js'
import { IMessage } from './types.js'

type IndexNames = (keyof IMessage)[]

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

  override async retrieveItem(state: MessageState, value: IMessage): Promise<LogWithChainId> {
    const chainId: string = this.#getChainIdForItem(state, value)
    const indexerEventFilter = this.getIndexerEventFilter(chainId, state)
    const indexValues: string[] = this.#getIndexValues(state, value, chainId)
    return this.retrieveIndexedItem(indexerEventFilter, indexValues)
  }

  protected override getIndexerEventFilter(chainId: string, state: IMessage): IndexerEventFilter<IndexNames> {
    switch (state) {
      case MessageState.Sent:
        return {
          chainId,
          eventSig: MessageSDK.HOP_CCTP_TRANSFER_SENT_SIG,
          eventContractAddress: MessageSDK.getCCTPTransferSentEventFilter(chainId).address,
          // TODO: Correct index. This might be it.
          indexTopics: ['nonce', 'sourceChainId']
        }
      case MessageState.Attested:
        return {
          chainId,
          eventSig: MessageSDK.MESSAGE_RECEIVED_EVENT_SIG,
          // TODO: Correct index. This might be it.
          eventContractAddress: MessageSDK.getMessageReceivedEventFilter(chainId).address,
          indexTopics: ['nonce', 'sourceChainId']
        }
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  // TODO: Using diff chainIds as index for same message doesn't feel right
  #getChainIdForItem (state: IMessage, value: IMessage): string {
    let chainId: string
    switch (state) {
      case MessageState.Sent:
        chainId = value?.sourceChainId
        break
      case MessageState.Attested:
        chainId = value?.destinationChainId
        break
      default:
        throw new Error('Invalid state')
    }

    if (!chainId) {
      throw new Error('Invalid chainId')
    }
    return chainId
  }

  #getIndexValues (state: IMessage, value: IMessage, chainId: string): string[] {
    const indexTopics = this.getIndexerEventFilter(chainId, state).indexTopics
    return indexTopics.map(indexTopic => value[indexTopic as keyof IMessage] as string)
  }
}
