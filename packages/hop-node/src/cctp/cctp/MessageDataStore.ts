import type { LogWithChainId } from '../types.js'
import { MessageSDK } from './MessageSDK.js'
import { ChainSlug, getChain } from '@hop-protocol/sdk'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { DataStore } from '../data-store/DataStore.js'
import { MessageState } from './types.js'
import type { IMessage } from './types.js'

// Since the messages are unique by chainId, his MessageDataStore should be the
// class that abstracts this away.

export class MessageDataStore extends DataStore<MessageState, IMessage> {

  // TODO: I'm starting to think this `value` doesn't need to encompass all the data
  ///////////////////// but maybe it does.......how else would i get message (hash) everywehre for the index
  //////////// it does as long as i need the chain id
  ///////////////////// but then that means every single step needs a chainId. is that ok? if so, add to nots for our v2 contract emissiosn

  /**
   * Implementation
   */

  async fetchItem (state: MessageState, value: IMessage): Promise<IMessage> {
    const eventLog: LogWithChainId = await this.fetchStoredItem(state, value)
    return this.formatItem(state, eventLog)
  }

  protected override getKeyFromLog (log: LogWithChainId): MessageState {
    return this.#getStateFromLog(log)
  }

  protected override async formatItem (state: MessageState, log: LogWithChainId): Promise<IMessage> {
    switch (state) {
      case MessageState.Sent:
        return this.#formatTransferSentLog(log)
      case MessageState.Relayed:
        return this.#formatRelayedLog(log)
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  async #formatTransferSentLog (log: LogWithChainId): Promise<IMessage> {
    const { transactionHash, chainId /*, parsedData */ } = log
    // TODO: fix
    const parsedData: any = {}
    const { message, cctpNonce, chainId: destinationChainId } = parsedData
    const timestampMs = await this.#getBlockTimestampFromLogMs(log)

    return {
      message,
      messageNonce: cctpNonce,
      sourceChainId: chainId,
      destinationChainId,
      sentTxHash: transactionHash,
      sentTimestampMs: timestampMs
    } as IMessage
  }

  async #formatRelayedLog (log: LogWithChainId): Promise<IMessage> {
    const { transactionHash } = log
    // TODO: Is this the right chainId? Src vs dest?
    const timestampMs = await this.#getBlockTimestampFromLogMs(log)
    return {
      relayTransactionHash: transactionHash,
      relayTimestampMs: timestampMs
    } as IMessage
  }

  /**
   * Utils
   */

  async #getBlockTimestampFromLogMs (log: LogWithChainId): Promise<number> {
    const { chainId, blockNumber } = log
    const chainSlug = getChain(chainId).slug
    const provider = getRpcProvider(chainSlug as ChainSlug)
    const block = await provider.getBlock(blockNumber)
    return block.timestamp * 1000
  }

  #getStateFromLog (log: LogWithChainId): MessageState {
    const eventSig = log.topics[0]
    switch (eventSig) {
      case (MessageSDK.HOP_CCTP_TRANSFER_SENT_SIG):
       return MessageState.TransferSent
      case (MessageSDK.MESSAGE_RECEIVED_EVENT_SIG):
        return MessageState.Relayed
      default:
        throw new Error('Invalid log')
    }
  }
}
