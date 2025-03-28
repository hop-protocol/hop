import { OnchainEventIndexer } from '#indexer/index.js'
import type { providers } from 'ethers'
import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'
import {
  type HopCCTPTransferSentDecodedWithMessage,
  type HopCCTPTransferReceivedDecoded,
  CCTPEventName,
  CCTPSDK
} from './sdk/CCTPSDK.js'
import type { ClientName } from '../constants.js'

export type CCTPEventIndexes =
  | (keyof HopCCTPTransferSentDecodedWithMessage)[]
  | (keyof HopCCTPTransferReceivedDecoded)[]

export class CCTPIndexer extends OnchainEventIndexer<CCTPEventName, CCTPEventIndexes> {

  constructor(name: ClientName, chainIds: string[]) {
    super(name)

    for (const chainId of chainIds) {
      for (const eventName of Object.values(CCTPEventName)) {
        const filter = this.#getEventFilter(chainId, eventName)
        this.addEventFilterToIndexer(eventName, chainId, filter)
      }
    }
  }

  /**
   * Implementation
   */

  protected override getDesiredEventIndexes (eventName: CCTPEventName): CCTPEventIndexes {
    switch (eventName) {
      case CCTPEventName.CCTPTransferSent:
        return ['cctpNonce', 'chainId']
      case CCTPEventName.MessageReceived:
        return ['nonce', 'sourceDomain']
      default:
        throw new Error(`Invalid event name: ${String(eventName)}`)
    }
  }

  protected override getStartBlockNumber (chainId: string): number {
    return CCTPSDK.getStartBlockNumber(chainId)
  }

  protected override getDecodedLogWithContext(log: providers.Log, chainId: string): DecodedLogWithContext {
    return CCTPSDK.getDecodedLogWithContext(log, chainId)
  }

  // NOTE: This only exists here since some CCTP logs can be sent to unsupported chains. This will
  // likely not exist in most implementations. See the comment in the abstract class.
  protected override filterIrrelevantLog(log: DecodedLogWithContext): boolean {
    const sourceDomain: string | undefined = (log.decoded as any)?.sourceDomain
    if (!sourceDomain) return true

    const enabledDomains = CCTPSDK.getEnabledDomains()
    if (!enabledDomains.includes(Number(sourceDomain))) return false

    return true
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
        throw new Error(`Invalid event name: ${String(eventName)}`)
    }
  }
}
