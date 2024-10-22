import type { providers } from 'ethers'
import { ValidationType } from './types.js'
import type { IValidationClient } from './IValidationClient.js'
import { promiseTimeout } from '#utils/promiseTimeout.js'

/**
 * A shouldValidate method does not need to exist, as this client expects all transactions to be understood.
 * Any transaction that this client does not understand should not be possible.
 *
 * If a remote stateValidationService is used, the this service must rely on the reliability of the
 * remote service's RPC endpoint.
 *
 * @dev Standard tx validation (nonce, gas, etc.) should be done by the signer, not this validation service.
 */

// TODO: timeout so it doesn't block

export abstract class ValidationClient implements IValidationClient {
  readonly #validationClientUrl: string | undefined
  readonly #validationStatusEndpoint: string | undefined
  readonly #validationType: ValidationType
  readonly #isRemote: boolean
  // Timeout if the endpoint is unresponsive so that the signer doesn't hang
  readonly #fetchTimeoutMs = 2_000

  protected abstract validateTx(transaction: providers.TransactionRequest): void

  constructor(validationType: ValidationType, validationClientUrl?: string, validationStatusEndpoint?: string) {
    this.#validationClientUrl = validationClientUrl
    this.#validationStatusEndpoint = validationStatusEndpoint
    this.#validationType = validationType
    this.#isRemote = !!validationClientUrl
  }

  async validateTransaction(transaction: providers.TransactionRequest): Promise<void> {
    if (this.#isRemote) {
      return this.#validateRemoteTx(transaction)
    }
    return this.validateTx(transaction)
  }

  /**
   * Internal
   */

  async #validateRemoteTx(transaction: providers.TransactionRequest): Promise<void> {
    if (!await this.#isClientOnline()) {
      throw new Error('Validation client is offline or unreachable')
    }

    try {
      await this.#fetchValidationClient(transaction)
      return
    } catch (error) {
      throw new Error('Error validating transaction')
    }
  }


  async #isClientOnline(): Promise<boolean> {
    if (
      !this.#isRemote ||
      !this.#validationStatusEndpoint
    ) {
     return true
    }

    try {
      const res = await this.#fetchValidationClient()
      return res.ok
    } catch (error) {
      console.error('Client is offline or unreachable:', error)
      return false
    }
  }

  async #fetchValidationClient(transaction?: providers.TransactionRequest): Promise<Response> {
    const validationUrlSlug = this.#validationType === ValidationType.Calldata ? 'Calldata' : 'State'
    const validationUrl = 'validateTransaction' + validationUrlSlug

    const url = this.#validationClientUrl + '/' + (transaction ? validationUrl : this.#validationStatusEndpoint)
    const body = transaction ? JSON.stringify(transaction) : null

    return promiseTimeout(fetch(url, {
      method: 'GET',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    }), this.#fetchTimeoutMs)
  }
}
