import { DataAdapter } from '#state-machine/index.js'
import {
  type TransferSent,
  type ClaimPosted,
  RailsEventName,
  getComputedNextHopsHash,
  getRailsPathAddress
} from '../../RailsSDKWrapper.js'
import {
  type IRailsClaim,
  type ISentRailsClaim,
  type IPostedRailsClaim,
  RailsClaimEventName,
  RailsClaimState
} from './types.js'
import { getCounterpartChainIdForPathId } from '../../utils.js'
import type { DecodedLogWithContext, EventContext } from '#types/index.js'

export class RailsClaimDataAdapter extends DataAdapter<RailsClaimState, IRailsClaim, RailsEventName> {

  protected isValidEventName(eventName: RailsEventName | string): eventName is RailsEventName {
    return Object.values(RailsClaimEventName).includes(eventName as RailsClaimEventName)
  }

  protected override formatDecodedLog (log: DecodedLogWithContext): IRailsClaim {
    const { eventName } = log.context
    switch (eventName) {
      case RailsEventName.TransferSent:
        return this.#formatTransferSentLog(log as DecodedLogWithContext<TransferSent>) as IRailsClaim
      case RailsEventName.ClaimPosted:
        return this.#formatClaimPostedLog(log as DecodedLogWithContext<ClaimPosted>) as IRailsClaim
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override getStateFromEventName (eventName: string): RailsClaimState {
    switch (eventName) {
      case RailsEventName.TransferSent:
        return RailsClaimState.Sent
      case RailsEventName.ClaimPosted:
        return RailsClaimState.Posted
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override async getEventContextFromState (state: RailsClaimState, value: IRailsClaim): Promise<EventContext<RailsEventName>> {
    const { pathId, txContext } = value
    const { chainId } = txContext
    const counterpartChainId = getCounterpartChainIdForPathId(chainId, pathId)

    switch (state) {
      case RailsClaimState.Sent: {
        const eventAddress = await getRailsPathAddress(pathId, chainId)
        return {
          eventChainId: chainId,
          eventAddress,
          eventName: RailsEventName.TransferSent
        }
      }
      case RailsClaimState.Posted: {
        const eventAddress = await getRailsPathAddress(pathId, counterpartChainId)
        return {
          eventChainId: counterpartChainId,
          eventAddress,
          eventName: RailsEventName.ClaimPosted
        }
      }
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #formatTransferSentLog (log: DecodedLogWithContext<TransferSent>): Omit<ISentRailsClaim, 'txContext'> {
    const { decoded } = log
    const { pathId, transferId, to, amount, sourcePool, hops } = decoded

    if (
      hops.length === 0 ||
      typeof hops?.[0] === 'undefined'
    ) {
      throw new Error('Invalid hops')
    }

    // TODO: is this supposed to be hops[0]?
    const { maxBonderFee, attestedClaimId } = hops[0]
    const nextHopsHash = getComputedNextHopsHash(hops)

    return {
      claimId: transferId,
      to,
      amount,
      sourcePool,
      sourceTotalFraudulent,
      hops,
      maxBonderFee,
      attestedClaimId,
      nextHopsHash
    }
  }

  #formatClaimPushedLog(log: DecodedLogWithContext<ClaimPushed>): Omit<IPushedRailsClaim, 'txContext'> {
    const { decoded } = log
    const { pathId, claimId } = decoded

    return {
      pathId,
      claimId
    }
  }

  // #formatClaimRemovedLog(log: DecodedLogWithContext<ClaimRemoved>): Omit<IRemovedRailsClaim, 'txContext'> {
  //   const { decoded } = log
  //   const { pathId, claimId } = decoded

  //   return {
  //     pathId,
  //     claimId
  //   }
  // }

  // #formatClaimReaddedLog(log: DecodedLogWithContext<ClaimReadded>): Omit<IReaddedRailsClaim, 'txContext'> {
  //   const { decoded } = log
  //   const { pathId, claimId } = decoded

  //   return {
  //     pathId,
  //     claimId
  //   }
  // }
}
