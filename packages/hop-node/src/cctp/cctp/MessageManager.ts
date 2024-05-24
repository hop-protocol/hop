import type { ChainSlug } from '@hop-protocol/sdk'
import { MessageDataStore } from './MessageDataStore.js'
import { MessageIndexer } from './MessageIndexer.js'
import { MessageFSM } from './MessageFSM.js'


// TODO: I should be able to not need the string after, but that is what is used for db index so maybe i do?
export enum MessageState {
  Sent = 'sent',
  Relayed = 'relayed'
}

export class MessageManager {
  readonly #FSM: MessageFSM
  #started: boolean = false

  constructor (chains: ChainSlug[]) {
    // Config
    const name = 'Message'
    const states = [
      MessageState.Sent,
      MessageState.Relayed
    ]

    // Data handler
    const indexer = new MessageIndexer(states, chains)
    const dataStore = new MessageDataStore(indexer)

    // State handler
    this.#FSM = new MessageFSM(name, states, dataStore)
  }

  async start (): Promise<void> {
    if (this.#started) {
      throw new Error('Already started')
    }

    await this.#FSM.init()
    await this.#FSM.start()
  }
}
