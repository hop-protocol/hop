import {
  transferSentEventFilter,
  transferPostedEventFilter,
  transferBondedEventFilter
} from '@hop-protocol/v2-sdk'
import { DataProvider } from '#data-provider/DataProvider.js'
import { type IRailsTransfer, RailsTransferState } from './types.js'
import { getBlockTimestampFromLogMs } from '#utils/getBlockTimestampFromLogMs.js'
import type { DecodedLogWithContext } from '#types/index.js'

export class RailsDataProvider extends DataProvider<RailsTransferState, IRailsTransfer> {

  /**
   * Implementation
   */

  protected override getKeyFromDataSourceItem (log: DecodedLogWithContext): RailsTransferState {
    return this.#getStateFromLog(log)
  }

  protected override async formatDataSourceItem (state: RailsTransferState, log: DecodedLogWithContext): Promise<IRailsTransfer> {
    const { transactionHash, decoded } = log
    const timestampMs = await getBlockTimestampFromLogMs(log)

    switch (state) {
      case RailsTransferState.Sent:
        return {
          ...decoded,
          sentTxHash: transactionHash,
          sentTimestampMs: timestampMs
        }
      case RailsTransferState.Posted:
        return {
          ...decoded,
          postedTxHash: transactionHash,
          postedTimestampMs: timestampMs
        }
      case RailsTransferState.Bonded:
        return {
          ...decoded,
          bondedTxHash: transactionHash,
          bondedTimestampMs: timestampMs
        }
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Utils
   */

  #getStateFromLog (log: DecodedLogWithContext): RailsTransferState {
    const eventSig = log.topics[0]
    const chainId = log.context.chainId
    switch (eventSig) {
      case transferSentEventFilter(chainId).topics[0]:
       return RailsTransferState.Sent
      case transferPostedEventFilter(chainId).topics[0]:
        return RailsTransferState.Posted
      case transferBondedEventFilter(chainId).topics[0]:
        return RailsTransferState.Bonded
      default:
        throw new Error('Invalid log')
    }
  }
}
