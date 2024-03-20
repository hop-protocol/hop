import { type LogWithChainId } from 'src/cctp/db/OnchainEventIndexerDB'

export type IAPIEventStoreRes = string
export type IOnchainEventStoreRes = LogWithChainId
export type IGetStoreDataRes = IAPIEventStoreRes | IOnchainEventStoreRes


export interface ITransitionDataProvider<T, U> {
  // TODO: value U is different than the response U
  getTransitionData (state: T, key: string, value: U): Promise<U | undefined>
}

export interface IDataStore {
  getData: (key: string) => Promise<IGetStoreDataRes | undefined>
}