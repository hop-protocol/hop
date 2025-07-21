import { RailsClaim } from './claim/RailsClaim.js'
import { RailsRelayer } from './RailsRelayer.js'
import { RailsIndexer } from './RailsIndexer.js'
import { ClientName } from '../constants.js'
import { getAddressesForRailsPath } from './RailsSDKWrapper.js'
import {
  type RailsPath,
  type RailsPathWithAddresses,
  type RailsPathAddresses,
  RailsClientName
} from './types.js'

export class Rails {
  readonly #name: ClientName
  readonly #clientNames: RailsClientName[]
  readonly #paths: RailsPath[]
  #started: boolean = false

  constructor (clientNames: RailsClientName[], paths: RailsPath[]) {
    this.#name = ClientName.Rails
    this.#paths = paths
    this.#clientNames = clientNames
  }

  async start (): Promise<void> {
    if (this.#started) {
      throw new Error('Already started')
    }

    const pathsWithAddresses: RailsPathWithAddresses[] = []
    for (const path of this.#paths) {
      const pathAddresses: RailsPathAddresses = await getAddressesForRailsPath(path)
      pathsWithAddresses.push({
        ...path,
        pathAddresses
      })
    }

    const indexer = new RailsIndexer(this.#name, pathsWithAddresses)
    const relayer = new RailsRelayer(this.#name, this.#paths)

    if (this.#clientNames.includes(RailsClientName.Transfer)) {
      // const transferClient = new RailsTransfer(this.#name, indexer, relayer)
      // void transferClient.start()
    }

    if (this.#clientNames.includes(RailsClientName.Claim)) {
      console.log('starting claim client')
      const claimClient = new RailsClaim(this.#name, indexer, relayer)
      void claimClient.start()
    }

    this.#started = true
  }
}
