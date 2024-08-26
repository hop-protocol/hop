import type { DecodedLogWithContext } from '#types/index.js'
import {
  CCTPSDK,
  type HopCCTPTransferSentDecodedWithMessage,
  type HopCCTPTransferReceivedDecoded
} from './sdk/CCTPSDK.js'
import { DataProvider } from '#data-provider/DataProvider.js'
import { type ICCTPMessage, CCTPMessageState, type ISentCCTPMessage, type IRelayedCCTPMessage } from './types.js'
import { getBlockTimestampFromLogMs } from '#utils/getBlockTimestampFromLogMs.js'

export class CCTPDataProvider extends DataProvider<CCTPMessageState, ICCTPMessage> {

  /**
   * Implementation
   */

  protected override getKeyFromDataSourceItem (log: DecodedLogWithContext): CCTPMessageState {
    return this.#getStateFromLog(log)
  }

  protected override async formatDataSourceItem (state: CCTPMessageState, log: DecodedLogWithContext): Promise<ICCTPMessage> {
    switch (state) {
      case CCTPMessageState.Sent:
        return this.#formatTransferSentLog(log as DecodedLogWithContext<HopCCTPTransferSentDecodedWithMessage>)
      case CCTPMessageState.Relayed:
        return this.#formatRelayedLog(log as DecodedLogWithContext<HopCCTPTransferReceivedDecoded>)
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  async #formatTransferSentLog (log: DecodedLogWithContext<HopCCTPTransferSentDecodedWithMessage>): Promise<ISentCCTPMessage> {
    const { transactionHash,context, decoded } = log
    const { chainId } = context
    const { message, cctpNonce, chainId: destinationChainId } = decoded
    const timestampMs = await getBlockTimestampFromLogMs(log)

    return {
      message,
      messageNonce: cctpNonce,
      sourceChainId: chainId,
      destinationChainId,
      sentTxHash: transactionHash,
      sentTimestampMs: timestampMs
    }
  }

  async #formatRelayedLog (log: DecodedLogWithContext<HopCCTPTransferReceivedDecoded>): Promise<IRelayedCCTPMessage> {
    const { transactionHash, decoded, context } = log
    const { nonce, sourceDomain } = decoded
    const timestampMs = await getBlockTimestampFromLogMs(log)
    return {
      messageNonce: nonce,
      sourceChainId: CCTPSDK.getChainIdFromDomain(sourceDomain),
      destinationChainId: context.chainId,
      relayTransactionHash: transactionHash,
      relayTimestampMs: timestampMs
    }
  }

  /**
   * Utils
   */

  #getStateFromLog (log: DecodedLogWithContext): CCTPMessageState {
    const eventSig = log.topics[0]
    const chainId = log.context.chainId
    switch (eventSig) {
      case (CCTPSDK.getCCTPTransferSentEventFilter(chainId).topics[0]):
       return CCTPMessageState.Sent
      case (CCTPSDK.getMessageReceivedEventFilter(chainId).topics[0]):
        return CCTPMessageState.Relayed
      default:
        throw new Error('Invalid log')
    }
  }
}
