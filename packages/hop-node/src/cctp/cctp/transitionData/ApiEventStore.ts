import { IAPIEventStoreRes, IDataStore } from './types'
import { Message } from '../Message'

export class APIEventStore implements IDataStore {
  async getData (messageHash: string): Promise<IAPIEventStoreRes | undefined> {
    return Message.fetchAttestation(messageHash)
  }
}
