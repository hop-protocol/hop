import { LocalValidationClient } from './LocalValidationClient.js'
import { RemoteValidationClient } from './RemoteValidationClient.js'
import type { providers } from 'ethers'
import type { ValidationType } from './types.js'
import type { IValidationClient } from './IValidationClient.js'


export class ValidationClient implements IValidationClient {
  readonly #client: IValidationClient

  constructor(validationClientUrl: string, validationType: ValidationType) {
    const isLocal = LocalValidationClient.isLocalUrl(validationClientUrl)

    if (isLocal) {
      this.#client = new LocalValidationClient(validationClientUrl, validationType)
    } else {
      this.#client = new RemoteValidationClient(validationClientUrl, validationType)
    }
  }

  async validateTransaction(transaction: providers.TransactionRequest): Promise<void> {
    return this.#client.validateTransaction(transaction)
  }
}
