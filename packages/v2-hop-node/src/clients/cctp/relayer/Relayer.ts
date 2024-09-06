import { CCTPSDK } from '../CCTPSDKWrapper.js'
import { Relayer } from '#relayer/Relayer.js'
import { wallets } from '#wallets/index.js'
import type { ReceiveMessageInput, ICCTPRelayItem } from './types.js'
import type { providers } from 'ethers'

export class CCTPRelayer extends Relayer<ICCTPRelayItem> {

  /**
   * Implementation
   */

  protected override shouldAttemptRelay (relayItem: ICCTPRelayItem): Promise<boolean> {
    if (!this.#isReceiveMessageInput(relayItem)) {
      throw new Error('Invalid relay item')
    }

    // There is no onchain check required since the attestation is offchain
    return Promise.resolve(true)
  }

  protected override sendRelay (relayItem: ICCTPRelayItem): Promise<providers.TransactionResponse> {
    if (!this.#isReceiveMessageInput(relayItem)) {
      throw new Error('Invalid relay item')
    }
    return this.#sendReceiveMessage(relayItem)
  }

  protected override isImplementationError (relayItem: ICCTPRelayItem, err: Error): boolean {
    return this.#isContractError(relayItem, err)
  }

  /**
   * Internal - Execution
   */

  async #sendReceiveMessage (relayItem: ReceiveMessageInput): Promise<providers.TransactionResponse> {
    const { message, destChainId } = relayItem

    const attestation = await CCTPSDK.fetchAttestation(message)
    const wallet = wallets.get(destChainId)
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
    return (
      'message' in candidate &&
      'attestation' in candidate &&
      typeof candidate.message === 'string' &&
      typeof candidate.attestation === 'string'
    )
  }

  /**
   * Errors
   */

  #isContractError (relayItem: ReceiveMessageInput, err: Error): boolean {
    const messageHash = CCTPSDK.getMessageHashFromMessage(relayItem.message)
    const errMessage = err.message

    if (errMessage.includes('Attestation not complete')) {
      this.logger.debug(`Attestation not yet ready for message hash: ${messageHash}. Trying again next poll.`)
      return true
    } else if (errMessage.includes('Message hash not found')) {
      // TODO: Handle this
      // throw new Error(`Message hash not found for message hash: ${messageHash} (message: ${message}). There is an issue with the message encoding.`)
      return true
    } else if (errMessage.includes('TODO') /* TODO */) {
      // TODO: Handle an old message or reorged
      return true
    }

    return false
  }
}
