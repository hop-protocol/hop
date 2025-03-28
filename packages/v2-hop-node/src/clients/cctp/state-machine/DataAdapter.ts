import {
  CCTPEventName,
  CCTPSDK,
  type HopCCTPTransferSentDecodedWithMessage,
  type HopCCTPTransferReceivedDecoded
} from '../CCTPSDKWrapper.js'
import { DataAdapter } from '#state-machine/index.js'
import type { DecodedLogWithContext, EventContext } from '#types/index.js'
import {
  type ISentCCTPMessage,
  type IRelayedCCTPMessage,
  type ICCTPMessage,
  CCTPMessageState
} from './types.js'

export class CCTPDataAdapter extends DataAdapter<CCTPMessageState, ICCTPMessage, CCTPEventName> {

  protected isValidEventName(eventName: CCTPEventName | string): eventName is CCTPEventName{
    return Object.values(CCTPEventName).includes(eventName as CCTPEventName)
  }

  protected override formatDecodedLog (log: DecodedLogWithContext): ICCTPMessage {
    const { eventName } = log.context
    switch (eventName) {
      case CCTPEventName.CCTPTransferSent:
        return this.#formatTransferSentLog(log as DecodedLogWithContext<HopCCTPTransferSentDecodedWithMessage>) as ICCTPMessage
      case CCTPEventName.MessageReceived:
        return this.#formatRelayedLog(log as DecodedLogWithContext<HopCCTPTransferReceivedDecoded>) as ICCTPMessage
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override parseStateMachineData(state: CCTPMessageState, value: ICCTPMessage): any {
    switch (state) {
      case CCTPMessageState.Sent: {
        const { messageNonce, destinationChainId, ...unmodifiedValues } = value
        return {
          cctpNonce: messageNonce,
          chainId: destinationChainId,
          ...unmodifiedValues
        }
      }
      case CCTPMessageState.Relayed: {
        const { messageNonce, sourceChainId, ...unmodifiedValues } = value
        return {
          nonce: messageNonce,
          sourceDomain: CCTPSDK.getDomainFromChainId(sourceChainId),
          ...unmodifiedValues
        }
      }
      default:
        throw new Error('Invalid state')
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

  protected override async getEventContextFromState (state: CCTPMessageState, value: ICCTPMessage): Promise<EventContext<CCTPEventName>> {
    switch (state) {
      case CCTPMessageState.Sent: {
        const eventAddress = (CCTPSDK.getMessageSentEventFilter(value.sourceChainId)).address
        return {
          eventChainId: value.sourceChainId,
          eventAddress,
          eventName: CCTPEventName.CCTPTransferSent,
        }
      }
      case CCTPMessageState.Relayed: {
        const eventAddress = (CCTPSDK.getMessageSentEventFilter(value.destinationChainId)).address
        return {
          eventChainId: value.destinationChainId,
          eventAddress,
          eventName: CCTPEventName.MessageReceived,
        }
      }
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #formatTransferSentLog (log: DecodedLogWithContext<HopCCTPTransferSentDecodedWithMessage>): Omit<ISentCCTPMessage, 'txContext'> {
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

  #formatRelayedLog (log: DecodedLogWithContext<HopCCTPTransferReceivedDecoded>): Omit<IRelayedCCTPMessage, 'txContext'> {
    const { decoded, context } = log
    const { nonce, sourceDomain } = decoded

    return {
      messageNonce: nonce,
      sourceChainId: CCTPSDK.getChainIdFromDomain(sourceDomain),
      destinationChainId: context.chainId
    }
  }
}
