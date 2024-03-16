import { type LogWithChainId } from 'src/cctp/db/OnchainEventIndexerDB'

export interface IGetIndexedDataByKey {
  getIndexedDataByKey(key: string, topic: string): Promise<LogWithChainId[] | undefined>
}
