import {
  NonceTooLowError,
  EstimateGasError,
  InsufficientFundsError
} from '#types/error.js'
import type { EVMError } from './types.js'

export function isEVMError (err: unknown): err is EVMError {
  if (err instanceof NonceTooLowError) {
    // TODO: Log?
    return true
  } else if (err instanceof EstimateGasError) {
    // TODO: Log?
    return true
  } else if (err instanceof InsufficientFundsError) {
    // TODO: Log?
    return true
  } else {
    // todo
    return true
  }

