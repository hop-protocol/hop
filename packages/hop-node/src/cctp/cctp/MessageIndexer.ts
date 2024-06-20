import { MessageSDK, HopCCTPTransferSentDecoded, HopCCTPTransferReceivedDecoded } from './MessageSDK.js'
import { OnchainEventIndexer, type IndexerEventFilter } from '../indexer/OnchainEventIndexer.js'
import type { DecodedLogWithContext } from '../types.js'
import { type IMessage, MessageState } from './types.js'
import { providers } from 'ethers'

type LookupKey = (keyof HopCCTPTransferSentDecoded | keyof HopCCTPTransferReceivedDecoded)

/**
 * This class is responsible for abstracting away indexing logic
 * and for mapping concrete states to indexes so that the rest of
 * the message implementation doesn't need to concern itself with
 * the details of the indexing.
 */

export class MessageIndexer extends OnchainEventIndexer<MessageState, IMessage, LookupKey> {

  constructor (dbName: string, states: MessageState[], chainIds: string[]) {
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

  protected override getIndexerEventFilter(state: MessageState, value: IMessage): IndexerEventFilter<LookupKey> {
    const chainId: string = this.#getChainIdForContext(state, value)
    return this.#getIndexerEventFilterByChainId(chainId, state)
  }

  protected override getLookupKeyValue (lookupKey: LookupKey, value: IMessage): string {
    switch (lookupKey) {
      case 'cctpNonce':
        return value.messageNonce.toString()
      case 'chainId':
        return value.sourceChainId
      case 'nonce':
        return value.messageNonce.toString()
      case 'sourceDomain':
        return MessageSDK.getDomainFromChainId(value.sourceChainId)
      default:
        throw new Error('Invalid lookup key')
    }
  }

  protected override addDecodedTypesAndContextToEvent(log: providers.Log, chainId: string): DecodedLogWithContext {
    return MessageSDK.addDecodedTypesAndContextToEvent(log, chainId)
  }

  // NOTE: This is not meant to exist outside of the CCTP implementation. See the comment in the abstract class.
  protected override filterIrrelevantLog(log: DecodedLogWithContext): boolean {
    const sourceDomain = (log.decoded as any)?.sourceDomain
    if (!sourceDomain) return true

    const enabledDomains = MessageSDK.getEnabledDomains()
    if (!enabledDomains.includes(sourceDomain)) return false

    return true
  }

  /**
   * Internal
   */

  #getIndexerEventFilterByChainId(chainId: string, state: MessageState): IndexerEventFilter<LookupKey> {
    switch (state) {
      case MessageState.Sent:
        return {
          chainId,
          filter: MessageSDK.getCCTPTransferSentEventFilter(chainId),
          startBlockNumber: MessageSDK.getStartBlockNumber(chainId),
          lookupKeys: ['cctpNonce', 'chainId']
        }
      case MessageState.Relayed:
        return {
          chainId,
          filter: MessageSDK.getMessageReceivedEventFilter(chainId),
          startBlockNumber: MessageSDK.getStartBlockNumber(chainId),
          lookupKeys: ['nonce', 'sourceDomain']
        }
      default:
        throw new Error('Invalid state')
    }
  }

  #getChainIdForContext (state: MessageState, value: IMessage): string {
    switch (state) {
      case MessageState.Sent:
        return value.sourceChainId
      case MessageState.Relayed:
        return value.destinationChainId
      default:
        throw new Error('Invalid state')
    }
  }
}
