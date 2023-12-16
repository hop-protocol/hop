import Logger from 'src/logger'
import wait from 'src/utils/wait'
import { Notifier } from 'src/notifier'
import { hostname, rateLimitMaxRetries, rpcTimeoutSeconds } from 'src/config'
import { isFetchBadResponseError } from './isFetchBadResponseError'
import { isFetchConnectionError } from './isFetchConnectionError'
import { isFetchRateLimitError } from './isFetchRateLimitError'
import { isFetchTimeoutError } from './isFetchTimeoutError'
import { promiseTimeout } from 'src/utils/promiseTimeout'

const _logger = new Logger('rateLimitRetry')
const notifier = new Notifier(`rateLimitRetry, host: ${hostname}`)

export default function rateLimitRetry<FN extends (...args: any[]) => Promise<any>> (fn: FN): (...args: Parameters<FN>) => Promise<Awaited<ReturnType<FN>>> {
  const id = `${process.hrtime.bigint()}`
  const logger = _logger.create({ id })
  return async (...args: Parameters<FN>): Promise<Awaited<ReturnType<FN>>> => {
    let retries = 0
    const retry = () => promiseTimeout(fn(...args), rpcTimeoutSeconds * 1000) // eslint-disable-line
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
        const revertErrorRegex = /revert/i
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

        const isRateLimitError = isFetchRateLimitError(errMsg)
        const isTimeoutError = isFetchTimeoutError(errMsg)
        const isConnectionError = isFetchConnectionError(errMsg)
        const isBadResponseError = isFetchBadResponseError(errMsg)
        const isOversizedDataError = oversizedDataRegex.test(errMsg)
        const isBridgeContractError = bridgeContractErrorRegex.test(errMsg)
        const isNonceTooLowErrorError = nonceTooLowErrorRegex.test(errMsg)
        const isEstimateGasFailedError = estimateGasFailedErrorRegex.test(errMsg)
        const isAlreadyKnownError = alreadyKnownErrorRegex.test(errMsg)
        const isFeeTooLowError = feeTooLowErrorRegex.test(errMsg)
        const isCallLookupRevertError = isCallLookupRevertErrorRegex.test(errMsg)

        // a connection error, such as 'ECONNREFUSED', will cause ethers to return a "missing revert data in call exception" error,
        // so we want to exclude server connection errors from actual contract call revert errors.
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
          notifier.error(`max retries (${rateLimitMaxRetries}) reached (logId: ${id}). Error: ${errMsg}`)
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
