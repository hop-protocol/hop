import { DataAdapter } from '#state-machine/index.js'
import { RailsEventName } from '../../RailsSDKWrapper.js'
import { type IRailsClaim, RailsClaimEventName, RailsClaimState } from './types.js'
import { getCounterpartChainIdForPathId } from '../../utils.js'
import type { DecodedLogWithContext } from '#types/index.js'

export class RailsClaimDataAdapter extends DataAdapter<RailsClaimState, IRailsClaim, RailsEventName> {

  protected isValidEventName(eventName: RailsEventName | string): eventName is RailsEventName {
    return Object.values(RailsClaimEventName).includes(eventName as RailsClaimEventName)
  }

  protected override formatDecodedLog (log: DecodedLogWithContext): IRailsClaim {
    // Rails logs do not need additional decoding since the onchain log format
    // matches the format that the state machine expects.
    return log.decoded as IRailsClaim
  }

  protected override getStateFromEventName (eventName: string): RailsClaimState {
    switch (eventName) {
      case RailsEventName.TransferSent:
        return RailsClaimState.Sent
      case RailsEventName.ClaimPosted:
        return RailsClaimState.Posted
      case RailsEventName.ClaimRemoved:
        return RailsClaimState.Removed
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
      case RailsClaimState.Posted:
        return RailsEventName.ClaimPosted
      case RailsClaimState.Removed:
        return RailsEventName.ClaimRemoved
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
      case RailsClaimState.Posted:
        return counterpartChainId
      case RailsClaimState.Removed:
        return counterpartChainId
      // case RailsClaimState.Confirmed:
      //   return counterpartChainId
      default:
        throw new Error('Invalid state')
    }
  }
}
