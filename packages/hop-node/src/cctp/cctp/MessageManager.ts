import chainIdToSlug from 'src/utils/chainIdToSlug.js'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { FSMPoller } from '../fsm/FSMPoller.js'
import { Message } from './Message.js'
import { Signer } from 'ethers'
import { TransitionDataProvider } from './transitionData/TransitionDataProvider.js'

interface IDepositedMessage {
  message: string
  destinationChainId: number
  depositedTxHash: string
  depositedTimestampMs: number
}

interface IAttestedMessage {
  attestation: string
}

interface IRelayedMessage {
  relayTransactionHash: string
  relayTimestampMs: number
}

export type IMessage = IDepositedMessage | IAttestedMessage | IRelayedMessage

export enum MessageState {
  Deposited = 'deposited',
  Attested = 'attested',
  Relayed = 'relayed',
}

const StateTransitionMap: Record<MessageState, MessageState | null> = {
  [MessageState.Deposited]: MessageState.Attested,
  [MessageState.Attested]: MessageState.Relayed,
  [MessageState.Relayed]: null
}

// TODO: Handle inflight transactions on restart
export class MessageManager extends FSMPoller<MessageState, IMessage> {
  readonly #wallets: Record<Chain, Signer>
  readonly #inFlightTxCache: Set<string> = new Set()
  readonly #transitionDataProvider: TransitionDataProvider<MessageState, IMessage>

  constructor (chains: Chain[]) {
    super('MessageManager', StateTransitionMap)

    this.#transitionDataProvider = new TransitionDataProvider(chains)
    for (const chain of chains) {
      this.#wallets[chain] = wallets.get(chain)
    }
  }

  async getTransitionEvent <T extends MessageState>(state: T, messageHash: string): Promise<IMessage | undefined> {
    return this.#transitionDataProvider.getTransitionData(state, messageHash)
  }

  /**
   * Preconditions
   */

  isStateTransitionPreconditionMet(state: MessageState, messageHash: string, value: IMessage): boolean {
    switch (state) {
      case MessageState.Deposited:
        return this.#isDepositedStateTransactionPreconditionMet(messageHash, value as IDepositedMessage)
      case MessageState.Attested:
        return this.#isAttestedStateTransactionPreconditionMet(messageHash,value as IAttestedMessage)
      case MessageState.Relayed:
        return this.#isRelayedStateTransactionPreconditionMet(messageHash, value as IRelayedMessage)
    }
  }

  #isDepositedStateTransactionPreconditionMet (messageHash: string, value: IDepositedMessage): boolean {
    // TODO: Real finality
    const finalityMs = 10_000
    const finalityTimestampOk = value.depositedTimestampMs + finalityMs < Date.now()

    return (
      finalityTimestampOk
    )
  }

  #isAttestedStateTransactionPreconditionMet (messageHash: string, value: IAttestedMessage): boolean {
    const cacheKey = this.#getCacheKey(MessageState.Attested, messageHash)
    const isTxInFlight = this.#inFlightTxCache.has(cacheKey)

    // TODO: Introduce inflight timestamp for retry logic
    // though we used this in v1 for server restart and that doesn't matter if we have a cache....
    const inFlightTxTimestampOk = true
    
    return (
      !isTxInFlight &&
      inFlightTxTimestampOk
    )
  }

  #isRelayedStateTransactionPreconditionMet (messageHash: string, value: IRelayedMessage): boolean {
    // TODO: Real finality
    const finalityMs = 10_000
    const finalityTimestampOk = value.relayTimestampMs + finalityMs < Date.now()

    return (
      finalityTimestampOk
    )
  }

  /**
   * Actions
   */

  isStateActionPreconditionMet (state: MessageState, messageHash: string, value: IMessage): boolean {
    switch (state) {
      case MessageState.Deposited:
        return this.#isDepositedStateActionPreconditionMet(messageHash, value as IDepositedMessage)
      case MessageState.Attested:
        return this.#isAttestedStateActionPreconditionMet(messageHash, value as IAttestedMessage)
      case MessageState.Relayed:
        return this.#isRelayedStateActionPreconditionMet(messageHash, value as IRelayedMessage)
      default:
        return true
    }
  }

  #isDepositedStateActionPreconditionMet (messageHash: string, value: IDepositedMessage): boolean {
    return true
  }

  #isAttestedStateActionPreconditionMet (messageHash: string, value: IAttestedMessage): boolean {
    const cacheKey = this.#getCacheKey(MessageState.Attested, messageHash)
    const isTxInFlightCache = this.#inFlightTxCache.has(cacheKey)

    return (
      !isTxInFlightCache
    )
  }

  #isRelayedStateActionPreconditionMet (messageHash: string, value: IRelayedMessage): boolean {
    return true
  }

  /**
   * Other - hooks
   */

  handleStateExitHook (state: MessageState, messageHash: string, value: IMessage): void {
    switch (state) {
      case MessageState.Deposited:
        return this.#handleDepositedStateExitHook(messageHash, value as IDepositedMessage)
      case MessageState.Attested:
        return this.#handleAttestedStateExitHook(messageHash, value as IAttestedMessage)
      case MessageState.Relayed:
        return this.#handleRelayedStateExitHook(messageHash, value as IRelayedMessage)
    }
  }

  #handleDepositedStateExitHook (messageHash: string, value: IDepositedMessage): void {
    return
  }

  #handleAttestedStateExitHook (messageHash: string, value: IAttestedMessage): void {
    const cacheKey = this.#getCacheKey(MessageState.Attested, messageHash)
    this.#inFlightTxCache.delete(cacheKey)
    return
  }

  #handleRelayedStateExitHook (messageHash: string, value: IRelayedMessage): void {
    return
  }

  /**
   * Actions
   */

  async performAction(state: MessageState, value: IMessage): Promise<void> {
    switch (state) {
      case MessageState.Deposited:
        return this.#performDepositedStateAction(value)
      case MessageState.Attested:
        return this.#performAttestedStateAction(value)
      case MessageState.Relayed:
        return this.#performRelayedStateAction(value)
    }
  }

  async #performDepositedStateAction (value: IMessage): Promise<void> {
    return
  }

  async #performAttestedStateAction (value: IMessage): Promise<void> {
    // performAction methods need access to all data at given state, so we need to fetch the message data
    // There is probably a better way to type this
    const { message, attestation, destinationChainId } = value as IDepositedMessage & IAttestedMessage
    const chainSlug = chainIdToSlug(destinationChainId)
    await Message.relayMessage(this.#wallets[chainSlug], message, attestation)
  }

  async #performRelayedStateAction (value: IMessage): Promise<void> {
    return
  }

  /**
   * Utils
   */

  #getCacheKey (state: MessageState, messageHash: string): string {
    return `${state}-${messageHash}`
  }
}
