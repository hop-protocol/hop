import { RailsTransfer } from './transfer/RailsTransfer.js'
import { RailsClaim } from './claim/RailsClaim.js'
import { RailsRelayer } from './RailsRelayer.js'
import { RailsIndexer } from './RailsIndexer.js'
import { ClientName } from '../constants.js'
import { type RailsPath, RailsClientName } from './types.js'

export class Rails {
  readonly #transferClient: RailsTransfer | undefined
  readonly #claimClient: RailsClaim | undefined
  #started: boolean = false

  constructor (clientNames: RailsClientName[], paths: RailsPath[]) {
    const name = ClientName.Rails

    // Data handler
    const indexer = new RailsIndexer(name, paths)
    const relayer = new RailsRelayer(name, paths)

    if (clientNames.includes(RailsClientName.Transfer)) {
      this.#transferClient = new RailsTransfer(name, indexer, relayer)
    }

    if (clientNames.includes(RailsClientName.Claim)) {
      this.#claimClient = new RailsClaim(name, indexer, relayer)
    }
  }

  async start (): Promise<void> {
    if (this.#started) {
      throw new Error('Already started')
    }

    if (this.#transferClient) {
      await this.#transferClient.start()
    }

    if (this.#claimClient) {
      await this.#claimClient.start()
    }

    this.#started = true
  }
}
