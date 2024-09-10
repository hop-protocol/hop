import { EVMError } from './error.js'

export function isEVMError (err: unknown): err is EVMError {
  return err instanceof EVMError
}