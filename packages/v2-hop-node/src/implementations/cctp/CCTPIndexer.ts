import { CCTPSDK, type HopCCTPTransferSentDecoded, type HopCCTPTransferReceivedDecoded } from './sdk/CCTPSDK.js'
import { OnchainEventIndexer, type IndexerEventFilter } from '#indexer/OnchainEventIndexer.js'
import type { DecodedLogWithContext } from '#types/index.js'
import { type ICCTPMessage, CCTPMessageState } from './types.js'
import type { providers } from 'ethers'

type LookupKey = (keyof HopCCTPTransferSentDecoded | keyof HopCCTPTransferReceivedDecoded)

/**
 * This class is responsible for abstracting away indexing logic
 * and for mapping concrete states to indexes so that the rest of
 * the CCTP implementation doesn't need to concern itself with
 * the details of the indexing.
 */

export class CCTPIndexer extends OnchainEventIndexer<CCTPMessageState, ICCTPMessage, LookupKey> {

  constructor (dbName: string, states: CCTPMessageState[], chainIds: string[]) {
    super(dbName)

    for (const state of states) {
      for (const chainId of chainIds) {
        const indexerEventFilter = this.#getIndexerEventFilterByChainId(chainId, state)
        this.addIndexerEventFilter(indexerEventFilter)
      }
    }
  }

  /**
   * Implementation
   */

  protected override getIndexerEventFilter(state: CCTPMessageState, value: ICCTPMessage): IndexerEventFilter<LookupKey> {
    const chainId: string = this.#getChainIdForContext(state, value)
    return this.#getIndexerEventFilterByChainId(chainId, state)
  }

  protected override getLookupKeyValue (lookupKey: LookupKey, value: ICCTPMessage): string {
    switch (lookupKey) {
      case 'cctpNonce':
        return value.messageNonce.toString()
      case 'chainId':
        return value.sourceChainId
      case 'nonce':
        return value.messageNonce.toString()
      case 'sourceDomain':
        return CCTPSDK.getDomainFromChainId(value.sourceChainId)
      default:
        throw new Error('Invalid lookup key')
    }
  }

  protected override addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): DecodedLogWithContext {
    return CCTPSDK.addDecodedTypesAndContextToEvent(log, chainId)
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

  #getIndexerEventFilterByChainId(chainId: string, state: CCTPMessageState): IndexerEventFilter<LookupKey> {
    switch (state) {
      case CCTPMessageState.Sent:
        return {
          chainId,
          filter: CCTPSDK.getCCTPTransferSentEventFilter(chainId),
          startBlockNumber: CCTPSDK.getStartBlockNumber(chainId),
          lookupKeys: ['cctpNonce', 'chainId']
        }
      case CCTPMessageState.Relayed:
        return {
          chainId,
          filter: CCTPSDK.getMessageReceivedEventFilter(chainId),
          startBlockNumber: CCTPSDK.getStartBlockNumber(chainId),
          lookupKeys: ['nonce', 'sourceDomain']
        }
      default:
        throw new Error('Invalid state')
    }
  }

  #getChainIdForContext (state: CCTPMessageState, value: ICCTPMessage): string {
    switch (state) {
      case CCTPMessageState.Sent:
        return value.sourceChainId
      case CCTPMessageState.Relayed:
        return value.destinationChainId
      default:
        throw new Error('Invalid state')
    }
  }
}
