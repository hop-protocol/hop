import type { providers } from 'ethers'
import { ValidationType } from './types.js'
import { ClientName, Rails, CCTP } from '#clients/index.js'
import type { IValidationClient } from './IValidationClient.js'

// The URL for a local validation client is expected to be in the format of `http://local/<client-name>`.
// This allows the URL to pass valid URL checks
const BASE_LOCAL_URL: string = 'http://local/'

export class LocalValidationClient implements IValidationClient {
  readonly #client: IValidationClient

  constructor(validationClientUrl: string, validationType: ValidationType) {
    const clientName = this.#parseLocalValidationClientUrl(validationClientUrl)
    if (!Object.values(ClientName).includes(clientName as ClientName)) {
      throw new Error('Invalid client name')
    }

    this.#client = this.#getValidationClient(clientName as ClientName, validationType)
  }

  async validateTransaction(transaction: providers.TransactionRequest): Promise<void> {
    return this.#client.validateTransaction(transaction)
  }

  /**
   * Static
   */

  static isLocalUrl(validationClientUrl: string): boolean {
    return validationClientUrl.includes(BASE_LOCAL_URL)
  }

  /**
   * Internal
   */

  #parseLocalValidationClientUrl(validationClientUrl: string): string {
    const res = validationClientUrl.split(BASE_LOCAL_URL)[1]
    if (!res) {
      throw new Error('Invalid local validation client url')
    }

    return res
  }

  #getValidationClient (
    clientName: ClientName,
    validationType: ValidationType,
  ): IValidationClient {
    switch (clientName) {
      case ClientName.Rails: {
        if (validationType === ValidationType.Calldata) {
          return new Rails.CalldataValidation
        } else {
          return new Rails.StateValidation
        }
      }

      case ClientName.CCTP: {
        if (validationType === ValidationType.Calldata) {
          return new CCTP.CalldataValidation
        } else {
          return new CCTP.StateValidation
        }
      }

      default:
        throw new Error(`Invalid client name: ${String(clientName)}`)
    }
  }
}
