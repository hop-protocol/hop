import Logger from 'src/logger'
import promiseTimeout from 'src/utils/promiseTimeout'
import wait from 'src/utils/wait'
import { Notifier } from 'src/notifier'
import { hostname, rateLimitMaxRetries, rpcTimeoutSeconds } from 'src/config'

const logger = new Logger('rateLimitRetry')
const notifier = new Notifier(`rateLimitRetry, host: ${hostname}`)

export default function rateLimitRetry<FN extends (...args: any[]) => Promise<any>> (fn: FN): (...args: Parameters<FN>) => Promise<Awaited<ReturnType<FN>>> {
  const id = `${process.hrtime()[1]}`
  const log = logger.create({ id })
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
        const rateLimitErrorRegex = /(rate limit|too many concurrent requests|exceeded|socket hang up)/i
        const timeoutErrorRegex = /(timeout|time-out|time out|timedout|timed out)/i
        const connectionErrorRegex = /(ETIMEDOUT|ENETUNREACH|ECONNRESET|ECONNREFUSED|SERVER_ERROR)/i
        const badResponseErrorRegex = /(bad response|response error|missing response|processing response error)/i
        const revertErrorRegex = /revert/i

        const isRateLimitError = rateLimitErrorRegex.test(errMsg)
        const isTimeoutError = timeoutErrorRegex.test(errMsg)
        const isConnectionError = connectionErrorRegex.test(errMsg)
        const isBadResponseError = badResponseErrorRegex.test(errMsg)

        // a connection error, such as 'ECONNREFUSED', will cause ethers to return a "missing revert data in call exception" error,
        // so we want to exclude server connection errors from actual contract call revert errors.
        const isRevertError = revertErrorRegex.test(errMsg) && !isConnectionError && !isTimeoutError

        const shouldRetry = (isRateLimitError || isTimeoutError || isConnectionError || isBadResponseError) && !isRevertError

        log.debug(`isRateLimitError: ${isRateLimitError}, isTimeoutError: ${isTimeoutError}, isConnectionError: ${isConnectionError}, isBadResponseError: ${isBadResponseError}, isRevertError: ${isRevertError}, shouldRetry: ${shouldRetry}`)

        // throw error as usual if it's not a rate limit error
        if (!shouldRetry) {
          log.error(errMsg)
          throw err
        }
        retries++
        // if it's a rate limit error, then throw error after max retries attempted.
        if (retries >= rateLimitMaxRetries) {
          logger.error(`max retries (${rateLimitMaxRetries}) reached. Error: ${err}`)
          // this must be a regular console log to print original function name
          console.log(fn, id, ...args)
          notifier.error(`max retries (${rateLimitMaxRetries}) reached. Error: ${errMsg}`)
          throw err
        }

        const delayMs = (1 << retries) * 1000
        log.warn(
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
