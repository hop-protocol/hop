import { MessageDataProvider } from './MessageDataProvider.js'
import { MessageIndexer } from './MessageIndexer.js'
import { MessageStateMachine } from './MessageStateMachine.js'
import { MessageState } from './types.js'


export class Message {
  readonly #stateMachine: MessageStateMachine
  #started: boolean = false

  constructor (chainIds: string[]) {
    const dbName = 'Message'
    const states = [
      MessageState.Sent,
      MessageState.Relayed
    ]

    // Data handler
    const indexer = new MessageIndexer(dbName, states, chainIds)
    const dataProvider = new MessageDataProvider(indexer)

    // State handler
    this.#stateMachine = new MessageStateMachine(dbName, states, dataProvider)
  }

  async start (): Promise<void> {
    if (this.#started) {
      throw new Error('Already started')
    }

    await this.#stateMachine.init()
    this.#stateMachine.start()
    this.#started = true
  }
}
