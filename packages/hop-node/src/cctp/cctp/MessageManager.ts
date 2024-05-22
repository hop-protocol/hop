import wallets from '#wallets/index.js'
import type { ChainSlug } from '@hop-protocol/sdk'
import { FSM } from '../fsm/FSM.js'
import { Message } from './Message.js'
import { getFinalityTimeFromChainIdMs } from './utils.js'
import { poll } from '../utils.js'
import { TransitionDataProvider } from './transitionData/TransitionDataProvider.js'

interface ISentMessage {
  messageNonce: number
  message: string
  sourceChainId: number
  destinationChainId: number
  sentTxHash: string
  sentTimestampMs: number
}

// TODO: Get rid of this state
// interface IAttestedMessage {
//   attestation: string
// }

interface IRelayedMessage {
  relayTransactionHash: string
  relayTimestampMs: number
}

export type IMessage = ISentMessage & IAttestedMessage & IRelayedMessage

// TODO: I should be able to not need the string after, but that is what is used for db index so maybe i do?
export enum MessageState {
  Sent = 'sent',
  Attested = 'attested',
  Relayed = 'relayed'
}

// TODO: Handle inflight transactions on restart
export class MessageManager extends FSM<MessageState, IMessage> {
  // TODO: Turn into DB and persist
  readonly #inFlightTxCache: Set<string> = new Set()
  readonly #pollIntervalMs: number = 60_000

  constructor (chains: ChainSlug[]) {
    super(
      'MessageManager',
      [MessageState.Sent, MessageState.Attested, MessageState.Relayed],
      new TransitionDataProvider(chains)
    )
    this.#startPollers()
  }

  // // Return the unique ID for each message
  // getId (value: IMessage): string {
  //   // TODO: Use different separator. With redundant chainId, the filtering of the db is messed up
  //   const { messageNonce, sourceChainId } = value as ISentMessage
  //   return messageNonce.toString() + '!!' + sourceChainId.toString()
  // }

  #startPollers (): void {
    poll(this.#checkRelay, this.#pollIntervalMs)
  }

  #checkRelay = async (): Promise<void> => {
    if (!this.isInitialSetupComplete()) return

    for await (const value of this.#getRelayableMessages()) {
      const { message, attestation, destinationChainId } = value as IMessage
      await this.#relayMessage(message, attestation, destinationChainId)
    }
  }

  async *#getRelayableMessages (): AsyncIterable<IAttestedMessage> {
    for await (const [, value] of this.getItemsInState(MessageState.Attested)) {
      const canRelay = this.#canRelayMessage(value as IAttestedMessage)
      if (!canRelay) continue

      yield value as IAttestedMessage
    }
  }

  #canRelayMessage (value: IAttestedMessage): boolean {
    const hasRelayBeenSent = this.#inFlightTxCache.has(value.attestation)

    return (
      !hasRelayBeenSent
    )
  }

  async #relayMessage (message: string, attestation: string, destinationChainId: number): Promise<void> {
    const chainSlug = chainIdToSlug(destinationChainId)
    const wallet = wallets.get(chainSlug)
    try {
      this.#inFlightTxCache.add(attestation)
      await Message.relayMessage(wallet, message, attestation)
    } catch (err) {
      // TODO: better err handling
      // error={"reason":"execution reverted: Nonce already used"
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
      case MessageState.Attested:
        return this.#isAttested(value as IAttestedMessage)
      case MessageState.Relayed:
        return this.#isRelayed(value as IRelayedMessage)
    }
  }

  #isSent (value: ISentMessage): boolean {
    const { sourceChainId, sentTimestampMs } = value
    const chainFinalityTimeMs = getFinalityTimeFromChainIdMs(sourceChainId)
    const finalityTimestampOk = sentTimestampMs + chainFinalityTimeMs < Date.now()

    return (
      finalityTimestampOk
    )
  }

  #isAttested (value: IAttestedMessage): boolean {
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
