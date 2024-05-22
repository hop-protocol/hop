import wallets from '#wallets/index.js'
import type { ChainSlug } from '@hop-protocol/sdk'
import { getChain } from '@hop-protocol/sdk'
import { FSM } from '../fsm/FSM.js'
import { Message } from './Message.js'
import { getFinalityTimeFromChainIdMs } from './utils.js'
import { poll } from '../utils.js'
import { TransitionDataProvider } from './transitionData/TransitionDataProvider.js'

interface ISentMessage {
  messageNonce: number
  message: string
  sourceChainId: string
  destinationChainId: string
  sentTxHash: string
  sentTimestampMs: number
}

interface IRelayedMessage {
  relayTransactionHash: string
  relayTimestampMs: number
}

export type IMessage = ISentMessage & IRelayedMessage

// TODO: I should be able to not need the string after, but that is what is used for db index so maybe i do?
export enum MessageState {
  Sent = 'sent',
  Relayed = 'relayed'
}

// TODO: Handle inflight transactions on restart
export class MessageManager extends FSM<MessageState, IMessage> {
  // TODO: Turn into DB and persist
  readonly #inFlightTxCache: Set<string> = new Set()
  readonly #pollIntervalMs: number = 60_000

  constructor (chains: ChainSlug[]) {
    super(
      [MessageState.Sent, MessageState.Relayed],
      'MessageManager',
      new TransitionDataProvider(chains)
    )
    this.#startPollers()
  }

  #startPollers (): void {
    poll(this.#checkRelay, this.#pollIntervalMs)
  }

  #checkRelay = async (): Promise<void> => {
    if (!this.isFSMInitialized) return

    for await (const value of this.#getRelayableMessages()) {
      const { message, destinationChainId } = value as IMessage
      await this.#relayMessage(message, destinationChainId)
    }
  }

  async *#getRelayableMessages (): AsyncIterable<ISentMessage> {
    for await (const [, value] of this.getItemsInState(MessageState.Sent)) {
      const canRelay = await this.#canRelayMessage(value as IMessage)
      if (!canRelay) continue

      yield value as ISentMessage
    }
  }

  async #canRelayMessage (value: ISentMessage): Promise<boolean> {
    const { sourceChainId, sentTimestampMs } = value as IMessage
    const chainFinalityTimeMs = getFinalityTimeFromChainIdMs(sourceChainId)
    const finalityTimestampOk = sentTimestampMs + chainFinalityTimeMs < Date.now()

    return (
      !finalityTimestampOk
    )
  }

  async #relayMessage (message: string, destinationChainId: string): Promise<void> {
    const chainSlug = getChain(destinationChainId).slug
    const wallet = wallets.get(chainSlug)

    try {
      const attestation = await Message.fetchAttestation(message)

      this.#inFlightTxCache.add(attestation)
      await Message.relayMessage(wallet, message, attestation)
    } catch (err) {
      // TODO: better err handling
      // error={"reason":"execution reverted: Nonce already used"
      // Also handle attestation failure
      console.log('Relay failed', err)
    }
  }

  /**
   * State transition
   */

  isTransitionReady (state: MessageState, value: IMessage): boolean {
    switch (state) {
      case MessageState.Sent:
        return this.#isSent(value as ISentMessage)
      case MessageState.Relayed:
        return this.#isRelayed(value as IRelayedMessage)
    }
  }

  #isSent (value: ISentMessage): boolean {
    return true
  }

  #isRelayed (value: IRelayedMessage): boolean {
    const { relayTimestampMs, destinationChainId } = value as IMessage
    const chainFinalityTimeMs = getFinalityTimeFromChainIdMs(destinationChainId)
    const finalityTimestampOk = relayTimestampMs + chainFinalityTimeMs < Date.now()

    return (
      finalityTimestampOk
    )
  }
}
