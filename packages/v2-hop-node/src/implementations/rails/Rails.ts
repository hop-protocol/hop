import { RailsDataProvider } from './RailsDataProvider.js'
import { RailsIndexer } from './RailsIndexer.js'
import { RailsStateMachine } from './RailsStateMachine.js'
import { RailsTransferState } from './types.js'

export class Rails {
  readonly #stateMachine: RailsStateMachine
  #started: boolean = false

  constructor (chainIds: string[]) {
    const dbName = 'Rails'
    const states = [
      RailsTransferState.Sent,
      RailsTransferState.Posted,
      RailsTransferState.Bonded
    ]

    // Data handler
    const indexer = new RailsIndexer(dbName, states, chainIds)
    const dataProvider = new RailsDataProvider(indexer)

    // State handler
    this.#stateMachine = new RailsStateMachine(dbName, states, dataProvider)
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
