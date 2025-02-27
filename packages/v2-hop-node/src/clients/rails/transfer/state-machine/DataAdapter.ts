import { DataAdapter } from '#state-machine/index.js'
import { getPathFromPathId } from '../../utils.js'
import { RailsEventName } from '../../RailsSDKWrapper.js'
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
        throw new Error(`Invalid event name: ${eventName}`)
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

  protected override getEventChainIdForState (state: RailsTransferState, value: IRailsTransfer): string {
    const path = getPathFromPathId(value.pathId)
    const { srcChainId, destChainId } = path
    switch (state) {
      case RailsTransferState.Sent:
        return srcChainId
      case RailsTransferState.Bonded:
        return destChainId
      default:
        throw new Error('Invalid state')
    }
  }
}
