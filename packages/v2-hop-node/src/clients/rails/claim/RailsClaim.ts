import { RailsClaimDataAdapter } from './state-machine/DataAdapter.js'
import { RailsClaimStateMachine } from './state-machine/StateMachine.js'
import { RailsClaimRelayer } from './relayer/Relayer.js'
import type { RailsIndexer } from '../RailsIndexer.js'

export class RailsClaim {
  readonly #stateMachine: RailsClaimStateMachine
  #started: boolean = false

  constructor (clientName: string, indexer: RailsIndexer) {
    const dbName = `${clientName}Claim`

    // State handler
    const dataAdapter = new RailsClaimDataAdapter(indexer)
    const relayer = new RailsClaimRelayer(dbName)
    this.#stateMachine = new RailsClaimStateMachine(dbName, dataAdapter, relayer)
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
