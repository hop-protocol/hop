import { EventEmitter } from 'node:events'
import { Message } from './Message.js'
import { OnchainEventIndexer, type RequiredEventFilter } from '../indexer/OnchainEventIndexer.js'
import { MessageState } from './MessageManager.js '
import type { LogWithChainId } from '../types.js'
import { Repository } from '../repository/Repository.js'

interface IndexData {
  filter: RequiredEventFilter
  index: string[]
}

/**
 * This class is responsible for mapping concrete states to indexes so
 * that the rest of the message implementation doesn't need to concern
 * itself with the details of the indexing.
 */

export class MessageIndexer<T> extends OnchainEventIndexer {
  readonly #eventEmitter: EventEmitter = new EventEmitter()
  readonly #initialEventTopic: string

  constructor (states: T[], chainIds: string[]) {
    super()

    // TODO: Get from SDK
    this.#initialEventTopic = Message.HOP_CCTP_TRANSFER_SENT_SIG

    for (const state of states) {
      for (const chainId of chainIds) {
        const indexData = this.#getIndexDataForState(state, chainId)
        this.initIndexer(chainId, indexData.filter, indexData.index)
      }
    }
  }

  async getData(state: T, chainId: string, index: string): Promise<LogWithChainId> {
    const eventSig = this.#getEventSigForState(state, chainId)
    return this.getItem(eventSig, chainId, index)
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
    this.#eventEmitter.emit(Repository.ITEM_CREATED, log)
  }

  /**
   * Internal
   */

  #getIndexDataForState (state: T, chainId: string): IndexData {
    if (MessageState.Sent === state) {
      return {
        filter: Message.getCCTPTransferSentEventFilter(chainId),
        index: ['sourceChainId', 'destinationChainId', 'messageNonce']
      }
    } else if (MessageState.Attested === state) {
      return {
        filter: Message.getMessageReceivedEventFilter(chainId),
        index: ['sourceChainId', 'destinationChainId', 'messageNonce']
      }
    }
    throw new Error('Invalid state')
  }

  #getEventSigForState (state: T, chainId: string): string {
    return this.#getIndexDataForState(state, chainId).filter.topics[0] as string
  }
}
