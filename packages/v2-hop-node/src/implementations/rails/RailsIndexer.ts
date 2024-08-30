import {
  type TransferSent,
  // type TransferPosted,
  type TransferBonded,
  RailsSDKWrapper,
  RailsSDK,
  RailsEventName,
} from './RailsSDK.js'
import { OnchainEventIndexer } from '#indexer/OnchainEventIndexer.js'
import type { providers } from 'ethers'
import { getRailsStartBlockNumber } from './utils.js'
import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'
import type { RailsPath } from './types.js'

// TODO: SDK: Sent -> posted
type RailsIndexerKey = keyof (TransferSent /*| TransferPosted */| TransferBonded)

/**
 * This class is responsible for abstracting away indexing logic
 * and for mapping concrete states to indexes so that the rest of
 * the Rails implementation doesn't need to concern itself with
 * the details of the indexing.
 */

export class RailsIndexer extends OnchainEventIndexer<RailsEventName, RailsIndexerKey> {

  constructor(dbName: string, eventNames: RailsEventName[], paths: RailsPath[]) {
    super(dbName)

    // Only index events with the pathId that the bonder cares about
    const pathIdsPerChain = this.#getPathIdsPerChain(paths)
    // All events are indexed by pathId so there is no need to filter them
    for (const eventName of eventNames) {
      for (const chainId of Object.keys(pathIdsPerChain)) {
        const pathIds = pathIdsPerChain[chainId]!
        const topics = {
          pathId: pathIds
        }
        const filter = this.#getFilterForEvent(chainId, eventName, topics)
        this.addIndexerEventFilter(eventName, chainId, filter)
      }
    }
  }

  /**
   * Implementation
   */

  protected override getEventFilter(chainId: string, eventName: RailsEventName, topics: string[] = []): RequiredEventFilter {
    return this.#getFilterForEvent(chainId, eventName, topics)
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

  /**
   * Internal
   */

  #getFilterForEvent (chainId: string, eventName: RailsEventName, topics: any): RequiredEventFilter {
    switch (eventName) {
      case RailsEventName.TransferSent:
        return RailsSDKWrapper.getTransferSentEventFilter(chainId, topics)
      case RailsEventName.TransferPosted:
        return RailsSDKWrapper.getTransferPostedEventFilter(chainId, topics)
      case RailsEventName.TransferBonded:
        return RailsSDKWrapper.getTransferBondedEventFilter(chainId, topics)
      default:
        throw new Error('Invalid state')
    }
  }


  #getPathIdsPerChain(paths: RailsPath[]): Record<string, string[]> {
    const pathIdsPerChain: Record<string, string[] | undefined> = {}

    for (const path of paths) {
      const pathId = RailsSDK.getPathId(path)

      const sourceChainId = path.srcChainId
      pathIdsPerChain[sourceChainId] = pathIdsPerChain[sourceChainId] ?? []
      if (!pathIdsPerChain[sourceChainId]?.includes(pathId)) {
        pathIdsPerChain[sourceChainId]?.push(pathId)
      }

      const destChainId = path.destChainId
      pathIdsPerChain[destChainId] = pathIdsPerChain[destChainId] ?? []
      if (!pathIdsPerChain[destChainId]?.includes(pathId)) {
        pathIdsPerChain[destChainId]?.push(pathId)
      }
    }

    // TODO: Shouldn't have to do this typecasting. Correctly type this
    // when I have more time.
    return pathIdsPerChain as Record<string, string[]>
  }
}
