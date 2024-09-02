// import {
//   type TransferSent,
//   // type TransferPosted,
//   type TransferBonded,
//   type TransferSentIndexedEvents,
//   type TransferBondedIndexedEvents,
//   RailsSDKWrapper,
//   RailsEventName,
// } from './RailsSDK.js'
// import { OnchainEventIndexer } from '#indexer/OnchainEventIndexer.js'
// import type { providers } from 'ethers'
// import {
//   aggregateFilters,
//   getChainIdsForPaths,
//   getPathIdsPerChainId,
//   getRailsStartBlockNumber
// } from './utils.js'
// import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'
// import type { RailsPath } from './types.js'

// // TODO: SDK: Sent -> posted
// type RailsIndexerKey = keyof (TransferSent /*| TransferPosted */| TransferBonded)
// // TOD: SDK: More generalized
// type RailsEventIndexes = TransferSentIndexedEvents | TransferBondedIndexedEvents

// export class RailsClaimIndexer extends OnchainEventIndexer<RailsEventName, RailsIndexerKey> {

//   constructor(dbName: string, eventNames: RailsEventName[], paths: RailsPath[]) {
//     super(dbName)

//     const chainIds = getChainIdsForPaths(paths)
//     // All events are indexed by pathId so there is no need to filter them
//     for (const eventName of eventNames) {
//       for (const chainId of chainIds) {
//         const getPathIdsForChainId = getPathIdsPerChainId(chainId, paths)
//         const filters = getPathIdsForChainId.map(pathId => {
//           return this.#getFilterForEvent(chainId, eventName, { pathId })
//         })

//         // Aggregate the filters for each event and chainId
//         // Since we are already iterating over chainIds (and therefor addresses),
//         // we know that this method will only return a single filter.
//         const aggregatedFilters = aggregateFilters(filters)[0]!

//         this.addIndexerEventFilter(eventName, chainId, aggregatedFilters)
//       }
//     }
//   }

//   /**
//    * Implementation
//    */

//   protected override getEventFilter(chainId: string, eventName: RailsEventName): RequiredEventFilter {
//     return this.#getFilterForEvent(chainId, eventName)
//   }

//   protected override getIndexerKeys (eventName: RailsEventName): RailsIndexerKey[] {
//     // The indexer key for all events is transferId
//     return ['transferId']
//   }

//   protected override getStartBlockNumber (chainId: string): number {
//     return getRailsStartBlockNumber(chainId)
//   }

//   protected override addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): DecodedLogWithContext {
//     return RailsSDKWrapper.addDecodedTypesAndContextToEvent(log, chainId)
//   }

//   /**
//    * Internal
//    */

//   #getFilterForEvent (chainId: string, eventName: RailsEventName, topics?: Partial<RailsEventIndexes>): RequiredEventFilter {
//     switch (eventName) {
//       case RailsEventName.TransferSent:
//         return RailsSDKWrapper.getTransferSentEventFilter(chainId, topics)
//       case RailsEventName.TransferPosted:
//         return RailsSDKWrapper.getTransferPostedEventFilter(chainId, topics)
//       case RailsEventName.TransferBonded:
//         return RailsSDKWrapper.getTransferBondedEventFilter(chainId, topics)
//       default:
//         throw new Error('Invalid event name')
//     }
//   }
// }
