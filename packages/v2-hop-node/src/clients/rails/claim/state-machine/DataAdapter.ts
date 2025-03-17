import { DataAdapter } from '#state-machine/index.js'
import {
  type TransferSent,
  type ClaimPushed,
  // type ClaimRemoved,
  // type ClaimReadded,
  RailsEventName,
  getComputedNextHopsHash
} from '../../RailsSDKWrapper.js'
import {
  type IRailsClaim,
  type ISentRailsClaim,
  type IPushedRailsClaim,
  // type IRemovedRailsClaim,
  // type IReaddedRailsClaim,
  RailsClaimEventName,
  RailsClaimState
} from './types.js'
import { getCounterpartChainIdForPathId } from '../../utils.js'
import type { DecodedLogWithContext } from '#types/index.js'

export class RailsClaimDataAdapter extends DataAdapter<RailsClaimState, IRailsClaim, RailsEventName> {

  protected isValidEventName(eventName: RailsEventName | string): eventName is RailsEventName {
    return Object.values(RailsClaimEventName).includes(eventName as RailsClaimEventName)
  }

  protected override formatDecodedLog (log: DecodedLogWithContext): IRailsClaim {
    const { eventName } = log.context
    switch (eventName) {
      case RailsEventName.TransferSent:
        return this.#formatTransferSentLog(log as DecodedLogWithContext<TransferSent>) as IRailsClaim
      case RailsEventName.ClaimPushed:
        return this.#formatClaimPushedLog(log as DecodedLogWithContext<ClaimPushed>) as IRailsClaim
      // case RailsEventName.ClaimReadded:
      //   return this.#formatClaimRemovedLog(log as DecodedLogWithContext<ClaimRemoved>) as IRailsClaim
      // case RailsEventName.ClaimRemoved:
      //   return this.#formatClaimReaddedLog(log as DecodedLogWithContext<ClaimReadded>) as IRailsClaim
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override getStateFromEventName (eventName: string): RailsClaimState {
    switch (eventName) {
      case RailsEventName.TransferSent:
        return RailsClaimState.Sent
      case RailsEventName.ClaimPushed:
        return RailsClaimState.Pushed
      // case RailsEventName.ClaimRemoved:
      //   return RailsClaimState.Removed
      // case RailsEventName.ClaimConfirmed:
      //   return RailsClaimState.Confirmed
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override getEventNameFromState (state: RailsClaimState): RailsEventName {
    switch (state) {
      case RailsClaimState.Sent:
        return RailsEventName.TransferSent
      case RailsClaimState.Pushed:
        return RailsEventName.ClaimPushed
      // case RailsClaimState.Removed:
      //   return RailsEventName.ClaimRemoved
      // case RailsClaimState.Confirmed:
      //   return RailsEventName.ClaimConfirmed
      default:
        throw new Error('Invalid state')
    }
  }

  protected override getEventChainIdForState (state: RailsClaimState, value: IRailsClaim): string {
    const { pathId, txContext } = value
    const { chainId } = txContext
    const counterpartChainId = getCounterpartChainIdForPathId(chainId, pathId)

    switch (state) {
      case RailsClaimState.Sent:
        return chainId
      case RailsClaimState.Pushed:
        return counterpartChainId
      // case RailsClaimState.Removed:
      //   return counterpartChainId
      // case RailsClaimState.Confirmed:
      //   return counterpartChainId
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
      pathId,
      claimId: transferId,
      to,
      amount,
      sourcePool,
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
