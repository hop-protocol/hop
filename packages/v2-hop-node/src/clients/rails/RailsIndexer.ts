import {
  type TransferSent,
  type TransferBonded,
  RailsSDKWrapper
} from './RailsSDKWrapper.js'
import { OnchainEventIndexer } from '#indexer/index.js'
import {
  aggregateFilters,
  getChainIdsForPaths,
  getPathIdsPerChainId,
  getRailsStartBlockNumber
} from './utils.js'
import { type RailsPath, RailsEventName } from './types.js'
import type { providers } from 'ethers'
import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'

// TODO: SDK: Sent -> posted
type RailsIndexerKey = keyof (TransferSent | TransferBonded)

export class RailsIndexer extends OnchainEventIndexer<RailsEventName, RailsIndexerKey> {

  constructor(dbName: string, paths: RailsPath[]) {
    super(dbName)

    this.addEventFilters(paths)
  }

  /**
   * Implementation
   */

  protected override getEventFilter(chainId: string, eventName: RailsEventName): RequiredEventFilter {
    return RailsSDKWrapper.getEventFilter(eventName, chainId)
  }

  protected override getIndexerKeys (eventName: RailsEventName): RailsIndexerKey[] {
    // The indexer key for all events is transferId
    return ['transferId']
  }

  protected override getStartBlockNumber (chainId: string): number {
    return getRailsStartBlockNumber(chainId)
  }

  protected override addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): DecodedLogWithContext {
    return RailsSDKWrapper.addDecodedTypesAndContextToEvent(log, chainId)
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
          return RailsSDKWrapper.getEventFilter(eventName, chainId, { pathId })
        })

        // Aggregate the filters for each event and chainId
        // Since we are already iterating over chainIds (and therefor addresses),
        // we know that this method will only return a single filter.
        const aggregatedFilters = aggregateFilters(filters)[0]!

        this.addIndexerEventFilter(eventName, chainId, aggregatedFilters)
      }
    }
  }
}
