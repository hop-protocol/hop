import {
  CCTPEventName,
  CCTPSDK,
  type HopCCTPTransferSentDecodedWithMessage,
  type HopCCTPTransferReceivedDecoded
} from '../CCTPSDKWrapper.js'
import { DataAdapter } from '#state-machine/index.js'
import type { DecodedLogWithContext } from '#types/index.js'
import {
  type ISentCCTPMessage,
  type IRelayedCCTPMessage,
  type ICCTPMessage,
  CCTPMessageState
} from './types.js'

// TODO: I shouldn't have to do this
type ISentCCTPMessageWithoutContext = Omit<ISentCCTPMessage, 'txContext'>
type IRelayedCCTPMessageWithoutContext = Omit<IRelayedCCTPMessage, 'txContext'>

export class CCTPDataAdapter extends DataAdapter<CCTPMessageState, ICCTPMessage, CCTPEventName> {

  protected override formatDecodedLog (log: DecodedLogWithContext): ICCTPMessage {
    const { eventName } = log.context
    switch (eventName) {
      case CCTPEventName.CCTPTransferSent:
        // TODO: Fix this when abstract class return type is fixed
        return this.#formatTransferSentLog(log as DecodedLogWithContext<HopCCTPTransferSentDecodedWithMessage>) as unknown as ICCTPMessage
      case CCTPEventName.MessageReceived:
        // TODO: Fix this when abstract class return type is fixed
        return this.#formatRelayedLog(log as DecodedLogWithContext<HopCCTPTransferReceivedDecoded>) as unknown as ICCTPMessage
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override getStateFromEventName (eventName: string): CCTPMessageState {
    switch (eventName) {
      case CCTPEventName.CCTPTransferSent:
        return CCTPMessageState.Sent
      case CCTPEventName.MessageReceived:
        return CCTPMessageState.Relayed
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override getEventNameFromState (state: CCTPMessageState): CCTPEventName {
    switch (state) {
      case CCTPMessageState.Sent:
        return CCTPEventName.CCTPTransferSent
      case CCTPMessageState.Relayed:
        return CCTPEventName.MessageReceived
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #formatTransferSentLog (log: DecodedLogWithContext<HopCCTPTransferSentDecodedWithMessage>): ISentCCTPMessageWithoutContext {
    const { context, decoded } = log
    const { chainId } = context
    const { message, cctpNonce, chainId: destinationChainId } = decoded

    return {
      message,
      messageNonce: cctpNonce,
      sourceChainId: chainId,
      destinationChainId
    }
  }

  #formatRelayedLog (log: DecodedLogWithContext<HopCCTPTransferReceivedDecoded>): IRelayedCCTPMessageWithoutContext {
    const { decoded, context } = log
    const { nonce, sourceDomain } = decoded

    return {
      messageNonce: nonce,
      sourceChainId: CCTPSDK.getChainIdFromDomain(sourceDomain),
      destinationChainId: context.chainId
    }
  }
}
