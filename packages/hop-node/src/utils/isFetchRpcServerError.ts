import { isFetchBadResponseError } from './isFetchBadResponseError'
import { isFetchConnectionError } from './isFetchConnectionError'
import { isFetchTimeoutError } from './isFetchTimeoutError'

export function isFetchRpcServerError (errMsg: string) {
  return isFetchTimeoutError(errMsg) || isFetchConnectionError(errMsg) || isFetchBadResponseError(errMsg)
}
