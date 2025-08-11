import { DataAdapter } from '#state-machine/index.js'
import {
  type IBondedRailsClaim,
  type IRailsTransfer,
  type ISentRailsTransfer,
  RailsTransferEventName,
  RailsTransferState
} from './types.js'
import type { DecodedLogWithContext, EventContext } from '#types/index.js'
import { getPath } from '@hop-protocol/v2-sdk'
import { RailsBonderEventName } from '../../types.js'

export class RailsTransferDataAdapter extends DataAdapter<RailsTransferState, IRailsTransfer, RailsBonderEventName> {

  protected isValidEventName(eventName: RailsBonderEventName | string): eventName is RailsBonderEventName {
    return Object.values(RailsTransferEventName).includes(eventName as RailsTransferEventName)
  }

  protected override formatDecodedLog (log: DecodedLogWithContext): IRailsTransfer {
    const { eventName } = log.context
    switch (eventName) {
      case RailsBonderEventName.TransferSent:
        return this.#formatTransferSentLog(log as DecodedLogWithContext<TransferSent>) as IRailsTransfer
      case RailsBonderEventName.ClaimBonded:
        return this.#formatClaimBondedLog(log as DecodedLogWithContext<ClaimBonded>) as IRailsTransfer
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override getStateFromEventName (eventName: string): RailsTransferState {
    switch (eventName) {
      case RailsBonderEventName.TransferSent:
        return RailsTransferState.Sent
      case RailsBonderEventName.ClaimBonded:
        return RailsTransferState.Bonded
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override async getEventContextFromState (state: RailsTransferState, value: IRailsTransfer): Promise<EventContext<RailsBonderEventName>> {
    const { pathId, txContext } = value
    const { chainId } = txContext
    const counterpartChainId = getPath(pathId).getCounterpartChain(chainId).chainId

    switch (state) {
      case RailsTransferState.Sent: {
        const eventAddress = await getRailsPathAddress(pathId, chainId)
        return {
          eventChainId: chainId,
          eventAddress,
          eventName: RailsBonderEventName.TransferSent,
        }
      }
      case RailsTransferState.Bonded: {
        const eventAddress = await getRailsPathAddress(pathId, counterpartChainId)
        return {
          eventChainId: counterpartChainId,
          eventAddress,
          eventName: RailsBonderEventName.ClaimBonded,
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
    const { decoded, address, context } = log
    const { chainId } = context
    const { transferId, to, amount, sourcePool, sourceTotalFraudulent, hops } = decoded
    const pathId = RailsGateway.getPathCache(chainId, address)

    return {
      pathId,
      claimId: transferId,
      to,
      amount,
      sourcePool,
      sourceTotalFraudulent,
      hops
    }
  }

  #formatClaimBondedLog (log: DecodedLogWithContext<ClaimBonded>): Omit<IBondedRailsClaim, 'txContext'> {
    const { decoded, address, context } = log
    const { chainId } = context
    const { claimId, to, amount, bonderFee } = decoded
    const pathId = RailsGateway.getPathCache(chainId, address)

    return {
      pathId,
      claimId,
      to,
      amount,
      bonderFee
    }
  }
}
