import type { providers } from 'ethers'
import { ValidationType } from './types.js'
import type { IValidationClient } from './IValidationClient.js'
import { promiseTimeout } from '#utils/promiseTimeout.js'

export class RemoteValidationClient implements IValidationClient {
  readonly #validationClientUrl: string
  readonly #validationType: ValidationType
  // TODO: V2: this should be a config
  readonly #validationStatusEndpoint: string = 'health'
  // Timeout if the endpoint is unresponsive so that the signer doesn't hang
  readonly #fetchTimeoutMs = 2_000

  constructor(validationClientUrl: string, validationType: ValidationType) {
    this.#validationClientUrl = validationClientUrl
    this.#validationType = validationType
  }

  async validateTransaction(transaction: providers.TransactionRequest): Promise<void> {
    if (!await this.#isClientOnline()) {
      throw new Error('Validation client is offline or unreachable')
    }

    const res = await fetch(this.#validationClientUrl, {
      method: 'POST',
      body: JSON.stringify(transaction),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      throw new Error('Error validating transaction')
    }
  }

  /**
   * Internal
   */

  async #isClientOnline(): Promise<boolean> {
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
