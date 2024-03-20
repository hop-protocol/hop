import chainSlugToId from 'src/utils/chainSlugToId'
import { Chain } from 'src/constants'
import { IDataStore, IOnchainEventStoreRes } from './types'
import { type LogWithChainId, OnchainEventIndexerDB } from '../../db/OnchainEventIndexerDB'
import { Message } from '../Message'
import { OnchainEventIndexer, RequiredEventFilter } from '../../indexer/OnchainEventIndexer'

export class OnchainEventStore implements IDataStore {
  readonly #indexer: OnchainEventIndexer

  constructor(chains: Chain[]) {
    // TODO: Not sure if DB init makes sense at this level. However, one level
    // lower and we would have to pass in unique db names for each indexer
    const db = new OnchainEventIndexerDB('OnchainEventStore')
    for (const chain of chains) {
      const eventFilters = this.#getEventFilters(chain)
      for (const eventFilter of eventFilters) {
        this.#indexer = new OnchainEventIndexer(db, eventFilter, chain)
      }
    }
  }

  #getEventFilters (chain: Chain): RequiredEventFilter[] {
    const chainId = chainSlugToId(chain)
    return [
      Message.getCCTPTransferSentEventFilter(chainId),
      Message.getMessageReceivedEventFilter(chainId)
    ]
  }

  async getData (key: string): Promise<IOnchainEventStoreRes | undefined> {
    // TODO: Not hard-coded topic
    const topic: string = Message.MESSAGE_RECEIVED_EVENT_SIG
    return this.#indexer.getIndexedDataBySecondIndex(topic, key)
  }

  async *getAllLogsForTopic (topic: string): AsyncIterable<LogWithChainId> {
    yield *this.#indexer.getAllLogsForTopic(topic)
  }
}
