import { RailsTransferDataAdapter } from './state-machine/DataAdapter.js'
import { RailsTransferStateMachine } from './state-machine/StateMachine.js'
import type { RailsRelayer } from '../RailsRelayer.js'
import type { RailsIndexer } from '../RailsIndexer.js'

export class RailsTransfer {
  readonly #stateMachine: RailsTransferStateMachine
  #started: boolean = false

  constructor (clientName: string, indexer: RailsIndexer, relayer: RailsRelayer) {
    const name = `${clientName}Transfer`

    // State handler
    const dataAdapter = new RailsTransferDataAdapter(name, indexer)
    this.#stateMachine = new RailsTransferStateMachine(name, dataAdapter, relayer)
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
