import type { EthersEventWithDecodedTypes } from '#types/index.js'
import {
  type EthersEventWithDecodedTypes,
  type TransferBonded,
  type TransferPosted,
  type TransferSent
  transferSentEventFilter,
  transferPostedEventFilter,
  transferBondedEventFilter
} from '@hop-protocol/sdk'
import { DataProvider } from '#data-provider/DataProvider.js'
import {
  type IRailsTransfer,
  type ISentRailsTransfer,
  type IPostedRailsTransfer,
  type IBondedRailsTransfer,
  RailsTransferState
} from './types.js'
import { getBlockTimestampFromLogMs } from '#utils/getBlockTimestampFromLogMs.js'

export class RailsDataProvider extends DataProvider<RailsTransferState, IRailsTransfer> {

  /**
   * Implementation
   */

  protected override getKeyFromDataSourceItem (log: EthersEventWithDecodedTypes): RailsTransferState {
    return this.#getStateFromLog(log)
  }

  protected override async formatDataSourceItem (state: RailsTransferState, log: EthersEventWithDecodedTypes): Promise<IRailsTransfer> {
    switch (state) {
      case RailsTransferState.Sent:
        return this.#formatSentRailsTransferLog(log as EthersEventWithDecodedTypes<TransferSent>)
      case RailsTransferState.Posted:
        return this.#formatPostedRailsTransferLog(log as EthersEventWithDecodedTypes<TransferPosted>)
      case RailsTransferState.Bonded:
        return this.#formatBondedRailsTransferLog(log as EthersEventWithDecodedTypes<TransferBonded>)
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  async #formatSentRailsTransferLog (log: EthersEventWithDecodedTypes<TransferSent>): Promise<ISentRailsTransfer> {
    // TODO: Fill in
    // const { transactionHash, context, decoded } = log
    // const { chainId } = context
    // const { message, cctpNonce, chainId: destinationChainId } = decoded
    // const timestampMs = await getBlockTimestampFromLogMs(log)

    // return {
    //   message,
    //   messageNonce: cctpNonce,
    //   sourceChainId: chainId,
    //   destinationChainId,
    //   sentTxHash: transactionHash,
    //   sentTimestampMs: timestampMs
    // }
  }

  async #formatPostedRailsTransferLog (log: EthersEventWithDecodedTypes<TransferPosted>): Promise<IPostedRailsTransfer> {
    // TODO: Fill in
  }

  async #formatBondedRailsTransferLog (log: EthersEventWithDecodedTypes<TransferBonded>): Promise<IBondedRailsTransfer> {
    // TODO: Fill in
    // const { transactionHash, decoded, context } = log
    // const { nonce, sourceDomain } = decoded
    // const timestampMs = await getBlockTimestampFromLogMs(log)
    // return {
    //   messageNonce: nonce,
    //   sourceChainId: MessageSDK.getChainIdFromDomain(sourceDomain),
    //   destinationChainId: context.chainId,
    //   relayTransactionHash: transactionHash,
    //   relayTimestampMs: timestampMs
    // }
  }

  /**
   * Utils
   */

  #getStateFromLog (log: EthersEventWithDecodedTypes): RailsTransferState {
    const eventSig = log.topics[0]
    const chainId = log.context.chainId
    switch (eventSig) {
      // TODO: Fill this in
      case transferSentEventFilter(chainId).topics[0]):
      //  return MessageState.Sent
      case transferPostedEventFilter(chainId).topics[0]):
        // return MessageState.Relayed
      case transferBondedEventFilter(chainId).topics[0]):
        // return MessageState.Relayed
      default:
        throw new Error('Invalid log')
    }
  }
}
