import { RailsEventName } from '../../RailsSDKWrapper.js'
import { DataAdapter } from '#state-machine/index.js'
import { type IRailsTransfer, RailsTransferState } from './types.js'
import type { DecodedLogWithContext } from '#types/index.js'

export class RailsTransferDataAdapter extends DataAdapter<RailsTransferState, IRailsTransfer, RailsEventName> {
  protected override formatDecodedLog (log: DecodedLogWithContext): IRailsTransfer {
    // Rails logs do not need additional decoding since the onchain log format
    // matches the format that the state machine expects.
    return log.decoded as IRailsTransfer
  }

  protected override getStateFromEventName (eventName: string): RailsTransferState {
    switch (eventName) {
      case RailsEventName.TransferSent:
        return RailsTransferState.Sent
      case RailsEventName.TransferBonded:
        return RailsTransferState.Bonded
      default:
        throw new Error('Invalid event name')
    }
  }

  protected override getEventNameFromState (state: RailsTransferState): RailsEventName {
    switch (state) {
      case RailsTransferState.Sent:
        return RailsEventName.TransferSent
      case RailsTransferState.Bonded:
        return RailsEventName.TransferBonded
      default:
        throw new Error('Invalid state')
    }
  }
}
