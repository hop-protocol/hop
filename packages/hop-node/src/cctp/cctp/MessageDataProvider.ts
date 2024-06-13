import type { DecodedLogWithContext } from '../types.js'
import {
  MessageSDK,
  type HopCCTPTransferSentDecodedWithMessage,
  type HopCCTPTransferReceivedDecoded
} from './MessageSDK.js'
import { getChain } from '@hop-protocol/sdk'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { DataProvider } from '../data-provider/DataProvider.js'
import { type IMessage, MessageState, isSentMessage, isRelayedMessage, type ISentMessage, type IRelayedMessage } from './types.js'

// Since the messages are unique by chainId, his MessageDataProvider should be the
// class that abstracts this away.

// TODO: Somewhere the data returned from the indexer needs to be validated against historical
// data to ensure, for example, the message didn't change.


export class MessageDataProvider extends DataProvider<MessageState, IMessage> {

  /**
   * Implementation
   */

  override async fetchItem (state: MessageState, value: IMessage): Promise<IMessage> {
    let typedValue
    if (isSentMessage(value)) {
      typedValue = value as ISentMessage
    } else if (isRelayedMessage(value)) {
      typedValue = value as IRelayedMessage
    }

    const eventLog: DecodedLogWithContext = await this.retrieveItem(state, value)
    return this.formatItem(state, eventLog)
  }

  protected override getKeyFromLog (log: DecodedLogWithContext): MessageState {
    return this.#getStateFromLog(log)
  }

  protected override async formatItem (state: MessageState, log: DecodedLogWithContext): Promise<IMessage> {
    switch (state) {
      case MessageState.Sent:
        return this.#formatTransferSentLog(log as DecodedLogWithContext<HopCCTPTransferSentDecodedWithMessage>)
      case MessageState.Relayed:
        return this.#formatRelayedLog(log as DecodedLogWithContext<HopCCTPTransferReceivedDecoded>)
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  async #formatTransferSentLog (log: DecodedLogWithContext<HopCCTPTransferSentDecodedWithMessage>): Promise<ISentMessage> {
    const { transactionHash,context, decoded } = log
    const { chainId } = context
    const { message, cctpNonce, chainId: destinationChainId } = decoded
    const timestampMs = await this.#getBlockTimestampFromLogMs(log)

    // TODO: messageNonce should be bignum or num?
    return {
      message,
      messageNonce: Number(cctpNonce),
      sourceChainId: chainId,
      destinationChainId,
      sentTxHash: transactionHash,
      sentTimestampMs: timestampMs
    } as ISentMessage
  }

  async #formatRelayedLog (log: DecodedLogWithContext<HopCCTPTransferReceivedDecoded>): Promise<IRelayedMessage> {
    const { transactionHash } = log
    const timestampMs = await this.#getBlockTimestampFromLogMs(log)
    return {
      relayTransactionHash: transactionHash,
      relayTimestampMs: timestampMs
    } as IRelayedMessage
  }

  /**
   * Utils
   */

  async #getBlockTimestampFromLogMs (log: DecodedLogWithContext): Promise<number> {
    const { context, blockNumber } = log
    const chainSlug = getChain(context.chainId).slug
    const provider = getRpcProvider(chainSlug)
    const block = await provider.getBlock(blockNumber)
    return block.timestamp * 1000
  }

  #getStateFromLog (log: DecodedLogWithContext): MessageState {
    const eventSig = log.topics[0]
    switch (eventSig) {
      case (MessageSDK.HOP_CCTP_TRANSFER_SENT_SIG):
       return MessageState.Sent
      case (MessageSDK.MESSAGE_RECEIVED_EVENT_SIG):
        return MessageState.Relayed
      default:
        throw new Error('Invalid log')
    }
  }
}
