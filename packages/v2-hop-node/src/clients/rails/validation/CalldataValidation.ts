import type { providers } from 'ethers'
import type { IValidationService } from '#validation/index.js'

export class CalldataValidation implements IValidationService {
  validateTransaction (transaction: providers.TransactionRequest): void {
    // TODO: Add calldata validation logic
  }
}
