import { ValidationClient, ValidationType } from '#validation/index.js'
import type { providers } from 'ethers'

export class CalldataValidation extends ValidationClient {

  constructor (validationClientUrl?: string, validationStatusEndpoint?: string) {
    super(ValidationType.Calldata, validationClientUrl, validationStatusEndpoint)
  }

  validateTx (transaction: providers.TransactionRequest): void {
    // TODO: Add calldata validation logic
  }
}
