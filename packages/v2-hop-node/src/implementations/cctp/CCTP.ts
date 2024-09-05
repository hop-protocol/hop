import { CCTPDataAdapter } from './state-machine/DataAdapter.js'
import { CCTPStateMachine } from './state-machine/StateMachine.js'
import { CCTPRelayer } from './relayer/Relayer.js'
import { CCTPIndexer } from './indexer/Indexer.js'

export class CCTP {
  readonly #stateMachine: CCTPStateMachine
  #started: boolean = false

  constructor (chainIds: string[]) {
    const dbName = 'cctp'

    // Data handler
    const indexer = new CCTPIndexer(dbName, chainIds)

    // State handler
    const dataAdapter = new CCTPDataAdapter(indexer)
    const relayer = new CCTPRelayer(dbName)
    this.#stateMachine = new CCTPStateMachine(dbName, dataAdapter, relayer)
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
