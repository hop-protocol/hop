import { ValidationClient, ValidationType } from '#validation/index.js'
import type { providers } from 'ethers'

export class StateValidation extends ValidationClient {

  constructor (validationClientUrl?: string, validationStatusEndpoint?: string) {
    super(ValidationType.State, validationClientUrl, validationStatusEndpoint)
  }

  async validateTx (transaction: providers.TransactionRequest): Promise<void> {
    // TODO: Add state validation logic
  }
}
