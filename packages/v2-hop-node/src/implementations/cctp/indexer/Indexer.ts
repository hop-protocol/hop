import { OnchainEventIndexer } from '#indexer/OnchainEventIndexer.js'
import type { providers } from 'ethers'
import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'
import {
  type HopCCTPTransferSentDecodedWithMessage,
  type HopCCTPTransferReceivedDecoded,
  CCTPEventName,
  CCTPSDK
} from '../sdk/CCTPSDK.js'

// TODO: I believe this should be union, not intersection
type CCTPIndexerKey = keyof (HopCCTPTransferSentDecodedWithMessage & HopCCTPTransferReceivedDecoded)

export class CCTPIndexer extends OnchainEventIndexer<CCTPEventName, CCTPIndexerKey> {

  constructor(dbName: string, chainIds: string[]) {
    super(dbName)

    for (const chainId of chainIds) {
      for (const eventName of Object.values(CCTPEventName)) {
        const filter = this.#getEventFilter(chainId, eventName)
        this.addIndexerEventFilter(eventName, chainId, filter)
      }
    }
  }

  /**
   * Implementation
   */

  protected override getEventFilter(chainId: string, eventName: CCTPEventName): RequiredEventFilter {
    switch (eventName) {
      case CCTPEventName.CCTPTransferSent:
        return CCTPSDK.getCCTPTransferSentEventFilter(chainId)
      case CCTPEventName.MessageReceived:
        return CCTPSDK.getMessageReceivedEventFilter(chainId)
      default:
        throw new Error('Invalid event name')
    }
  }

  protected override getIndexerKeys (eventName: CCTPEventName): CCTPIndexerKey[] {
    switch (eventName) {
      case CCTPEventName.CCTPTransferSent:
        return ['cctpNonce', 'chainId']
      case CCTPEventName.MessageReceived:
        return ['nonce', 'sourceDomain']
      default:
        throw new Error('Invalid event name')
    }
  }

  protected override getStartBlockNumber (chainId: string): number {
    return CCTPSDK.getStartBlockNumber(chainId)
  }

  protected override addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): DecodedLogWithContext {
    return CCTPSDK.addDecodedTypesAndContextToEvent(log, chainId)
  }

  /**
   * Internal
   */

  #getEventFilter(chainId: string, eventName: CCTPEventName): RequiredEventFilter {
    switch(eventName) {
      case CCTPEventName.CCTPTransferSent:
        return CCTPSDK.getCCTPTransferSentEventFilter(chainId)
      case CCTPEventName.MessageReceived:
        return CCTPSDK.getMessageReceivedEventFilter(chainId)
      default:
        throw new Error('Invalid event name')
    }
  }
}
