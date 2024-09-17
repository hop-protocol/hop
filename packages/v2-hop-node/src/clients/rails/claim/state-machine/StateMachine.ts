import { getChain } from '@hop-protocol/sdk'
import { StateMachine } from '#state-machine/index.js'
import {
  type ISentRailsClaim,
  type IPostedRailsClaim,
  type IRailsClaim,
  RailsClaimState
} from './types.js'
import { FINALITY_TIME_MS } from '#constants/index.js'
import { getPathFromPathId } from '../../utils.js'

export class RailsClaimStateMachine extends StateMachine<RailsClaimState, IRailsClaim> {

  /**
   * Implementation
   */

  protected override getStates(): RailsClaimState[] {
    return Object.values(RailsClaimState)
  }

  protected override getItemId(value: IRailsClaim): string {
    return value.transferId
  }

  protected override shouldAttemptTransition(state: RailsClaimState, value: IRailsClaim): boolean {
    switch (state) {
      case RailsClaimState.Sent:
        return this.#shouldSendBeFinalized(value as ISentRailsClaim)
      case RailsClaimState.Posted:
        return this.#shouldPostBeFinalized(value as IPostedRailsClaim)
      default:
        throw new Error('Invalid state')
    }
  }

  protected override getTransitionState(state: RailsClaimState): RailsClaimState {
    switch (state) {
      case RailsClaimState.Sent:
        return RailsClaimState.Posted
      case RailsClaimState.Posted: {
        return RailsClaimState.Confirmed
      }
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #shouldSendBeFinalized(value: ISentRailsClaim): boolean {
    // A post can be finalized if enough time has passed for the post to
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
      destChainFinalityTimeMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }

  #shouldPostBeFinalized(value: IPostedRailsClaim): boolean {
    // TODO: Implement this -- it should be a function of the exit time of the source
    // since this is sent with the send
    return true
  }
}
