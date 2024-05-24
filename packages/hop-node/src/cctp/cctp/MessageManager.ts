import type { ChainSlug } from '@hop-protocol/sdk'
import { MessageDataStore } from './MessageDataStore.js'
import { MessageIndexer } from './MessageIndexer.js'
import { MessageFSM } from './MessageFSM.js'
import { DB } from '../db/DB.js'

// TODO: Not this
class BaseDb extends DB<string, string> {}

// TODO: I should be able to not need the string after, but that is what is used for db index so maybe i do?
export enum MessageState {
  Sent = 'sent',
  Relayed = 'relayed'
}

export class MessageManager {
  readonly #FSM: MessageFSM
  #started: boolean = false

  constructor (chains: ChainSlug[]) {
    const name = 'Message'
    const db = new BaseDb(name)

    const states = [
      MessageState.Sent,
      MessageState.Relayed
    ]

    // Data handler
    const indexer = new MessageIndexer(db, states, chains)
    const dataStore = new MessageDataStore(indexer)

    // State handler
    this.#FSM = new MessageFSM(db, states, dataStore)
  }

  async start (): Promise<void> {
    if (this.#started) {
      throw new Error('Already started')
    }

    await this.#FSM.init()
    this.#FSM.start()
    this.#started = true
  }
}
