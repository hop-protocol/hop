import { getChain } from '@hop-protocol/sdk'
import { StateMachine } from '#state-machine/index.js'
import { CCTPSDK } from '../sdk/CCTPSDK.js'
import {
  type ISentCCTPMessage,
  type ICCTPMessage,
  CCTPMessageState
} from './types.js'
import { FINALITY_TIME_MS } from '#constants/index.js'

export class CCTPStateMachine extends StateMachine<CCTPMessageState, ICCTPMessage> {

  /**
   * Implementation
   */

  protected override getStates(): CCTPMessageState[] {
    return Object.values(CCTPMessageState)
  }

  protected override getItemId(value: ICCTPMessage): string {
    return `${value.sourceChainId}:${value.messageNonce}`
  }

  protected override shouldAttemptTransition(state: CCTPMessageState, value: ICCTPMessage): boolean {
    switch (state) {
      case CCTPMessageState.Sent:
        return this.#shouldSendBeFinalized(value as ISentCCTPMessage)
      default:
        throw new Error('Invalid state')
    }
  }

  protected override getTransitionState(state: CCTPMessageState, value: ICCTPMessage): CCTPMessageState {
    switch (state) {
      case CCTPMessageState.Sent:
        return CCTPMessageState.Relayed
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * FSM Utils
   */

  #shouldSendBeFinalized(value: ISentCCTPMessage): boolean {
    // A relay can be finalized if enough time has passed for the message attestation to become available
    // and the destination chain has finalized the relay.
    const { sourceChainId, destinationChainId, txContext } = value

    const attestationAvailableTimestampMs = CCTPSDK.attestationAvailableTimestampMs(sourceChainId)
    const destinationChainSlug = getChain(destinationChainId).slug
    // This value is not terribly useful if threshold finality is enabled (default).
    // When it is not enabled, the check must wait for finality of the chain.
    // Since there are no state transitions after this one, there is no need to optimize
    // this value.
    const destChainFinalityTimeMs = FINALITY_TIME_MS[destinationChainSlug]
    // Add a buffer to allow the transaction to be processed by the relayer
    const bufferMs = 60_000

    const expectedRelayTimeMs =
      txContext.timestampMs +
      attestationAvailableTimestampMs +
      destChainFinalityTimeMs +
      bufferMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }
}
