import { wallets } from '#wallets/index.js'
import { getChain } from '@hop-protocol/sdk'
import { StateMachine } from '../state-machine/StateMachine.js'
import { MessageSDK } from './MessageSDK.js'
import { getFinalityTimeFromChainIdMs, poll } from '../utils.js'
import {
  type ISentMessage,
  type IRelayedMessage,
  type IMessage,
  MessageState
} from './types.js'
import { TxRelayDB } from '../db/TxRelayDB.js'

export class MessageStateMachine extends StateMachine<MessageState, IMessage> {
  readonly #sentTxCache: TxRelayDB = new TxRelayDB()
  readonly #pollIntervalMs: number = 60_000

  override start(): void {
    super.start()
    this.#startPollers()
  }

  #startPollers (): void {
    poll(this.#pollRelayer, this.#pollIntervalMs)
  }

  /**
   * Implementation
   */

  protected override getItemId(value: IMessage): string {
    return `${value.sourceChainId}:${value.messageNonce}`
  }

  protected override shouldAttemptTransition(state: MessageState, value: IMessage): boolean {
    switch (state) {
      case MessageState.Sent:
        return this.#shouldRelayBeFinalized(value as ISentMessage)
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * FSM Utils
   */

  #shouldRelayBeFinalized(value: ISentMessage): boolean {
    // A relay can be finalized if enough time has passed for the message attestation to become available
    // and the destination chain has finalized the relay.
    const { sourceChainId, destinationChainId, sentTimestampMs } = value

    const attestationAvailableTimestampMs = MessageSDK.attestationAvailableTimestampMs(sourceChainId)
    const destChainFinalityTimeMs = getFinalityTimeFromChainIdMs(destinationChainId)
    const expectedRelayTimeMs = sentTimestampMs + attestationAvailableTimestampMs + destChainFinalityTimeMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }

  /**
   * Relayer
   */

  #pollRelayer = async (): Promise<void> => {
    for await (const value of this.#getRelayableMessages()) {
      const { message, destinationChainId } = value
      await this.#relayMessage(message, destinationChainId)
    }
  }

  async *#getRelayableMessages (): AsyncIterable<ISentMessage> {
    for await (const [, value] of this.getItemsInState(MessageState.Sent)) {
      const canRelay = this.#canRelayMessage(value as ISentMessage)
      if (!canRelay) continue

      yield value as ISentMessage
    }
  }

  #canRelayMessage (value: ISentMessage): boolean {
    // A message is relayable if the attestation is available.
    const { sourceChainId, sentTimestampMs } = value
    const attestationAvailableTimestampMs = MessageSDK.attestationAvailableTimestampMs(sourceChainId)
    const attestationTimestampOk = sentTimestampMs + attestationAvailableTimestampMs < Date.now()

    return (
      attestationTimestampOk
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
      // Custom errors
      if (err.message.includes('Attestation not complete')) {
        console.log(`Attestation not yet ready for message hash: ${messageHash} (message: ${message}). Trying again next poll.`)
        return
      } else if (err.message.includes('Message hash not found')) {
        throw new Error(`Message hash not found for message hash: ${messageHash} (message: ${message}). There is an issue with the message encoding.`)
      }

      // Tx errors
      if ('Nonce already used') {
        // error={"reason":"execution reverted: Nonce already used"
        // TODO: How would this happen in the first place? 
        await this.#sentTxCache.addTxHash(messageHash)
        console.log(`Nonce already used for message ${messageHash}. Adding to the cache.`)
        return
      } else {
        // TODO: How to handle this? Could be out of funds, etc. Most likely handled by signer
        console.log('Relay failed', err)
      }
    }
  }
}
