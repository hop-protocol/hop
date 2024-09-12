import { RailsTransfer } from './transfer/RailsTransfer.js'
import { RailsClaim } from './claim/RailsClaim.js'
import { RailsIndexer } from './RailsIndexer.js'
import { type RailsPath, RailsClientName } from './types.js'

export class Rails {
  readonly #transferClient: RailsTransfer | undefined
  readonly #claimClient: RailsClaim | undefined
  #started: boolean = false

  constructor (clientNames: RailsClientName[], paths: RailsPath[]) {
    const name = 'rails'

    // Data handler
    const indexer = new RailsIndexer(name, paths)

    if (clientNames.includes(RailsClientName.Transfer)) {
      this.#transferClient = new RailsTransfer(name, indexer)
    }

    if (clientNames.includes(RailsClientName.Claim)) {
      this.#claimClient = new RailsClaim(name, indexer)
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
