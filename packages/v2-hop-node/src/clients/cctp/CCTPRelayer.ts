import { CCTPMethodName, CCTPSDK } from './CCTPSDKWrapper.js'
import { Relayer } from '#relayer/Relayer.js'
import { wallets } from '#wallets/index.js'
import type { ReceiveMessageInput, ICCTPRelayItem } from './types.js'
import type { providers } from 'ethers'

export class CCTPRelayer extends Relayer<CCTPMethodName, ICCTPRelayItem> {

  /**
   * Implementation
   */

  protected override formatRelayItem(relayTxMethodName: CCTPMethodName, relayItem: any): ICCTPRelayItem {
    switch (relayTxMethodName) {
      case CCTPMethodName.ReceiveMessage:
        return this.#formatReceiveMessageInput(relayItem) as ICCTPRelayItem
      default:
        throw new Error('Invalid relay item')
    }
  }

  protected override async shouldAttemptRelay(
    relayItem: ICCTPRelayItem,
    relayTxMethodName: CCTPMethodName
  ): Promise<boolean> {
    switch (relayTxMethodName) {
      case CCTPMethodName.ReceiveMessage:
        return this.#canRelayReceiveMessageInput(relayItem)
      default:
        throw new Error('Invalid relay item')
    }
  }

  /**
   * External
   */

  override async sendRelay (
    relayItem: ICCTPRelayItem,
    relayTxMethodName: CCTPMethodName
  ): Promise<providers.TransactionResponse> {

    switch (relayTxMethodName) {
      case CCTPMethodName.ReceiveMessage:
        return this.#sendReceiveMessage(relayItem)
      default:
        throw new Error('Invalid relay item')
    }
  }

  protected override isImplementationError (err: unknown): boolean {
    return (
      this.#isAttestationError(err) ||
      this.#isContractError(err)
    )
  }

  /**
   * Internal - Validation
   */

  async #canRelayReceiveMessageInput (relayItem: ReceiveMessageInput): Promise<boolean> {
    // If the attestations are not ready, we should not attempt the relay
    try {
      await CCTPSDK.fetchAttestation(relayItem.message)
    } catch (err) {
      this.logger.debug(`Attestation not yet ready for message: ${relayItem.message}`, JSON.stringify(err))
      return false
    }

    return true
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
   * Internal - Format
   */

  // TODO: This should return a CCTPReceiveMessageInput but is not trivial since the input
  // includes the attestation but the attestation is retrieved JIT.
  #formatReceiveMessageInput (relayItem: any): any {
    const isValid = this.#isReceiveMessageInput(relayItem)
    if (!isValid) {
      throw new Error('Invalid receive message input')
    }

    return {
      message: relayItem.message
    }
  }

  /**
   * Errors
   */

  #isAttestationError (err: unknown): boolean {
    const errMessage = (err as Error).message
    if (errMessage.includes('Attestation not complete')) {
      this.logger.debug(`Attestation not yet ready for message hash, err: ${errMessage}`)
      return true
    } else if (errMessage.includes('Message hash not found')) {
      // This is an issue with message encoding
      this.logger.debug(`Message hash not found for message hash, err: ${errMessage}`)
      return true
    }

    return false
  }

  #isContractError (err: unknown): boolean {
    const errMessage = (err as Error).message
    if (
      errMessage.includes('Invalid attestation length') ||
      errMessage.includes('Invalid signature order or dupe') ||
      errMessage.includes('Invalid signature: not attester') ||
      errMessage.includes('Invalid destination domain') ||
      errMessage.includes('Invalid caller for message') ||
      errMessage.includes('Invalid message version') ||
      errMessage.includes('Nonce already used') ||
      errMessage.includes('handleReceiveMessage() failed')
    ) {
      this.logger.debug(`Contract error: ${errMessage}`)
      return true
    }
    return false
  }
}
