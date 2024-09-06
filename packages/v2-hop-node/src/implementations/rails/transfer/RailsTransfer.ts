import { RailsTransferDataAdapter } from './state-machine/DataAdapter.js'
import { RailsTransferStateMachine } from './state-machine/StateMachine.js'
import { RailsTransferRelayer } from './relayer/Relayer.js'
import type { RailsIndexer } from '../RailsIndexer.js'

export class RailsTransfer {
  readonly #stateMachine: RailsTransferStateMachine
  #started: boolean = false

  constructor (clientName: string, indexer: RailsIndexer) {
    const dbName = `${clientName}Transfer`

    // State handler
    const dataAdapter = new RailsTransferDataAdapter(indexer)
    const relayer = new RailsTransferRelayer(dbName)
    this.#stateMachine = new RailsTransferStateMachine(dbName, dataAdapter, relayer)
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
