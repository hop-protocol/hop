import { EventEmitter } from 'node:events'
import { Message } from './Message.js'
import { OnchainEventIndexer, type RequiredEventFilter } from '../indexer/OnchainEventIndexer.js'
import type { LogWithChainId } from '../types.js'
import { DataStore } from '../data-store/DataStore.js'
import { MessageState, IMessage } from './types.js'
import { IDB } from '../db/DB.js'

interface IndexerData {
  filter: RequiredEventFilter
  indexName: keyof IMessage
}

/**
 * This class is responsible for abstracting away indexing logic
 * and for mapping concrete states to indexes so that the rest of
 * the message implementation doesn't need to concern itself with
 * the details of the indexing.
 */

export class MessageIndexer extends OnchainEventIndexer {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #initialEventTopic: string

  constructor (db: IDB, states: MessageState[], chainIds: string[]) {
    super(db)

    // TODO: Get from SDK
    this.#initialEventTopic = Message.HOP_CCTP_TRANSFER_SENT_SIG

    for (const state of states) {
      for (const chainId of chainIds) {
        const { filter, indexName } = this.#getIndexerData(chainId, state)
        this.initIndexer(chainId, filter, indexName)
      }
    }
  }

  /**
   * Public API
   */

  async getData(state: MessageState, value: IMessage): Promise<LogWithChainId> {
    const chainId: string = this.#getChainIdForItem(state, value)
    const eventSig = this.#getEventSigForState(chainId, state)
    const indexName = this.#getIndexerData(chainId, state).indexName
    const indexValue = value[indexName as keyof IMessage] as string
    return this.getItem(eventSig, chainId, indexValue)
  }

  /**
   * Event handler
   */

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  handleEvent(topic: string, log: LogWithChainId): void {
    if (topic === this.#initialEventTopic) {
      this.#handleInitialEvent(log)
    }
  }

  #handleInitialEvent (log: LogWithChainId): void {
    this.#eventEmitter.emit(DataStore.ITEM_CREATED, log)
  }

  /**
   * Internal
   */

  #getIndexerData(chainId: string, state: IMessage): IndexerData {
    if (MessageState.Sent === state) {
      return {
        filter: Message.getCCTPTransferSentEventFilter(chainId),
        indexName: 'nonce'
      }
    } else if (MessageState.Attested === state) {
      return {
        filter: Message.getMessageReceivedEventFilter(chainId),
        indexName: 'nonce'
      }
    }
    throw new Error('Invalid state')
  }

  #getEventSigForState (chainId: string, state: IMessage): string {
    return this.#getIndexerData(chainId, state).filter.topics[0] as string
  }

  #getChainIdForItem (state: IMessage, value: IMessage): string {
    let chainId: string
    if (MessageState.Sent === state) {
      chainId = value?.sourceChainId
    } else if (MessageState.Attested === state) {
      chainId = value?.destinationChainId
    } else {
      throw new Error('Invalid state')
    }

    if (!chainId) {
      throw new Error('Invalid chainId')
    }
    return chainId
  }
}
