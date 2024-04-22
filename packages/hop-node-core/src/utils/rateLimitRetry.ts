import { Logger } from '#logger/index.js'
import { hostname, rateLimitMaxRetries, rpcTimeoutSeconds } from '#config/index.js'
import { isFetchBadResponseError } from './isFetchBadResponseError.js'
import { isFetchConnectionError } from './isFetchConnectionError.js'
import { isFetchRateLimitError } from './isFetchRateLimitError.js'
import { isFetchTimeoutError } from './isFetchTimeoutError.js'
import { promiseTimeout } from './promiseTimeout.js'
import { wait } from './wait.js'

const _logger = new Logger('rateLimitRetry')

// eslint-disable-next-line max-lines-per-function
export function rateLimitRetry<FN extends (...args: any[]) => Promise<any>> (fn: FN): (...args: Parameters<FN>) => Promise<Awaited<ReturnType<FN>>> {
  const id = `${process.hrtime.bigint()}`
  const logger = _logger.create({ id })
  // eslint-disable-next-line max-lines-per-function
  return async (...args: Parameters<FN>): Promise<Awaited<ReturnType<FN>>> => {
    let retries = 0
    const retry = () => promiseTimeout(fn(...args), rpcTimeoutSeconds * 1000)
    while (true) {
      try {
        // the await here is intentional so it's caught in the try/catch below.
        const result = await retry()
        if (retries > 0) {
          logger.debug(`rateLimitRetry attempt #${retries} successful`)
        }
        return result
      } catch (err) {
        const errMsg = err.message
        const {
          isRateLimitError,
          isTimeoutError,
          isConnectionError,
          isBadResponseError,
          isOversizedDataError,
          isBridgeContractError,
          isNonceTooLowErrorError,
          isEstimateGasFailedError,
          isAlreadyKnownError,
          isFeeTooLowError,
          isCallLookupRevertError
        } = parseErrMessage(errMsg)


        // a connection error, such as 'ECONNREFUSED', will cause ethers to return a "missing revert data in call exception" error,
        // so we want to exclude server connection errors from actual contract call revert errors.
        const revertErrorRegex = /revert/i
        const isRevertError = revertErrorRegex.test(errMsg) && !isConnectionError && !isTimeoutError

        const shouldNotRetryErrors = (isOversizedDataError || isBridgeContractError || isNonceTooLowErrorError || isEstimateGasFailedError || isAlreadyKnownError || isFeeTooLowError || isCallLookupRevertError)
        const shouldRetry = (isRateLimitError || isTimeoutError || isConnectionError || isBadResponseError) && !isRevertError && !shouldNotRetryErrors

        logger.debug(`isRateLimitError: ${isRateLimitError}, isTimeoutError: ${isTimeoutError}, isConnectionError: ${isConnectionError}, isBadResponseError: ${isBadResponseError}, isRevertError: ${isRevertError}, shouldRetry: ${shouldRetry}`)

        // throw error as usual if it's not a rate limit error
        if (!shouldRetry) {
          if (!isCallLookupRevertError) {
            logger.error(errMsg)
          }
          throw err
        }
        retries++
        // if it's a rate limit error, then throw error after max retries attempted.
        if (retries >= rateLimitMaxRetries) {
          logger.error(`max retries reached (${rateLimitMaxRetries}). Error: ${err}`)
          // this must be a regular console log to print original function name
          console.error('max retries reached', fn, id, ...args)
          throw err
        }

        const delayMs = (1 << retries) * 1000
        logger.warn(
          `retry attempt #${retries} failed with error "${
            errMsg
          }". retrying again in ${delayMs / 1000} seconds.`
        )
        // this must be a regular console log to print original function name
        console.log(fn, id, ...args)
        // exponential backoff wait
        await wait(delayMs)
      }
    }
  }
}

function parseErrMessage (errMsg: string): any {
  const oversizedDataRegex = /oversized data/i
  const bridgeContractErrorRegex = /BRG:/
  const nonceTooLowErrorRegex = /(nonce.*too low|same nonce|already been used|NONCE_EXPIRED|OldNonce|invalid transaction nonce)/i
  const estimateGasFailedErrorRegex = /eth_estimateGas/i
  const alreadyKnownErrorRegex = /(AlreadyKnown|already known)/
  const feeTooLowErrorRegex = /(FeeTooLowToCompete|transaction underpriced)/

  // this invalid opcode error occurs when doing an on-chain lookup on a nested mapping where the index doesn't exist.
  // it doesn't necessary mean there's an error, only that the value at the index hasn't been set yet.
  // for example, l2Bridge.pendingTransferIdsForChainId(...)
  const isCallLookupRevertErrorRegex = /(missing revert data in call exception|invalid opcode|CALL_EXCEPTION)/

  return {
    isRateLimitError: isFetchRateLimitError(errMsg),
    isTimeoutError: isFetchTimeoutError(errMsg),
    isConnectionError: isFetchConnectionError(errMsg),
    isBadResponseError: isFetchBadResponseError(errMsg),
    isOversizedDataError: oversizedDataRegex.test(errMsg),
    isBridgeContractError: bridgeContractErrorRegex.test(errMsg),
    isNonceTooLowErrorError: nonceTooLowErrorRegex.test(errMsg),
    isEstimateGasFailedError: estimateGasFailedErrorRegex.test(errMsg),
    isAlreadyKnownError: alreadyKnownErrorRegex.test(errMsg),
    isFeeTooLowError: feeTooLowErrorRegex.test(errMsg),
    isCallLookupRevertError: isCallLookupRevertErrorRegex.test(errMsg)
  }
}