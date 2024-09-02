import { RailsDataAdapter } from './RailsDataAdapter.js'
import { RailsIndexer } from './RailsIndexer.js'
import { RailsStateMachine } from './RailsStateMachine.js'
import { RailsRelayer } from './RailsRelayer.js'
import { type RailsPath, RailsState } from './types.js'
import { RailsEventName } from './RailsSDK.js'

export class Rails {
  readonly #stateMachine: RailsStateMachine
  readonly #relayer: RailsRelayer
  #started: boolean = false

  constructor (paths: RailsPath[]) {
    const dbName = 'Rails'
    const states: RailsState[] = [
      RailsState.Sent,
      RailsState.Bonded
    ]
    const eventNames: RailsEventName[] = [
      RailsEventName.TransferSent,
      RailsEventName.TransferBonded
    ]

    // Data handler
    const indexer = new RailsIndexer(dbName, eventNames, paths)

    // State handler
    const dataAdapter = new RailsDataAdapter(indexer)
    this.#stateMachine = new RailsStateMachine(dbName, states, dataAdapter)

    // Relayer
    this.#relayer = new RailsRelayer(dbName, this.#stateMachine)
  }

  async start (): Promise<void> {
    if (this.#started) {
      throw new Error('Already started')
    }

    await this.#stateMachine.init()
    this.#stateMachine.start()
    this.#relayer.start()
    this.#started = true
  }
}
