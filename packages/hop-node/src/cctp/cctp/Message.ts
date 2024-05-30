import type { ChainSlug } from '@hop-protocol/sdk'
import { MessageDataStore } from './MessageDataStore.js'
import { MessageIndexer } from './MessageIndexer.js'
import { MessageFSM } from './MessageFSM.js'

// TODO: I should be able to not need the string after, but that is what is used for db index so maybe i do?
export enum MessageState {
  Sent = 'sent',
  Relayed = 'relayed'
}

export class Message {
  readonly #FSM: MessageFSM
  #started: boolean = false

  constructor (chains: ChainSlug[]) {
    const dbName = 'Message'
    const states = [
      MessageState.Sent,
      MessageState.Relayed
    ]

    // Data handler
    const indexer = new MessageIndexer(dbName, states, chains)
    const dataStore = new MessageDataStore(indexer)

    // State handler
    this.#FSM = new MessageFSM(dbName, states, dataStore)
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
