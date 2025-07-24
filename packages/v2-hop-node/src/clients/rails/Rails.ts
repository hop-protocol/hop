import { RailsClaim } from './claim/RailsClaim.js'
import { RailsRelayer } from './RailsRelayer.js'
import { RailsIndexer } from './RailsIndexer.js'
import { ClientName } from '../constants.js'
import { RailsGateway, getAddressesForRailsPath, getPathId } from './RailsSDKWrapper.js'
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

    if (this.#paths.length === 0) {
      throw new Error('No paths provided')
    }

    const pathsWithAddresses: RailsPathWithAddresses[] = []
    for (const path of this.#paths) {
      const pathAddresses: RailsPathAddresses = await getAddressesForRailsPath(path)
      pathsWithAddresses.push({
        ...path,
        pathAddresses
      })
    }

    // TODO: V2: This should be handled by the system, not in the SDK
    for (const pathWithAddresses of pathsWithAddresses) {
      const pathId = getPathId(pathWithAddresses)

      const { chainId, counterpartChainId, pathAddresses } = pathWithAddresses
      RailsGateway.setPathIdAddressCache(chainId, pathAddresses.pathAddress, pathId)
      RailsGateway.setPathIdAddressCache(counterpartChainId, pathAddresses.counterpartPathAddress, pathId)
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
