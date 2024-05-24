import { EventEmitter } from 'node:events'
import { IDataStore, IGetStoreDataRes, IOnchainEventStoreRes, IMessageDataRepository } from './types.js'
import type { LogWithChainId } from '../types.js'
import { Message } from './Message.js'
import { MessageState } from './MessageManager.js'
import { getTimestampFromBlockNumberMs } from './utils.js'
import { ChainSlug, getChain } from '@hop-protocol/sdk'
import { MessageIndexer } from './MessageIndexer.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { Repository } from '../repository/Repository.js'


// Since the messages are unique by chainId, his MessageDataRepository should be the
// class that abstracts this away.

// from datastore
export class MessageDataRepository<T, U> extends Repository<T, U> {
  readonly #indexer: MessageIndexer<T>
  readonly #eventEmitter: EventEmitter = new EventEmitter()

  constructor (states: T[], chains: ChainSlug[]) {
    super()

    this.#indexer = new MessageIndexer(states, chains)
    this.#indexer.on(Repository.ITEM_CREATED, this.#handleInitialEvent)
  }

  // TODO: Value and resp are different U
  async getItem(state: T, value: U): Promise<U | undefined> {
    const chainId = this.#getChainIdForItem(state, value)
    const transitionKey = this.#getIndexForItem(state, value)
    // TODO: err handle
    const eventData: LogWithChainId | undefined = await this.#indexer.getData(chainId, state, transitionKey)
    if (!eventData) return

    // TODO: Probably fmt, not prs
    return this.#parseEventData(state, eventData)
  }

  /**
   * Public interface
   */

  // TODO: Multiple indicies?
  async getData (chainId: string, index: string): Promise<IOnchainEventStoreRes | undefined> {
    return this.#db.getIndexedDataBySecondIndex(chainId, index)
  }

  // TODO: needs more than chainId. What if there are multiple bridges deployed on the same chain
  #getChainIdForItem (state: T, value: U): string {
    if (MessageState.Sent === state) {
      return value.sourceChainId
    } else if (MessageState.Attested === state) {
      return value.destinationChainId
    }
    throw new Error('Invalid state')
  }

  #getIndexForItem (state: T, value: U): string {
    if (MessageState.Sent === state) {
      throw new Error('No transition data key for initial state')
    } else if (MessageState.Relayed === state) {
      return key
    }
    throw new Error('Invalid state')
  }

  /**
   * Event handler
   */

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  #handleInitialEvent (log: LogWithChainId): void {
    const parsedLog = this.#parseInitializationLog(log)
    this.#eventEmitter.emit(Repository.ITEM_CREATED, parsedLog)
  }

  /**
   * Initialization
   */

  async #parseInitializationLog (transferSentLog: LogWithChainId): Promise<U> {
    // TODO: Is this chainId string or number
    const { transactionHash, chainId, blockNumber } = transferSentLog
    const timestampMs = await getTimestampFromBlockNumberMs(chainId, blockNumber)
    const {
      message,
      cctpNonce,
      chainId: destinationChainId
    } = await Message.parseHopCCTPTransferSentLog(transferSentLog)

    return {
      message,
      messageNonce: cctpNonce,
      sourceChainId: chainId,
      destinationChainId,
      sentTxHash: transactionHash,
      sentTimestampMs: timestampMs
    } as U
  }

  /**
   * State transition
   */



  async #parseEventData (state: T, data: IGetStoreDataRes): Promise<U> {
    if (MessageState.Sent === state) {
      // TODO
      const res = data as IAPIEventStoreRes
      return this.#parseApiEventData(res)
    } else if (MessageState.Attested === state) {
      const res = data as IOnchainEventStoreRes
      return this.#parseOnchainEventData(state, res)
    } else if (MessageState. Relayed === state) {
      // TODO
    }
    throw new Error('Invalid state')
  }

  async #parseOnchainEventData (state: T, log: IOnchainEventStoreRes): Promise<U> {
    const logState = this.#getLogState(log.topics[0])
    if (!logState) {
     throw new Error('Invalid log')
    }
    return this.#parseLogForState(logState, log)
  }

  #getLogState(eventSig: string): MessageState | undefined {
    if (eventSig === Message.MESSAGE_RECEIVED_EVENT_SIG) {
      return MessageState.Relayed
    }
  }

  async #parseLogForState (state: MessageState, log: LogWithChainId): Promise<U> {
    switch (state) {
      case MessageState.Relayed:
        return this.#parseRelayedLog(log)
    }
    throw new Error('Invalid state')
  }

  async #parseRelayedLog (log: LogWithChainId): Promise<U> {
    // TODO: Is this chainId string or number
    const { transactionHash, chainId, blockNumber } = log
    const timestampMs = await getTimestampFromBlockNumberMs(chainId, blockNumber)
    return {
      relayTransactionHash: transactionHash,
      relayTimestampMs: timestampMs
    } as U
  }

  #parseApiEventData (attestation: IAPIEventStoreRes): U {
    return {
      attestation
    } as U
  }
}

export async function getTimestampFromBlockNumberMs (chainId: string, blockNumber: number): Promise<number> {
  const chainSlug = getChain(chainId).slug
  const provider = getRpcProvider(chainSlug as ChainSlug)
  const block = await provider.getBlock(blockNumber)
  return block.timestamp * 1000
}
