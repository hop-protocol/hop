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

// Since the messages are unique by chainId, his MessageDataStore should be the
// class that abstracts this away.

// TODO: This seems like the only implementation that doesn't have an abstract
// class. Is that reasonable?

export class MessageDataStore extends DataStore<MessageState, IMessage> {
  readonly #indexer: MessageIndexer
  readonly #eventEmitter: EventEmitter = new EventEmitter()

  constructor (indexer: MessageIndexer) {
    super()

    this.#indexer = indexer
    this.#indexer.on(DataStore.ITEM_CREATED, this.#handleInitialEvent)
  }

  start(): void {
    this.#indexer.start()
  }

  // TODO: I'm starting to think this `value` doesn't need to encompass all the data
  //////////// it does as long as i need the chain id
  ///////////////////// but then that means every single step needs a chainId. is that ok? if so, add to nots for our v2 contract emissiosn

  // TODO: Value and resp are different IMessage
  async getItem(state: MessageState, value: IMessage): Promise<IMessage> {
    const eventData: LogWithChainId = await this.#indexer.getData(state, value)
    return this.#parseEventData(state, eventData)
  }

  /**
   * Event handler
   */

  on (event: string, listener: (...args: any[]) => void): void {
    this.#eventEmitter.on(event, listener)
  }

  #handleInitialEvent (log: LogWithChainId): void {
    const parsedLog = this.#parseInitializationLog(log)
    this.#eventEmitter.emit(DataStore.ITEM_CREATED, parsedLog)
  }

  /**
   * Parsing
   */

  async #parseInitializationLog (transferSentLog: LogWithChainId): Promise<IMessage> {
    // TODO: Is this chainId string or number
    const { transactionHash, chainId, blockNumber } = transferSentLog
    const timestampMs = await this.#getTimestampFromBlockNumberMs(chainId, blockNumber)
    const {
      message,
      cctpNonce,
      chainId: destinationChainId
    } = await MessageSDK.parseHopCCTPTransferSentLog(transferSentLog)

    return {
      message,
      messageNonce: cctpNonce,
      sourceChainId: chainId,
      destinationChainId,
      sentTxHash: transactionHash,
      sentTimestampMs: timestampMs
    } as IMessage
  }

  async #parseEventData (state: MessageState, data: IGetStoreDataRes): Promise<IMessage> {
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

  async #parseOnchainEventData (state: MessageState, log: IOnchainEventStoreRes): Promise<IMessage> {
    const logState = this.#getLogState(log.topics[0])
    if (!logState) {
     throw new Error('Invalid log')
    }
    return this.#parseLogForState(logState, log)
  }

  #getLogState(eventSig: string): MessageState | undefined {
    if (eventSig === MessageSDK.MESSAGE_RECEIVED_EVENT_SIG) {
      return MessageState.Relayed
    }
  }

  async #parseLogForState (state: MessageState, log: LogWithChainId): Promise<IMessage> {
    switch (state) {
      case MessageState.Relayed:
        return this.#parseRelayedLog(log)
    }
    throw new Error('Invalid state')
  }

  async #parseRelayedLog (log: LogWithChainId): Promise<IMessage> {
    // TODO: Is this chainId string or number
    const { transactionHash, chainId, blockNumber } = log
    const timestampMs = await this.#getTimestampFromBlockNumberMs(chainId, blockNumber)
    return {
      relayTransactionHash: transactionHash,
      relayTimestampMs: timestampMs
    } as IMessage
  }

  #parseApiEventData (attestation: IAPIEventStoreRes): IMessage {
    return {
      attestation
    } as IMessage
  }

  /**
   * Utils
   */

  async #getTimestampFromBlockNumberMs (chainId: string, blockNumber: number): Promise<number> {
    const chainSlug = getChain(chainId).slug
    const provider = getRpcProvider(chainSlug as ChainSlug)
    const block = await provider.getBlock(blockNumber)
    return block.timestamp * 1000
  }
}
