import { RailsSDKWrapper } from './RailsSDK.js'
import { DataProvider } from '#data-provider/DataProvider.js'
import {
  type IRailsTransfer,
  type ISentRailsTransfer,
  type IPostedRailsTransfer,
  type IBondedRailsTransfer,
  RailsTransferState
} from './types.js'
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
          ...decoded as ISentRailsTransfer,
          sentTxHash: transactionHash,
          sentTimestampMs: timestampMs
        }
      case RailsTransferState.Posted:
        return {
          ...decoded as IPostedRailsTransfer,
          postedTxHash: transactionHash,
          postedTimestampMs: timestampMs
        }
      case RailsTransferState.Bonded:
        return {
          ...decoded as IBondedRailsTransfer,
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
      case RailsSDKWrapper.getTransferSentEventFilter(chainId).topics![0]:
       return RailsTransferState.Sent
      case RailsSDKWrapper.getTransferPostedEventFilter(chainId).topics![0]:
        return RailsTransferState.Posted
      case RailsSDKWrapper.getTransferBondedEventFilter(chainId).topics![0]:
        return RailsTransferState.Bonded
      default:
        throw new Error('Invalid log')
    }
  }
}
