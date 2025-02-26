import {
  type RailsFilterInputs,
  EventName as RailsEventName,
  addDecodedTypesToEvent,
  getRailsEventFilter
} from './RailsSDKWrapper.js'
import { OnchainEventIndexer } from '#indexer/index.js'
import {
  aggregateFilters,
  getChainIdsForPaths,
  getPathIdsPerChainId,
  getRailsStartBlockNumber
} from './utils.js'
import type { RailsPath } from './types.js'
import type { providers } from 'ethers'
import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'
import type { ClientName } from '../constants.js'

type RailsEventIndexes = (keyof NonNullable<RailsFilterInputs>)[]

export class RailsIndexer extends OnchainEventIndexer<RailsEventName, RailsEventIndexes> {

  constructor(name: ClientName, paths: RailsPath[]) {
    super(name)

    this.addEventFilters(paths)
  }

  /**
   * Implementation
   */

  protected override getEventFilter(chainId: string, eventName: RailsEventName): RequiredEventFilter {
    // We know that the filter returned will be a RequiredEventFilter since we own the SDK
    return getRailsEventFilter(eventName, chainId) as RequiredEventFilter
  }

  protected override getDesiredEventIndexes (eventName: RailsEventName): RailsEventIndexes {
    // The indexer key for all events is transferId
    return ['transferId']
  }

  protected override getStartBlockNumber (chainId: string): number {
    return getRailsStartBlockNumber(chainId)
  }

  protected override getDecodedLogWithContext(log: providers.Log, chainId: string): DecodedLogWithContext {
    const decodedEvent = addDecodedTypesToEvent(log)
    const eventName = decodedEvent.event!
    return {
      ...decodedEvent,
      context: {
        eventName,
        chainId
      }
    }
  }

  // Internal

  // In theory, this should occur here at the top level since event indexing should not be concerned
  // with sub-implementation (i.e. transfer vs. claim) details. If there is a need for this, then implement
  // those details in the sub-implementation and extend this class.
  protected addEventFilters(paths: RailsPath[]): void {
    this.addEventFilters(paths)
    const chainIds = getChainIdsForPaths(paths)
    const eventNames = Object.values(RailsEventName)

    // All events are indexed by pathId so there is no need to filter them
    for (const eventName of eventNames) {
      for (const chainId of chainIds) {
        const getPathIdsForChainId = getPathIdsPerChainId(chainId, paths)
        const filters = getPathIdsForChainId.map(pathId => {
          return getRailsEventFilter(eventName, chainId, { pathId }) as RequiredEventFilter
        })

        // Aggregate the filters for each event and chainId
        // Since we are already iterating over chainIds (and therefor addresses),
        // we know that this method will only return a single filter.
        const aggregatedFilters = aggregateFilters(filters)[0]!

        this.addEventFilterToIndexer(eventName, chainId, aggregatedFilters)
      }
    }
  }
}
