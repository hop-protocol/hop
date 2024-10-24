import { HopSignerError } from './error.js'
import { GasBoostSigner } from '#gasboost/GasBoostSigner.js'
import { ValidationType } from '#validation/index.js'
import type { Signer, providers } from 'ethers'
import { type IValidationClient, ValidationClient } from '#validation/index.js'

export interface ValidationOptions {
  calldataValidationClientUrl: string
  stateValidationClientUrl: string
}

export class HopSigner extends GasBoostSigner {
  readonly #calldataValidationClient: IValidationClient
  readonly #stateValidationClient: IValidationClient

  constructor (signer: Signer, validationOptions: ValidationOptions) {
    super(signer)

    const { calldataValidationClientUrl, stateValidationClientUrl } = validationOptions

    this.#calldataValidationClient = new ValidationClient(calldataValidationClientUrl, ValidationType.Calldata)
    this.#stateValidationClient = new ValidationClient(stateValidationClientUrl, ValidationType.State)
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
}
