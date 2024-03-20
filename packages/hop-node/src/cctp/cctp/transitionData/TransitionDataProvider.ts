import chainIdToSlug from 'src/utils/chainIdToSlug'
import { APIEventStore } from './ApiEventStore'
import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import { IAPIEventStoreRes, IDataStore, IGetStoreDataRes, IOnchainEventStoreRes, ITransitionDataProvider } from './types'
import { IMessage, MessageState } from '../MessageManager'
import { type LogWithChainId } from 'src/cctp/db/OnchainEventIndexerDB'
import { Message } from '../Message'
import { OnchainEventStore } from './OnchainEventStore'
import { RequiredFilter } from '../../indexer/OnchainEventIndexer'
import { getRpcProvider } from 'src/utils/getRpcProvider'
import { getTimestampFromBlockNumberMs } from './utils'

export class TransitionDataProvider<T extends MessageState, U extends IMessage> implements ITransitionDataProvider<T, U> {
  readonly #stores: Record<T, IDataStore>

  constructor (chains: Chain[]) {
    const onchainEventSourceIndexer = new OnchainEventStore(chains)
    const apiFetchEventSourceIndexer = new APIEventStore()

    // TODO: Initial state should not be here
    this.#stores = {
      [MessageState.Sent]: onchainEventSourceIndexer,
      [MessageState.Attested]: apiFetchEventSourceIndexer,
      [MessageState.Relayed]: onchainEventSourceIndexer
    } as Record<T, IDataStore>
  }

  // TODO: Value and resp are different U
  async getTransitionData(state: T, value: U): Promise<U | undefined> {
    // TODO: Initial state cannot be here but should be more explicit about it not being a store

    // TODO: Fix this
    const key = this.#getKeyForGetter(state, value)

    // TODO: Assert initial state cannot be here
    const eventData: IGetStoreDataRes | undefined = await this.#stores[state].getData(key)
    if (!eventData) return

    return this.#parseEventData(state, eventData)
  }

  #getKeyForGetter = (state: T, value: U): string => {
    // TODO: Not any
    const res: any = value
    if (MessageState.Attested === state) {
      return Message.getMessageHashFromMessage(res.message)
    } else if (MessageState.Relayed === state) {
      return res.messageNonce
    }
    throw new Error('Invalid state')
  }

  async #parseEventData (state: T, data: IGetStoreDataRes): Promise<U> {
    if (MessageState. Relayed === state) {
      const res = data as IOnchainEventStoreRes
      return this.#parseOnchainEventData(state, res)
    } else if (MessageState.Attested === state) {
      const res = data as IAPIEventStoreRes
      return this.#parseApiEventData(res)
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

  /**
   * Creation
   */

  // TODO: Clean this up or get rid of it
  async *getCreationData(): AsyncIterable<U> {
    const store: any = this.#stores[MessageState.Sent as T]
    for await (const log of store.getAllLogsForTopic(Message.HOP_CCTP_TRANSFER_SENT_SIG)) {
      const parsedLog = await this.#parseCreationLogs(log)
      yield parsedLog
    }
  }

  async #parseCreationLogs (log: LogWithChainId): Promise<U> {
    const { transactionHash, chainId, blockNumber, topics } = log
    const messageNonce = Number(BigNumber.from(topics[1]))
    const destinationChainIdBN = BigNumber.from(topics[2])
    const timestampMs = await getTimestampFromBlockNumberMs(chainId, blockNumber)
    const message = await this.#getMessageFromHopCCTPTransferLog(log, messageNonce)

    return {
      message,
      messageNonce,
      sourceChainId: chainId,
      destinationChainId: destinationChainIdBN.toNumber(),
      sentTxHash: transactionHash,
      sentTimestampMs: timestampMs
    } as U
  }

  // TODO: Move this to Message
  // TODO: Do the same with CLI command
  async #getMessageFromHopCCTPTransferLog (log: LogWithChainId, nonce: number): Promise<string> {
    const { chainId, blockNumber } = log

    const chain = chainIdToSlug(chainId)
    const provider = getRpcProvider(chain)
    const eventFilter = Message.getMessageSentEventFilter(chainId)
    const filter: RequiredFilter = {
      ...eventFilter,
      fromBlock: blockNumber,
      toBlock: blockNumber
    }
    const onchainLogs = await provider.getLogs(filter)
    if (onchainLogs.length === 0) {
      throw new Error('No logs found')
    }

    // If there are multiple transfers in a block, find the correct one
    // TODO: This will not work for multiple transfers in the same tx. Handle that case if it comes up.
    for (const onchainLog of onchainLogs) {
      if (onchainLog.transactionHash === log.transactionHash) {
        return Message.decodeMessageFromEvent(log.data)
      }
    }

    throw new Error(`No message found in logs for nonce ${nonce} on chain ${chainId}`)
  }
}
