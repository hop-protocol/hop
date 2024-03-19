import chainIdToSlug from 'src/utils/chainIdToSlug'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { FSMPoller } from '../fsm/FSMPoller'
import { Message } from './Message'
import { getFinalityTimeFromChainIdMs } from './utils'

interface ISentMessage {
  // TODO: should nonce be removed since it is already the key?
  messageNonce: number
  message: string
  sourceChainId: number
  destinationChainId: number
  sentTxHash: string
  sentTimestampMs: number
}

interface IAttestedMessage {
  attestation: string
}

interface IRelayedMessage {
  relayTransactionHash: string
  relayTimestampMs: number
}

export type IMessage = ISentMessage | IAttestedMessage | IRelayedMessage

export enum MessageState {
  Sent = 'sent',
  Attested = 'attested',
  Relayed = 'relayed'
}

const StateTransitionMap: Record<MessageState, MessageState | null> = {
  [MessageState.Sent]: MessageState.Attested,
  [MessageState.Attested]: MessageState.Relayed,
  [MessageState.Relayed]: null
}

// TODO: RM
const RELAY_CACHE: Set<number> = new Set()

// TODO: Handle inflight transactions on restart
export class MessageManager extends FSMPoller<MessageState, IMessage> {
  readonly #inFlightTxCache: Set<string> = new Set()

  constructor (chains: Chain[]) {
    super('MessageManager', StateTransitionMap, chains)
  }

  // TODO: I don't love this
  getStateCreationKey (value: IMessage): string {
    const { messageNonce } = value as ISentMessage
    return messageNonce.toString()
  }

  /**
   * Preconditions
   */

  isStateTransitionPreconditionMet(state: MessageState, messageNonce: string, value: IMessage): boolean {
    switch (state) {
      case MessageState.Sent:
        return this.#isSentStateTransactionPreconditionMet(messageNonce, value as ISentMessage)
      case MessageState.Attested:
        return this.#isAttestedStateTransactionPreconditionMet(messageNonce,value as IAttestedMessage)
      case MessageState.Relayed:
        return this.#isRelayedStateTransactionPreconditionMet(messageNonce, value as IRelayedMessage)
    }
  }

  #isSentStateTransactionPreconditionMet (messageNonce: string, value: ISentMessage): boolean {
    const { sourceChainId, sentTimestampMs } = value
    const chainFinalityTimeMs = getFinalityTimeFromChainIdMs(sourceChainId)
    const finalityTimestampOk = sentTimestampMs + chainFinalityTimeMs < Date.now()

    return (
      finalityTimestampOk
    )
  }

  #isAttestedStateTransactionPreconditionMet (messageNonce: string, value: IAttestedMessage): boolean {
    const cacheKey = this.#getCacheKey(MessageState.Attested, messageNonce)
    const isTxInFlight = this.#inFlightTxCache.has(cacheKey)

    // TODO: Introduce inflight timestamp for retry logic
    // though we used this in v1 for server restart and that doesn't matter if we have a cache....
    const inFlightTxTimestampOk = true
    
    return (
      !isTxInFlight &&
      inFlightTxTimestampOk
    )
  }

  #isRelayedStateTransactionPreconditionMet (messageNonce: string, value: IRelayedMessage): boolean {
    // isPrecondition methods need access to all data at given state, so we need to fetch the message data
    // There is probably a better way to type this
    const { relayTimestampMs, destinationChainId } = value as ISentMessage & IAttestedMessage & IRelayedMessage
    const chainFinalityTimeMs = getFinalityTimeFromChainIdMs(destinationChainId)
    const finalityTimestampOk = relayTimestampMs + chainFinalityTimeMs < Date.now()

    return (
      finalityTimestampOk
    )
  }

  /**
   * Actions
   */

  isStateActionPreconditionMet (state: MessageState, messageNonce: string, value: IMessage): boolean {
    switch (state) {
      case MessageState.Sent:
        return this.#isSentStateActionPreconditionMet(messageNonce, value as ISentMessage)
      case MessageState.Attested:
        return this.#isAttestedStateActionPreconditionMet(messageNonce, value as IAttestedMessage)
      case MessageState.Relayed:
        return this.#isRelayedStateActionPreconditionMet(messageNonce, value as IRelayedMessage)
    }
  }

  #isSentStateActionPreconditionMet (messageNonce: string, value: ISentMessage): boolean {
    return true
  }

  #isAttestedStateActionPreconditionMet (messageNonce: string, value: IAttestedMessage): boolean {
    const cacheKey = this.#getCacheKey(MessageState.Attested, messageNonce)
    const isTxInFlightCache = this.#inFlightTxCache.has(cacheKey)

    return (
      !isTxInFlightCache
    )
  }

  #isRelayedStateActionPreconditionMet (messageNonce: string, value: IRelayedMessage): boolean {
    return true
  }

  /**
   * Other - hooks
   */

  handleStateExitHook (state: MessageState, messageNonce: string, value: IMessage): void {
    switch (state) {
      case MessageState.Sent:
        return this.#handleSentStateExitHook(messageNonce, value as ISentMessage)
      case MessageState.Attested:
        return this.#handleAttestedStateExitHook(messageNonce, value as IAttestedMessage)
      case MessageState.Relayed:
        return this.#handleRelayedStateExitHook(messageNonce, value as IRelayedMessage)
    }
  }

  #handleSentStateExitHook (messageNonce: string, value: ISentMessage): void {
    return
  }

  #handleAttestedStateExitHook (messageNonce: string, value: IAttestedMessage): void {
    const cacheKey = this.#getCacheKey(MessageState.Attested, messageNonce)
    this.#inFlightTxCache.delete(cacheKey)
    return
  }

  #handleRelayedStateExitHook (messageNonce: string, value: IRelayedMessage): void {
    return
  }

  /**
   * Actions
   */

  async performAction(state: MessageState, value: IMessage): Promise<void> {
    switch (state) {
      case MessageState.Sent:
        return this.#performSentStateAction(value)
      case MessageState.Attested:
        return this.#performAttestedStateAction(value)
      case MessageState.Relayed:
        return this.#performRelayedStateAction(value)
    }
  }

  async #performSentStateAction (value: IMessage): Promise<void> {
    return
  }

  async #performAttestedStateAction (value: IMessage): Promise<void> {
    // performAction methods need access to all data at given state, so we need to fetch the message data
    // There is probably a better way to type this
    const { messageNonce, message, attestation, destinationChainId } = value as ISentMessage & IAttestedMessage

    // TODO: RM Cache
    if (RELAY_CACHE.has(messageNonce)) {
      return
    }
    RELAY_CACHE.add(messageNonce)

    const chainSlug = chainIdToSlug(destinationChainId)
    const wallet = wallets.get(chainSlug)
    // TODO: better err handling
    // error={"reason":"execution reverted: Nonce already used"
    try {
      await Message.relayMessage(wallet, message, attestation)
    } catch (err) {
      console.log('Relay failed', err)
    }
  }

  async #performRelayedStateAction (value: IMessage): Promise<void> {
    return
  }

  /**
   * Utils
   */

  #getCacheKey (state: MessageState, messageNonce: string): string {
    return `${state}-${messageNonce}`
  }
}
