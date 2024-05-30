import { MessageSDK } from './MessageSDK.js'
import { OnchainEventIndexer, type IndexerData } from '../indexer/OnchainEventIndexer.js'
import type { LogWithChainId } from '../types.js'
import { MessageState, IMessage } from './types.js'

type IndexNames = (keyof IMessage)[]

/**
 * This class is responsible for abstracting away indexing logic
 * and for mapping concrete states to indexes so that the rest of
 * the message implementation doesn't need to concern itself with
 * the details of the indexing.
 */

export class MessageIndexer extends OnchainEventIndexer {

  constructor (dbName: string, states: MessageState[], chainIds: string[]) {
    super(dbName)

    for (const state of states) {
      for (const chainId of chainIds) {
        const indexerData = this.#getIndexerData(chainId, state)
        this.initIndexer(indexerData)
      }
    }
  }

  /**
   * Public API
   */

  async getData(state: MessageState, value: IMessage): Promise<LogWithChainId> {
    const chainId: string = this.#getChainIdForItem(state, value)
    const indexerData = this.#getIndexerData(chainId, state)
    const indexValues: string[] = this.#getIndexFromMessageData(state, value, chainId)
    return this.getItem(indexerData, indexValues)
  }

  /**
   * Internal
   */

  #getIndexerData(chainId: string, state: IMessage): IndexerData<IndexNames> {
    if (MessageState.Sent === state) {
      return {
        chainId,
        eventSig: MessageSDK.HOP_CCTP_TRANSFER_SENT_SIG,
        eventContractAddress: MessageSDK.getCCTPTransferSentEventFilter(chainId).address,
        indexNames: ['nonce', 'sourceChainId']
      }
    } else if (MessageState.Attested === state) {
      return {
        chainId,
        eventSig: MessageSDK.MESSAGE_RECEIVED_EVENT_SIG,
        eventContractAddress: MessageSDK.getMessageReceivedEventFilter(chainId).address,
        indexNames: ['nonce', 'sourceChainId']
      }
    }
    throw new Error('Invalid state')
  }

  #getChainIdForItem (state: IMessage, value: IMessage): string {
    let chainId: string
    if (MessageState.Sent === state) {
      chainId = value?.sourceChainId
    } else if (MessageState.Attested === state) {
      chainId = value?.destinationChainId
    } else {
      throw new Error('Invalid state')
    }

    if (!chainId) {
      throw new Error('Invalid chainId')
    }
    return chainId
  }

  #getIndexFromMessageData (state: IMessage, value: IMessage, chainId: string): string[] {
    const indexNames = this.#getIndexerData(chainId, state).indexNames
    return indexNames.map(indexName => value[indexName as keyof IMessage] as string)
  }
}
