import { getChain } from '@hop-protocol/sdk'
import { StateMachine } from '#state-machine/index.js'
import {
  type ISentRailsClaim,
  type IPushedRailsClaim,
  type IRailsClaim,
  RailsClaimMethodName,
  RailsClaimState
} from './types.js'
import { FINALITY_TIME_MS } from '#constants/index.js'
import { getCounterpartChainIdForPathId } from '../../utils.js'

export class RailsClaimStateMachine extends StateMachine<RailsClaimState, IRailsClaim, RailsClaimMethodName> {

  /**
   * Implementation
   */

  protected override getStates(): RailsClaimState[] {
    return Object.values(RailsClaimState)
  }

  protected override getItemId(value: IRailsClaim): string {
    return value.claimId
  }

  protected override getRelayChainId(state: RailsClaimState, value: IRailsClaim): string {
    const { pathId, txContext } = value
    const { chainId } = txContext
    const counterpartChainId = getCounterpartChainIdForPathId(chainId, pathId)

    switch (state) {
      case RailsClaimState.Sent:
        return counterpartChainId
      default:
        throw new Error('Invalid state')
    }
  }

  protected override getRelayTxMethodFromState(state: RailsClaimState): RailsClaimMethodName {
    switch (state) {
      case RailsClaimState.Pushed:
        return RailsClaimMethodName.PushClaim
      // case RailsClaimState.RemoveClaim:
      //   return RailsClaimMethodName.RemoveClaim
      default:
        throw new Error('Invalid state')
    }
  }

  protected override shouldAttemptTransition(state: RailsClaimState, value: IRailsClaim): boolean {
    switch (state) {
      case RailsClaimState.Sent:
        return this.#shouldSentTransferBeFinalized(value as ISentRailsClaim)
      case RailsClaimState.Pushed:
        return this.#shouldPushBeFinalized(value as IPushedRailsClaim)
      default:
        throw new Error('Invalid state')
    }
  }

  protected override getTransitionState(state: RailsClaimState): RailsClaimState {
    switch (state) {
      case RailsClaimState.Sent:
        return RailsClaimState.Pushed
      // case RailsClaimState.Pushed: {
      //   // TODO: Should be either confirmed or removed
      //   return RailsClaimState.Pushed
      //   // return RailsClaimState.Confirmed
      // }
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #shouldSentTransferBeFinalized(value: ISentRailsClaim): boolean {
    const { txContext } = value
    const { timestampMs, chainId } = txContext

    const srcChainSlug = getChain(chainId).slug
    const srcChainFinalityTimeMs = FINALITY_TIME_MS[srcChainSlug]

      const expectedRelayTimeMs =
        timestampMs +
        srcChainFinalityTimeMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }

  #shouldPushBeFinalized(value: IPushedRailsClaim): boolean {
    // TODO: Implement this -- it should be a function of the exit time of the source
    // since this is sent with the send
    return true
  }
}
