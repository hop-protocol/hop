import { RailsEventName } from '../../types.js'
import { DataAdapter } from '#state-machine/index.js'
import { type IRailsClaim, RailsClaimState } from './types.js'
import type { DecodedLogWithContext } from '#types/index.js'

export class RailsClaimDataAdapter extends DataAdapter<RailsClaimState, IRailsClaim, RailsEventName> {

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
      case RailsEventName.ClaimConfirmed:
        return RailsClaimState.Confirmed
      default:
        throw new Error('Invalid event name')
    }
  }

  protected override getEventNameFromState (state: RailsClaimState): RailsEventName {
    switch (state) {
      case RailsClaimState.Sent:
        return RailsEventName.TransferSent
      case RailsClaimState.Posted:
        return RailsEventName.ClaimPosted
      case RailsClaimState.Confirmed:
        return RailsEventName.ClaimConfirmed
      default:
        throw new Error('Invalid state')
    }
  }
}
