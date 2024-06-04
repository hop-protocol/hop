import wallets from '#wallets/index.js'
import { getChain } from '@hop-protocol/sdk'
import { StateMachine } from '../state-machine/StateMachine.js'
import { MessageSDK } from './MessageSDK.js'
import { getFinalityTimeFromChainIdMs } from './utils.js'
import { poll } from '../utils.js'
import { MessageState } from './Message.js'
import type { ISentMessage, IRelayedMessage, IMessage } from './types.js'
import { TxRelayDB } from '../db/TxRelayDB.js'

// TODO: Handle inflight transactions on restart
export class MessageStateMachine extends StateMachine<MessageState, IMessage> {
  readonly #sentTxCache: TxRelayDB = new TxRelayDB()
  readonly #pollIntervalMs: number = 60_000

  override start(): void {
    super.start()
    this.#startPollers()
  }

  #startPollers (): void {
    poll(this.#checkRelay, this.#pollIntervalMs)
  }

  /**
   * Implementation
   */

  protected override getItemId(value: IMessage): string {
    return MessageSDK.getMessageHashFromMessage(value.message)
  }

  protected override isTransitionReady (state: MessageState, value: IMessage): boolean {
    switch (state) {
      case MessageState.Sent:
        return this.#isSent(value as ISentMessage)
      case MessageState.Relayed:
        return this.#isRelayed(value as IRelayedMessage)
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #checkRelay = async (): Promise<void> => {
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

    const messageHash = MessageSDK.getMessageHashFromMessage(message)
    if (await this.#sentTxCache.doesTxHashExist(messageHash)) return

    try {
      const attestation = await MessageSDK.fetchAttestation(message)

      await this.#sentTxCache.addTxHash(messageHash)
      await MessageSDK.relayMessage(wallet, message, attestation)
    } catch (err) {
      // TODO: better err handling
      // error={"reason":"execution reverted: Nonce already used"
      // Also handle attestation failure
      // Also handle relay failure and un-do sentTxCache
      // Also handle cache add failure
      console.log('Relay failed', err)
    }
  }

  /**
   * Utils
   */

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
