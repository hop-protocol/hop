import { getChain } from '@hop-protocol/sdk'
import { StateMachine } from '#state-machine/index.js'
import {
  type ISentRailsTransfer,
  type IPostedRailsTransfer,
  type IRailsTransfer,
  RailsTransferState
} from './types.js'
import { FINALITY_TIME_MS } from '#constants/index.js'
import { getPathFromPathId } from './utils.js'

export class RailsStateMachine extends StateMachine<RailsTransferState, IRailsTransfer> {

  /**
   * Implementation
   */

  protected override getItemId(value: IRailsTransfer): string {
    return value.transferId
  }

  protected override shouldAttemptTransition(state: RailsTransferState, value: IRailsTransfer): boolean {
    switch (state) {
      case RailsTransferState.Sent:
        return this.#isPostFinalized(value as ISentRailsTransfer)
      case RailsTransferState.Posted:
        return this.#shouldBondBeFinalized(value as IPostedRailsTransfer)
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * FSM Utils
   */

  #isPostFinalized(value: ISentRailsTransfer): boolean {
    // A post can be finalized if enough time has passed for the send to
    // be finalized on the source chain, for the bonder to post the claim,
    // and for the post to be finalized on the destination chain.
    const { pathId, sentTimestampMs } = value

    const { srcChainId, destChainId } = getPathFromPathId(pathId)
    const srcChainSlug = getChain(srcChainId).slug
    const srcChainFinalityTimeMs = FINALITY_TIME_MS[srcChainSlug]
    const destChainSlug = getChain(destChainId).slug
    const destChainFinalityTimeMs = FINALITY_TIME_MS[destChainSlug]

    const expectedRelayTimeMs =
      sentTimestampMs +
      srcChainFinalityTimeMs +
      destChainFinalityTimeMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }

  #shouldBondBeFinalized(value: IPostedRailsTransfer): boolean {
    // A bond can be finalized if enough time has passed for the post to
    // be finalized on its own chain, for the bonder to bond the claim,
    // and for the bond to be finalized on its own chain.
    const { pathId, postedTimestampMs } = value

    const { destChainId } = getPathFromPathId(pathId)
    const destChainSlug = getChain(destChainId).slug
    const destChainFinalityTimeMs = FINALITY_TIME_MS[destChainSlug]

    // We add the finality time twice because both the post and the claim
    // must be finalized and they exist on the same chain.
    const expectedRelayTimeMs =
      postedTimestampMs +
      destChainFinalityTimeMs +
      destChainFinalityTimeMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }
}
