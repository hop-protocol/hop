import type { LogWithChainId } from '#cctp/db/OnchainEventIndexerDB.js'

export type IAPIEventStoreRes = string
export type IOnchainEventStoreRes = LogWithChainId
export type IGetStoreDataRes = IAPIEventStoreRes | IOnchainEventStoreRes


export interface ITransitionDataProvider<T, U> {
  // TODO: Other getters
  // getItems?
  // getAllItems?
  // getSyncItems?
  // TODO: value U is different than the response U
  getItem (state: T, value: U): Promise<U | undefined>
}

export interface IDataStore {
  getData: (key: string) => Promise<IGetStoreDataRes | undefined>
}