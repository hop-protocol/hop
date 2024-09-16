import { CCTPSDK } from '../CCTPSDKWrapper.js'
import { Relayer } from '#relayer/Relayer.js'
import { wallets } from '#wallets/index.js'
import type { ReceiveMessageInput, ICCTPRelayItem } from './types.js'
import type { providers } from 'ethers'

export class CCTPRelayer extends Relayer<ICCTPRelayItem> {

  /**
   * Implementation
   */

  protected override async shouldAttemptRelay (relayItem: ICCTPRelayItem): Promise<boolean> {
    if (!this.#isReceiveMessageInput(relayItem)) {
      throw new Error('Invalid relay item')
    }

    // If the attestations are not ready, we should not attempt the relay
    try {
      await CCTPSDK.fetchAttestation(relayItem.message)
    } catch (err) {
      this.logger.debug(`Attestation not yet ready for message hash: ${relayItem.message}`)
      return false
    }

    return true
  }

  protected override async sendRelay (relayItem: ICCTPRelayItem): Promise<providers.TransactionResponse> {
    if (!this.#isReceiveMessageInput(relayItem)) {
      throw new Error('Invalid relay item')
    }
    return this.#sendReceiveMessage(relayItem)
  }

  protected override isImplementationError (err: unknown): boolean {
    return (
      this.#isAttestationError(err) ||
      this.#isContractError(err)
    )
  }

  /**
   * Internal - Execution
   */

  async #sendReceiveMessage (relayItem: ReceiveMessageInput): Promise<providers.TransactionResponse> {
    const { message, destinationChainId } = relayItem

    const attestation = await CCTPSDK.fetchAttestation(message)
    const wallet = wallets.get(destinationChainId)
    return CCTPSDK.relayMessage(wallet, message, attestation)
  }

  /**
   * Type Guards
   */

  #isReceiveMessageInput(item: unknown): item is ReceiveMessageInput {
    if (typeof item !== 'object' || item === null) {
      return false
    }

    const candidate = item as Partial<ReceiveMessageInput>
    // The attestation is retrieved during the relay so we do not need to check for it here
    return (
      'message' in candidate &&
      typeof candidate.message === 'string'
    )
  }

  /**
   * Errors
   */

  #isAttestationError (err: unknown): boolean {
    const errMessage = (err as Error).message
    if (errMessage.includes('Attestation not complete')) {
      this.logger.debug(`Attestation not yet ready for message hash: ${errMessage}`)
      return true
    } else if (errMessage.includes('Message hash not found')) {
      // This is an issue with message encoding
      this.logger.debug(`Message hash not found for message hash: ${errMessage}`)
      return true
    }

    return false
  }

  #isContractError (err: unknown): boolean {
    return false
  }
}
