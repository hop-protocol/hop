import { EventEmitter } from 'node:events'
import { IGetStoreDataRes, IOnchainEventStoreRes } from './types.js'
import type { LogWithChainId } from '../types.js'
import { MessageSDK } from './MessageSDK.js'
import { ChainSlug, getChain } from '@hop-protocol/sdk'
import { MessageIndexer } from './MessageIndexer.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { DataStore } from '../data-store/DataStore.js'
import { MessageState } from './types.js'
import type { IMessage } from './types.js'
import { DATA_INDEXED_EVENT } from '../indexer/constants.js'

// Since the messages are unique by chainId, his MessageDataStore should be the
// class that abstracts this away.

// TODO: This seems like the only implementation that doesn't have an abstract
// class. Is that reasonable?

/**
 * This class is responsible for providing formatted data to the
 * consumer.
 * 
 * It formats log data into a format that is desired by the consumer
 * of the data store.
 * 
 * This class also emits an event upon receipt of 
 */

export class MessageDataStore extends DataStore<MessageState, IMessage> {
  readonly #indexer: MessageIndexer
  readonly #eventEmitter: EventEmitter = new EventEmitter()

  constructor (indexer: MessageIndexer) {
    super()
    this.#indexer = indexer
  }

  start(): void {
    this.#startListeners()
    this.#indexer.start()
  }

  // TODO: I'm starting to think this `value` doesn't need to encompass all the data
  //////////// it does as long as i need the chain id
  ///////////////////// but then that means every single step needs a chainId. is that ok? if so, add to nots for our v2 contract emissiosn

  // TODO: Value and resp are different IMessage
  async getItem(state: MessageState, value: IMessage): Promise<IMessage> {
    const eventLog: LogWithChainId = await this.#indexer.getData(state, value)
    return this.#formatEventLog(state, eventLog)
  }

  /**
   * Event handler
   */

  #startListeners = (): void => {
    this.#indexer.on(DATA_INDEXED_EVENT, this.#handleDataIndexedEvent)
  }

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  #handleDataIndexedEvent = async (log: LogWithChainId): Promise<void> => {
    const state: MessageState = this.#getStateFromLog(log)
    const formattedEventLog = await this.#formatEventLog(state, log)
    this.#eventEmitter.emit(state, formattedEventLog)
  }

  /**
   * Formatting
   */

  async #formatEventLog(state: MessageState, log: LogWithChainId): Promise<IMessage> {
    switch (state) {
      case MessageState.Sent:
        return this.#formatTransferSentLog(log)
      case MessageState.Relayed:
        return this.#formatRelayedLog(log)
      default:
        throw new Error('Invalid state')
    }
  }

  async #formatTransferSentLog (log: LogWithChainId): Promise<IMessage> {
    const { transactionHash, chainId, blockNumber /*, parsedData */ } = log
    // TODO: fix
    const parsedData: any = {}
    const { message, cctpNonce, chainId: destinationChainId } = parsedData
    const timestampMs = await this.#getBlockTimestampFromLogMs(log)

    return {
      message,
      messageNonce: cctpNonce,
      sourceChainId: chainId,
      destinationChainId,
      sentTxHash: transactionHash,
      sentTimestampMs: timestampMs
    } as IMessage
  }

  async #formatRelayedLog (log: LogWithChainId): Promise<IMessage> {
    const { transactionHash } = log
    // TODO: Is this the right chainId? Src vs dest?
    const timestampMs = await this.#getBlockTimestampFromLogMs(log)
    return {
      relayTransactionHash: transactionHash,
      relayTimestampMs: timestampMs
    } as IMessage
  }

  /**
   * Utils
   */

  async #getBlockTimestampFromLogMs (log: LogWithChainId): Promise<number> {
    const { chainId, blockNumber } = log
    const chainSlug = getChain(chainId).slug
    const provider = getRpcProvider(chainSlug as ChainSlug)
    const block = await provider.getBlock(blockNumber)
    return block.timestamp * 1000
  }

  #getStateFromLog (log: LogWithChainId): MessageState {
    const eventSig = log.topics[0]
    switch (eventSig) {
      case (MessageSDK.HOP_CCTP_TRANSFER_SENT_SIG):
       return MessageState.TransferSent
      case (MessageSDK.MESSAGE_RECEIVED_EVENT_SIG):
        return MessageState.Relayed
      default:
        throw new Error('Invalid log')
    }
  }
}
