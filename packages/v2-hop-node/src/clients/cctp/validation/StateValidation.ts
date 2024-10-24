import type { IValidationClient } from '#validation/index.js'
import type { providers } from 'ethers'

export class StateValidation implements IValidationClient {

  async validateTransaction (transaction: providers.TransactionRequest): Promise<void> {
    // TODO: Add state validation logic
  }
}
