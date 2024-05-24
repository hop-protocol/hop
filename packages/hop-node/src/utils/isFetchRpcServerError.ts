import { isFetchBadResponseError } from './isFetchBadResponseError.js'
import { isFetchConnectionError } from './isFetchConnectionError.js'
import { isFetchTimeoutError } from './isFetchTimeoutError.js'

export function isFetchRpcServerError (errMsg: string): boolean {
  return isFetchTimeoutError(errMsg) || isFetchConnectionError(errMsg) || isFetchBadResponseError(errMsg)
}
