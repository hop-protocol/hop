import { APIEventStore } from './ApiEventStore.js'
import type { Chain } from '@hop-protocol/hop-node-core/constants'
import { EventEmitter } from 'node:events'
import type {
  IAPIEventStoreRes,
  IDataStore,
  IGetStoreDataRes,
  IOnchainEventStoreRes,
  ITransitionDataProvider
} from './types.js'
import type { LogWithChainId } from '#cctp/db/OnchainEventIndexerDB.js'
import { MessageState } from '../MessageManager.js'
import { Message } from '../Message.js'
import { OnchainEventStore } from './OnchainEventStore.js'
import { getTimestampFromBlockNumberMs } from './utils.js'

export enum Event {
  Initialization = 'initialization'
}

export class TransitionDataProvider<T, U> extends EventEmitter implements ITransitionDataProvider<T, U> {
  readonly #transitionStores: Record<T, IDataStore>
  readonly #eventEmitter: EventEmitter = new EventEmitter()

  constructor (chains: Chain[]) {
    super()
    const onchainEventSourceIndexer = new OnchainEventStore(chains)
    const apiFetchEventSourceIndexer = new APIEventStore()

    this.#transitionStores = {
      // [this.#initializationState]: onchainEventSourceIndexer,
      [MessageState.Sent]: onchainEventSourceIndexer,
      [MessageState.Attested]: apiFetchEventSourceIndexer,
      [MessageState.Relayed]: onchainEventSourceIndexer
    } as Record<T, IDataStore>

    this.#init()
  }

  /////////////// Event

  #init (): void {
    this.#eventEmitter.on('write', (items: any) => this.#eventEmitter.emit('lolg', items))
  }

  async *getSyncItems (syncMarker: string): AsyncIterable<[string, U]> {
    // TODO: State var
    const initializationEvent = Message.HOP_CCTP_TRANSFER_SENT_SIG
    // TODO: Not arbitrary
    const oneDayMs = 86_400_000
    const end = Date.now()
    const start = end - oneDayMs
    const filter = {
      gte: `${initializationEvent}!${start}`,
      lt: `${initializationEvent}!${end}~`
    }
    // TODO: Limit in filter? or does generator handle that
    const store: any = this.#transitionStores[initialState]
    const initialEventSig = Message.HOP_CCTP_TRANSFER_SENT_SIG
    for await (const log of store.getAllLogsForTopic(initialEventSig)) {
      const parsedLog: any = await this.#parseInitializationLog(log)
      const key = Message.getMessageHashFromMessage(parsedLog.message)
      // TODO: 
      yield [key, parsedLog]
    }
  }

  async *getAllItems (): AsyncIterable<[string, U]> {
    // TODO: Limit in filter? or does generator handle that
    const store: any = this.#transitionStores[initialState]
    const initialEventSig = Message.HOP_CCTP_TRANSFER_SENT_SIG
    for await (const log of store.getAllLogsForTopic(initialEventSig)) {
      const parsedLog: any = await this.#parseInitializationLog(log)
      const key = Message.getMessageHashFromMessage(parsedLog.message)
      // TODO: 
      yield [key, parsedLog]
    }
  }


  /////////////////////////////////////
  /**
   * Public Interface
   */

  async *getUninitializedItems(): AsyncIterable<U> {
    // TODO: Should know the initial state
    const store: any = this.#transitionStores[initialState]
    const initialEventSig = Message.HOP_CCTP_TRANSFER_SENT_SIG

    for await (const log of store.getAllLogsForTopic(initialEventSig)) {
      yield await this.#parseInitializationLog(log)
    }
  }

  // TODO: Value and resp are different U
  async getItem(state: T, value: U): Promise<U | undefined> {
    const transitionKey = this.#getTransitionDataKey(state, value)
    const eventData: IGetStoreDataRes | undefined = await this.#transitionStores[state].getData(transitionKey)
    if (!eventData) return

    return this.#parseEventData(state, eventData)
  }

  /**
   * Initialization
   */

  async #parseInitializationLog (transferSentLog: LogWithChainId): Promise<U> {
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

  #getTransitionDataKey (state: T, value: U): string {
    if (MessageState.Sent === state) {
      throw new Error('No transition data key for initial state')
    } else if (MessageState.Attested === state) {
      return Message.getMessageHashFromMessage(value.message)
    } else if (MessageState.Relayed === state) {
      return key
    }
    throw new Error('Invalid state')
  }


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
