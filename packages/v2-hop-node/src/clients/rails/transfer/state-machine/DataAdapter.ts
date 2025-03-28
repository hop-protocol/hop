import { DataAdapter } from '#state-machine/index.js'
import { getCounterpartChainIdForPathId } from '../../utils.js'
import {
  type TransferBonded,
  type TransferSent,
  RailsEventName,
  getRailsPathAddress
} from '../../RailsSDKWrapper.js'
import {
  type IBondedRailsTransfer,
  type IRailsTransfer,
  type ISentRailsTransfer,
  RailsTransferEventName,
  RailsTransferState
} from './types.js'
import type { DecodedLogWithContext, EventContext } from '#types/index.js'

export class RailsTransferDataAdapter extends DataAdapter<RailsTransferState, IRailsTransfer, RailsEventName> {

  protected isValidEventName(eventName: RailsEventName | string): eventName is RailsEventName {
    return Object.values(RailsTransferEventName).includes(eventName as RailsTransferEventName)
  }

  protected override formatDecodedLog (log: DecodedLogWithContext): IRailsTransfer {
    const { eventName } = log.context
    switch (eventName) {
      case RailsEventName.TransferSent:
        return this.#formatTransferSentLog(log as DecodedLogWithContext<TransferSent>) as IRailsTransfer
      case RailsEventName.TransferBonded:
        return this.#formatTransferBondedLog(log as DecodedLogWithContext<TransferBonded>) as IRailsTransfer
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override getStateFromEventName (eventName: string): RailsTransferState {
    switch (eventName) {
      case RailsEventName.TransferSent:
        return RailsTransferState.Sent
      case RailsEventName.TransferBonded:
        return RailsTransferState.Bonded
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override async getEventContextFromState (state: RailsTransferState, value: IRailsTransfer): Promise<EventContext<RailsEventName>> {
    const { pathId, txContext } = value
    const { chainId } = txContext
    const counterpartChainId = getCounterpartChainIdForPathId(chainId, pathId)

    switch (state) {
      case RailsTransferState.Sent: {
        const eventAddress = await getRailsPathAddress(pathId, chainId)
        return {
          eventChainId: chainId,
          eventAddress,
          eventName: RailsEventName.TransferSent,
        }
      }
      case RailsTransferState.Bonded: {
        const eventAddress = await getRailsPathAddress(pathId, counterpartChainId)
        return {
          eventChainId: counterpartChainId,
          eventAddress,
          eventName: RailsEventName.TransferBonded,
        }
      }
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #formatTransferSentLog (log: DecodedLogWithContext<TransferSent>): Omit<ISentRailsTransfer, 'txContext'> {
    const { decoded } = log
    const { pathId, transferId, to, amount, sourcePool, hops } = decoded

    return {
      pathId,
      claimId: transferId,
      to,
      amount,
      sourcePool,
      hops
    }
  }

  #formatTransferBondedLog (log: DecodedLogWithContext<TransferBonded>): Omit<IBondedRailsTransfer, 'txContext'> {
    const { decoded } = log
    const { pathId, claimId } = decoded

    return {
      pathId,
      claimId
    }
  }
}
