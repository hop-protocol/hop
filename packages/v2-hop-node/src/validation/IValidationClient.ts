import type { providers } from 'ethers'

export interface IValidationClient {
  validateTransaction (transaction: providers.TransactionRequest): Promise<void> | void
}
