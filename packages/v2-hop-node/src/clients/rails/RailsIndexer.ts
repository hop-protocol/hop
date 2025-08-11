import { OnchainEventIndexer } from '#indexer/index.js'
import { getRailsStartBlockNumber } from './utils.js'
import type { RailsPathWithAddresses } from './types.js'
import type { providers } from 'ethers'
import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'
import type { ClientName } from '../constants.js'

type RailsEventIndexes = (keyof NonNullable<RailsFilterInputs>)[]

export class RailsIndexer extends OnchainEventIndexer<RailsEventName, RailsEventIndexes> {

  constructor(name: ClientName, pathsWithAddresses: RailsPathWithAddresses[]) {
    super(name)

    this.#addEventFilters(pathsWithAddresses)
  }

  /**
   * Implementation
   */

  protected override getDesiredEventIndexes (eventName: RailsEventName): RailsEventIndexes {
    if (eventName === RailsEventName.TransferSent) {
      return ['transferId']
    }

    return ['claimId']
  }

  protected override getStartBlockNumber (chainId: string): number {
    return getRailsStartBlockNumber(chainId)
  }

  protected override getDecodedLogWithContext(log: providers.Log, chainId: string): DecodedLogWithContext {
    const decodedEvent = addDecodedTypesToEvent(log, chainId)
    const eventName = decodedEvent.context.eventName
    return {
      ...decodedEvent,
      context: {
        eventName,
        chainId
      }
    }
  }

  // Internal

  #addEventFilters(paths: RailsPathWithAddresses[]): void {
    const eventNames = Object.values(RailsEventName)

    // Check for duplicate pathIds
    const pathIds = new Set<string>()
    for (const path of paths) {
      const pathId = getPathId(path)
      if (pathIds.has(pathId)) {
        throw new Error(`Duplicate pathId found: ${pathId}`)
      }
      pathIds.add(pathId)
    }

    // All events are indexed by pathId so there is no need to filter them
    for (const path of paths) {
      const chainId = path.chainId
      const counterpartChainId = path.counterpartChainId

      for (const eventName of eventNames) {
        const railsEventFilter = getRailsEventFilter(eventName, chainId, path.pathAddresses.pathAddress) as RequiredEventFilter
        console.log('Adding event filter', eventName, chainId, path.pathAddresses.pathAddress, railsEventFilter)
        this.addEventFilterToIndexer(eventName, chainId, railsEventFilter)

        const railsCounterpartEventFilter = getRailsEventFilter(eventName, counterpartChainId, path.pathAddresses.counterpartPathAddress) as RequiredEventFilter
        console.log('Adding event filter', eventName, counterpartChainId, path.pathAddresses.pathAddress, railsCounterpartEventFilter)
        this.addEventFilterToIndexer(eventName, counterpartChainId, railsCounterpartEventFilter)
      }
    }
  }
}
