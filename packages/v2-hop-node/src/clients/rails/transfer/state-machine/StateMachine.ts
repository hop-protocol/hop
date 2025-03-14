import { getChain } from '@hop-protocol/sdk'
import { StateMachine } from '#state-machine/index.js'
import {
  type ISentRailsTransfer,
  type IRailsTransfer,
  RailsTransferMethodName,
  RailsTransferState
} from './types.js'
import { FINALITY_TIME_MS } from '#constants/index.js'
import { getCounterpartChainIdForPathId } from '../../utils.js'

export class RailsTransferStateMachine extends StateMachine<RailsTransferState, IRailsTransfer, RailsTransferMethodName> {

  /**
   * Implementation
   */

  protected override getStates(): RailsTransferState[] {
    return Object.values(RailsTransferState)
  }

  protected override getItemId(value: IRailsTransfer): string {
    if ('claimId' in value) {
      return value.claimId
    }

    return value.transferId
  }

  protected override getRelayChainId(state: RailsTransferState, value: IRailsTransfer): string {
    const { pathId, txContext } = value
    const { chainId } = txContext
    const counterpartChainId = getCounterpartChainIdForPathId(chainId, pathId)

    switch (state) {
      case RailsTransferState.Sent:
        return counterpartChainId
      default:
        throw new Error('Invalid state')
    }
  }

  protected override getRelayTxMethodFromState(state: RailsTransferState): RailsTransferMethodName {
    switch (state) {
      case RailsTransferState.Sent:
        return RailsTransferMethodName.Bond
      default:
        throw new Error('Invalid state')
    }
  }

  protected override shouldAttemptTransition(state: RailsTransferState, value: IRailsTransfer): boolean {
    switch (state) {
      case RailsTransferState.Sent:
        return this.#shouldClaimPushBeFinalized(value as ISentRailsTransfer)
      default:
        throw new Error('Invalid state')
    }
  }

  protected override getTransitionState(state: RailsTransferState): RailsTransferState {
    switch (state) {
      case RailsTransferState.Sent:
        return RailsTransferState.Bonded
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #shouldClaimPushBeFinalized(value: ISentRailsTransfer): boolean {
    const { pathId, txContext } = value
    const { timestampMs, chainId } = txContext

    const srcChainSlug = getChain(chainId).slug
    const srcChainFinalityTimeMs = FINALITY_TIME_MS[srcChainSlug]

    const destChainId = getCounterpartChainIdForPathId(chainId, pathId)
    const destChainSlug = getChain(destChainId).slug
    const destChainFinalityTimeMs = FINALITY_TIME_MS[destChainSlug]

    const expectedRelayTimeMs =
      timestampMs +
      srcChainFinalityTimeMs +
      destChainFinalityTimeMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }
}
