import {
  type TransferSent,
  type TransferBonded,
  RailsSDKWrapper
} from './RailsSDK.js'
import { OnchainEventIndexer } from '#indexer/OnchainEventIndexer.js'
import { getRailsStartBlockNumber } from './utils.js'
import type { providers } from 'ethers'
import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'
import type { RailsPath, RailsEventName } from './types.js'

// TODO: SDK: Sent -> posted
type RailsIndexerKey = keyof (TransferSent | TransferBonded)

export abstract class RailsIndexer extends OnchainEventIndexer<RailsEventName, RailsIndexerKey> {

  protected abstract addEventFilters(paths: RailsPath[]): void

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
}
