import { RailsClaimDataAdapter } from './state-machine/DataAdapter.js'
import { RailsClaimStateMachine } from './state-machine/StateMachine.js'
import type { RailsIndexer } from '../RailsIndexer.js'
import type { RailsRelayer } from '../RailsRelayer.js'

export class RailsClaim {
  readonly #stateMachine: RailsClaimStateMachine
  #started: boolean = false

  constructor (clientName: string, indexer: RailsIndexer, relayer: RailsRelayer) {
    const name = `${clientName}Claim`

    // State handler
    const dataAdapter = new RailsClaimDataAdapter(name, indexer)
    this.#stateMachine = new RailsClaimStateMachine(name, dataAdapter, relayer)
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
