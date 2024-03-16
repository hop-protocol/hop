import chainSlugToId from 'src/utils/chainSlugToId'
import { Chain } from 'src/constants'
import { IDataStore, IOnchainEventStoreRes } from './types'
import { type LogWithChainId } from '../../db/OnchainEventIndexerDB'
import { Message } from '../Message'
import { OnchainEventIndexer, RequiredEventFilter } from '../../indexer/OnchainEventIndexer'

export class OnchainEventStore implements IDataStore {
  readonly #indexer: OnchainEventIndexer

  constructor(chains: Chain[]) {
    for (const chain of chains) {
      const eventFilters = this.#getEventFilters(chain)
      for (const eventFilter of eventFilters) {
        this.#indexer = new OnchainEventIndexer(eventFilter, chain)
      }
    }
  }

  #getEventFilters (chain: Chain): RequiredEventFilter[] {
    const chainId = chainSlugToId(chain)
    return [
      Message.getDepositForBurnEventFilter(chainId),
      Message.getMessageReceivedEventFilter(chainId)
    ]
  }

  async getData (messageHash: string): Promise<IOnchainEventStoreRes | undefined> {
    // TODO: Remove this when the DB supports multiple indexes in favor of a single getIndexedDataByKey(messageHash) call
    const topics: string[] = [
      Message.DEPOSIT_FOR_BURN_EVENT_SIG,
      Message.MESSAGE_RECEIVED_EVENT_SIG
    ]
    const logs: LogWithChainId[] = []
    for (const topic of topics) {
      const log = await this.#indexer.getIndexedDataByKey(messageHash, topic)
      if (!log || log.length === 0) {
        continue
      }
      logs.push(...log)
    }

    return logs
  }
}
