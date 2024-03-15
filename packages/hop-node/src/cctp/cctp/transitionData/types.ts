import { type LogWithChainId } from 'src/cctp/db/OnchainEventIndexerDB.js'

export type IAPIEventStoreRes = string
export type IOnchainEventStoreRes = LogWithChainId[]
export type IGetStoreDataRes = IAPIEventStoreRes | IOnchainEventStoreRes


export interface ITransitionDataProvider<T, U> {
  getTransitionData (state: T, key: string): Promise<U | undefined>
}

export interface IDataStore {
  getData: (key: string) => Promise<IGetStoreDataRes | undefined>
}