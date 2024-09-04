import { getChainIdsForPaths, getPathIdsPerChainId } from '../utils.js'
import { aggregateFilters } from '../../utils.js'
import { RailsIndexer } from '../../RailsIndexer.js'
import { type RailsPath, RailsEventName } from '../../types.js'
import { RailsSDKWrapper } from '../../RailsSDK.js'

export class RailsTransferIndexer extends RailsIndexer {

  protected override addEventFilters(paths: RailsPath[]) {
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
