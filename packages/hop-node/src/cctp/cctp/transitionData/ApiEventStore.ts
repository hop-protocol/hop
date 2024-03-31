import { IAPIEventStoreRes, IDataStore } from './types.js'
import { Message } from '../Message.js'

export class APIEventStore implements IDataStore {
  async getData (messageHash: string): Promise<IAPIEventStoreRes | undefined> {
    return Message.fetchAttestation(messageHash)
  }
}
