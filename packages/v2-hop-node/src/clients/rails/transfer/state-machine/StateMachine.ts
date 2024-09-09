import { getChain } from '@hop-protocol/sdk'
import { StateMachine } from '#state-machine/index.js'
import {
  type ISentRailsTransfer,
  type IRailsTransfer,
  RailsTransferState
} from './types.js'
import { FINALITY_TIME_MS } from '#constants/index.js'
import { getPathFromPathId } from '../../utils.js'

export class RailsTransferStateMachine extends StateMachine<RailsTransferState, IRailsTransfer> {

  /**
   * Implementation
   */

  protected override getStates(): RailsTransferState[] {
    return Object.values(RailsTransferState)
  }

  protected override getItemId(value: IRailsTransfer): string {
    return value.transferId
  }

  protected override shouldAttemptTransition(state: RailsTransferState, value: IRailsTransfer): boolean {
    switch (state) {
      case RailsTransferState.Sent:
        return this.#shouldBondBeFinalized(value as ISentRailsTransfer)
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #shouldBondBeFinalized(value: ISentRailsTransfer): boolean {
    // A bond can be finalized if enough time has passed for the post to
    // be finalized on its own chain, for the bonder to bond the claim,
    // and for the bond to be finalized on its own chain.
    const { pathId, txContext } = value
    const { timestampMs } = txContext

    // TODO: Handle timing of post

    const { destChainId } = getPathFromPathId(pathId)
    const destChainSlug = getChain(destChainId).slug
    const destChainFinalityTimeMs = FINALITY_TIME_MS[destChainSlug]

    // We add the finality time twice because both the post and the claim
    // must be finalized and they exist on the same chain.
    const expectedRelayTimeMs =
      timestampMs +
      destChainFinalityTimeMs +
      destChainFinalityTimeMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }
}
