import { CCTPDataProvider } from './CCTPDataProvider.js'
import { CCTPIndexer } from './CCTPIndexer.js'
import { CCTPStateMachine } from './CCTPStateMachine.js'
import { CCTPMessageState } from './types.js'

export class CCTP {
  readonly #stateMachine: CCTPStateMachine
  #started: boolean = false

  constructor (chainIds: string[]) {
    const dbName = 'cctp'
    const states = [
      CCTPMessageState.Sent,
      CCTPMessageState.Relayed
    ]

    // Data handler
    const indexer = new CCTPIndexer(dbName, states, chainIds)
    const dataProvider = new CCTPDataProvider(indexer)

    // State handler
    this.#stateMachine = new CCTPStateMachine(dbName, states, dataProvider)
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
