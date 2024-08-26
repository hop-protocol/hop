import { wallets } from '#wallets/index.js'
import { getChain } from '@hop-protocol/sdk'
import { StateMachine } from '#state-machine/StateMachine.js'
import { CCTPSDK } from './sdk/CCTPSDK.js'
import { poll } from '#utils/poll.js'
import {
  type ISentCCTPMessage,
  type ICCTPMessage,
  CCTPMessageState
} from './types.js'
import { TxRelayDB } from '#db/TxRelayDB.js'
import { FINALITY_TIME_MS } from '#constants/index.js'

export class CCTPStateMachine extends StateMachine<CCTPMessageState, ICCTPMessage> {
  readonly #relayedTxCache: TxRelayDB = new TxRelayDB('StateMachine')
  // If timing checks pass, a relay is attempted every poll. This value should be small enough
  // where users are not waiting a relatively long time but short enough where resources (RPC calls,
  // attestation API calls) are not abused.
  readonly #pollIntervalMs: number = 60_000

  override start(): void {
    super.start()
    this.#startPollers()
  }

  #startPollers (): void {
    void poll(this.#pollRelayer, this.#pollIntervalMs, this.logger)
  }

  /**
   * Implementation
   */

  protected override getItemId(value: ICCTPMessage): string {
    return `${value.sourceChainId}:${value.messageNonce}`
  }

  protected override shouldAttemptTransition(state: CCTPMessageState, value: ICCTPMessage): boolean {
    switch (state) {
      case CCTPMessageState.Sent:
        return this.#shouldRelayBeFinalized(value as ISentCCTPMessage)
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * FSM Utils
   */

  #shouldRelayBeFinalized(value: ISentCCTPMessage): boolean {
    // A relay can be finalized if enough time has passed for the message attestation to become available
    // and the destination chain has finalized the relay.
    const { sourceChainId, destinationChainId, sentTimestampMs } = value

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
      sentTimestampMs +
      attestationAvailableTimestampMs +
      destChainFinalityTimeMs +
      bufferMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }

  /**
   * Relayer
   */

  #pollRelayer = async (): Promise<void> => {
    for await (const [, value] of this.getItemsInState(CCTPMessageState.Sent)) {
      const { message, destinationChainId } = value as ISentCCTPMessage
      const canRelay = this.#canRelayMessage(value as ISentCCTPMessage)
      if (!canRelay) continue

      await this.#relayMessage(message, destinationChainId)
    }
  }

  #canRelayMessage (value: ISentCCTPMessage): boolean {
    // A message is relayable if the attestation is available.
    const { sourceChainId, sentTimestampMs } = value
    const attestationAvailableTimestampMs = CCTPSDK.attestationAvailableTimestampMs(sourceChainId)
    const attestationTimestampOk = sentTimestampMs + attestationAvailableTimestampMs < Date.now()

    return (
      attestationTimestampOk
    )
  }

  async #relayMessage (message: string, destinationChainId: string): Promise<void> {
    const messageHash = CCTPSDK.getMessageHashFromMessage(message)
    if (await this.#relayedTxCache.doesItemExist(messageHash)) return

    this.logger.info(`Relaying messageHash: ${messageHash} to chain: ${destinationChainId}`)
    try {
      const attestation = await CCTPSDK.fetchAttestation(message)
      const chainSlug = getChain(destinationChainId).slug
      const wallet = wallets.get(chainSlug)

      // Add the item to the cache at the last possible moment prior to relaying
      await this.#relayedTxCache.addItem(messageHash)
      // TODO: V2: Handle the case where the transaction is dropped...this should possibly be a guarantee of the signer though
      // If it is not guaranteed, then this will not re-do the transaction due to the tx being in the cache. Consider
      // adding a timing element like v1.
      await CCTPSDK.relayMessage(wallet, message, attestation)
    } catch (err) {
      this.#handleRelayError(message, err.message)
    }
  }

  #handleRelayError (message: string, errMessage: string): void {
    const messageHash = CCTPSDK.getMessageHashFromMessage(message)

    // Attestation errors
    if (errMessage.includes('Attestation not complete')) {
      this.logger.debug(`Attestation not yet ready for message hash: ${messageHash} (message: ${message}). Trying again next poll.`)
      return
    } else if (errMessage.includes('Message hash not found')) {
      throw new Error(`Message hash not found for message hash: ${messageHash} (message: ${message}). There is an issue with the message encoding.`)
    }

    // Tx errors
    if (errMessage.includes('Nonce already used')) {
      // This may occur if there are multiple servers running at once.
      // The item has already been added to the cache, so we can safely ignore this error.
      this.logger.debug(`Nonce already used for message hash: ${messageHash}. The item will no longer be attempted.`)
      return
    } else {
      // This might occur if the bonder is out of funds, there is an issue with the chain, or the message is an old, reorged message.
      // TODO: V2: The reorged message case should be handled differently by the DB and should not be here.
      this.logger.debug(`Relay failed for message hash: ${messageHash} (message: ${message}). This item will no longer be attempted.`)
      return
    }
  }
}
