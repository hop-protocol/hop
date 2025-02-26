import { StateMachine } from '#state-machine/index.js'
import { CCTPSDK } from '../sdk/CCTPSDK.js'
import {
  type ISentCCTPMessage,
  type ICCTPMessage,
  CCTPMessageState
} from './types.js'

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

  protected override getTransitionState(state: CCTPMessageState): CCTPMessageState {
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
    const { sourceChainId, txContext } = value

    const attestationAvailableTimestampMs = CCTPSDK.attestationAvailableTimestampMs(sourceChainId)
    // Add a buffer to allow the transaction to be processed by the relayer
    const bufferMs = 60_000

    const expectedRelayTimeMs =
      txContext.timestampMs +
      attestationAvailableTimestampMs +
      bufferMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }
}
