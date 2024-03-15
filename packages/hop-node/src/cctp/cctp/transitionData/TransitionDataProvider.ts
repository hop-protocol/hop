import chainIdToSlug from 'src/utils/chainIdToSlug.js'
import { APIEventStore } from './ApiEventStore.js'
import { Chain } from 'src/constants'
import { IAPIEventStoreRes, IDataStore, IGetStoreDataRes, IOnchainEventStoreRes, ITransitionDataProvider } from './types.js'
import { IMessage, MessageState } from '../MessageManager.js'
import { type LogWithChainId } from 'src/cctp/db/OnchainEventIndexerDB.js'
import { Message } from '../Message.js'
import { OnchainEventStore } from './OnchainEventStore.js'
import { getRpcProvider } from 'src/utils/getRpcProvider.js'

export class TransitionDataProvider<T extends MessageState, U extends IMessage> implements ITransitionDataProvider<T, U> {
  readonly #stores: Record<T, IDataStore>

  constructor (
    chains: Chain[]
  ) {
    const onchainEventSourceIndexer = new OnchainEventStore(chains)
    const apiFetchEventSourceIndexer = new APIEventStore()

    this.#stores = {
      [MessageState.Deposited]: onchainEventSourceIndexer,
      [MessageState.Attested]: apiFetchEventSourceIndexer,
      [MessageState.Relayed]: onchainEventSourceIndexer
    } as Record<T, IDataStore>
  }

  async getTransitionData(state: T, messageHash: string): Promise<U | undefined> {
    const eventData: IGetStoreDataRes | undefined = await this.#stores[state].getData(messageHash)
    if (!eventData) return

    const parsedData = await this.#parseEventData(state, eventData)
    return parsedData
  }

  async #parseEventData (state: T, data: IGetStoreDataRes): Promise<U> {
    if (
      MessageState.Deposited === state ||
      MessageState. Relayed === state
    ) {
      const res = data as IOnchainEventStoreRes
      return this.#parseOnchainEventData(state, res)
    } else if (MessageState.Attested === state) {
      const res = data as IAPIEventStoreRes
      return this.#parseApiEventData(res)
    }
    throw new Error('Invalid state')
  }

  async #parseOnchainEventData (state: T, logs: IOnchainEventStoreRes): Promise<U> {
    if (logs.length === 0) {
      throw new Error('No logs found')
    }

    for (const log of logs) {
      const logState = this.#getLogState(log.topics[0])
      if (logState !== state) continue

      await this.#parseLogForState(logState, log)
    }

    throw new Error(`No logs found for state: ${state}`)
  }

  #getLogState(eventSig: string): MessageState | undefined {
    if (eventSig === Message.DEPOSIT_FOR_BURN_EVENT_SIG) {
      return MessageState.Deposited
    } else if (eventSig === Message.MESSAGE_RECEIVED_EVENT_SIG) {
      return MessageState.Relayed
    }
  }

  async #parseLogForState (state: MessageState, log: LogWithChainId): Promise<U> {
    switch (state) {
      case MessageState.Deposited:
        return this.#parseDepositedLog(log)
      case MessageState.Relayed:
        return this.#parseRelayedLog(log)
    }
    throw new Error('Invalid state')
  }

  async #parseDepositedLog (log: LogWithChainId): Promise<U> {
    const { data, transactionHash, chainId, blockNumber } = log
    const message = await this.#getMessageFromLog(log)
    const destinationChainId = this.#getDestinationChainIdFromLogData(data)
    const timestampMs = await this.#getLogTimestampMs(chainId, blockNumber)
    return {
      message,
      destinationChainId,
      depositedTxHash: transactionHash,
      depositedTimestampMs: timestampMs
    } as U
  }

  async #parseRelayedLog (log: LogWithChainId): Promise<U> {
    const { transactionHash, chainId, blockNumber } = log
    const timestampMs = await this.#getLogTimestampMs(chainId, blockNumber)
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
    
  async #getLogTimestampMs (chainId: number, blockNumber: number): Promise<number> {
    const chain = chainIdToSlug(chainId)
    const provider = getRpcProvider(chain)
    const block = await provider.getBlock(blockNumber)
    return block.timestamp * 1000
  }

  async #getMessageFromLog (log: LogWithChainId): Promise<string> {
    const { chainId, data, topics } = log
    const { mintRecipient, amount } = Message.decodeDepositForBurnEvent(data)
    const burnToken = topics[2]

    const messageVersion = await this.#getMessageVersionFromOnchain(chainId)
    return Message.getMessageFromDepositEvent (
      messageVersion,
      burnToken,
      mintRecipient,
      amount
    )
  }

  async #getMessageVersionFromOnchain(chainId: number): Promise<number> {
    return Message.getMessageBodyVersion(chainId)
  }

  #getDestinationChainIdFromLogData (data: string): number {
    const { destinationDomain } = Message.decodeDepositForBurnEvent(data)
    return Number(Message.convertDomainToChainId(destinationDomain))
  }
}
