import { CCTPDataAdapter } from './state-machine/DataAdapter.js'
import { CCTPStateMachine } from './state-machine/StateMachine.js'
import { CCTPRelayer } from './CCTPRelayer.js'
import { CCTPIndexer } from './CCTPIndexer.js'
import { ClientName } from '../constants.js'

export class CCTP {
  readonly #stateMachine: CCTPStateMachine
  #started: boolean = false

  constructor (chainIds: string[]) {
    const name = ClientName.CCTP

    // Data handler
    const indexer = new CCTPIndexer(name, chainIds)

    // State handler
    const dataAdapter = new CCTPDataAdapter(name, indexer)
    const relayer = new CCTPRelayer(name)
    this.#stateMachine = new CCTPStateMachine(name, dataAdapter, relayer)
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
