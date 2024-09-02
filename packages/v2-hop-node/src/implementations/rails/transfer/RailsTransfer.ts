import { RailsTransferDataAdapter } from './DataAdapter.js'
import { RailsTransferStateMachine } from './StateMachine.js'
import { RailsTransferRelayer } from './Relayer.js'
import { RailsTransferIndexer } from './Indexer.js'
import { RailsTransferState } from './types.js'
import { RailsEventName } from '../RailsSDK.js'
import type { RailsPath } from '../types.js'

export class RailsTransfer {
  readonly #stateMachine: RailsTransferStateMachine
  readonly #relayer: RailsTransferRelayer
  #started: boolean = false

  constructor (paths: RailsPath[]) {
    const dbName = 'Rails'
    const states: RailsTransferState[] = [
      RailsTransferState.Sent,
      RailsTransferState.Bonded
    ]
    const eventNames: RailsEventName[] = [
      RailsEventName.TransferSent,
      RailsEventName.TransferBonded
    ]

    // Data handler
    const indexer = new RailsTransferIndexer(dbName, eventNames, paths)

    // State handler
    const dataAdapter = new RailsTransferDataAdapter(indexer)
    this.#stateMachine = new RailsTransferStateMachine(dbName, states, dataAdapter)

    // Relayer
    this.#relayer = new RailsTransferRelayer(dbName, this.#stateMachine)
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
