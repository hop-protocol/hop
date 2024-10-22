import { HopSignerError } from './error.js'
import { GasBoostSigner } from '#gasboost/GasBoostSigner.js'
import { ValidationType } from '#validation/index.js'
import { ClientName, CCTP, Rails } from '#clients/index.js'
import type { Signer, providers } from 'ethers'
import type { IValidationClient } from '#validation/index.js'

export interface ValidationOptions {
  clientName: ClientName
  validationStatusEndpoint?: string
  validationClientUrls?: {
    calldataValidationClientUrl?: string
    stateValidationClientUrl?: string
  }
}

export class HopSigner extends GasBoostSigner {
  readonly #calldataValidationClient?: IValidationClient
  readonly #stateValidationClient?: IValidationClient

  constructor (signer: Signer, validationOptions?: ValidationOptions) {
    super(signer)

    if (validationOptions) {
      const { clientName, validationClientUrls, validationStatusEndpoint } = validationOptions

      this.#calldataValidationClient = this.#getValidationClient(
        clientName,
        ValidationType.Calldata,
        validationClientUrls?.calldataValidationClientUrl,
        validationStatusEndpoint
      )
      this.#stateValidationClient = this.#getValidationClient(
        clientName,
        ValidationType.State,
        validationClientUrls?.calldataValidationClientUrl,
        validationStatusEndpoint
      )
    }
  }

  override async sendTransaction (transaction: providers.TransactionRequest): Promise<providers.TransactionResponse> {
    await this.#validateTransaction(transaction)
    return super.sendTransaction(transaction)
  }

  /**
   * Internal
   */

  async #validateTransaction (transaction: providers.TransactionRequest): Promise<void> {
    if (this.#calldataValidationClient) {
      await this.#calldataValidationClient.validateTransaction(transaction)
    }

    if (this.#stateValidationClient) {
      try {
        await this.#stateValidationClient.validateTransaction(transaction)
      } catch (err) {
        throw new HopSignerError(err.message)
      }
    }
  }

  #getValidationClient(
    clientName: ClientName,
    validationType: ValidationType,
    validationClientUrl?: string,
    validationStatusEndpoint?: string
  ): IValidationClient {
    switch (clientName) {
      case ClientName.Rails: {
        if (validationType === ValidationType.Calldata) {
          return new Rails.CalldataValidation(validationClientUrl, validationStatusEndpoint)
        } else {
          return new Rails.StateValidation(validationClientUrl, validationStatusEndpoint)
        }
      }

      case ClientName.CCTP: {
        if (validationType === ValidationType.Calldata) {
          return new CCTP.CalldataValidation(validationClientUrl, validationStatusEndpoint)
        } else {
          return new CCTP.StateValidation(validationClientUrl, validationStatusEndpoint)
        }
      }

      default:
        throw new Error(`Invalid client name: ${String(clientName)}`)
    }
  }
}
