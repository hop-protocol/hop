import type { IValidationClient } from '#validation/index.js'
import type { providers } from 'ethers'

export class CalldataValidation implements IValidationClient {

  validateTransaction (transaction: providers.TransactionRequest): void {
    // TODO: Add calldata validation logic
  }
}
