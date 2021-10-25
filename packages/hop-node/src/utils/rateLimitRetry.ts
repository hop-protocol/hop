import Logger from 'src/logger'
import promiseTimeout from 'src/utils/promiseTimeout'
import wait from 'src/utils/wait'
import { Notifier } from 'src/notifier'
import { hostname, rateLimitMaxRetries, rpcTimeoutSeconds } from 'src/config'

const logger = new Logger('rateLimitRetry')
const notifier = new Notifier(`rateLimitRetry, host: ${hostname}`)

export default function rateLimitRetry (fn: any): any {
  const id = `${process.hrtime()[1]}`
  const log = logger.create({ id })
  return async (...args: any[]) => {
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
        const errorRegex = /(timeout|timedout|ETIMEDOUT|ENETUNREACH|ECONNRESET|bad response|response error|missing response|rate limit|too many concurrent requests|socket hang up)/i
        const notRateLimitErrorRegex = /revert/i
        const isRateLimitError = errorRegex.test(err.message) && !notRateLimitErrorRegex.test(err.message)
        // throw error as usual if it's not a rate limit error
        if (!isRateLimitError) {
          log.error(err.message)
          throw err
        }
        retries++
        // if it's a rate limit error, then throw error after max retries attempted.
        if (retries >= rateLimitMaxRetries) {
          logger.error(`max retries (${rateLimitMaxRetries}) reached. Error: ${err}`)
          // this must be a regular console log to print original function name
          console.log(fn, id, ...args)
          notifier.error(`max retries (${rateLimitMaxRetries}) reached. Error: ${err.message}`)
          throw err
        }

        const delayMs = (1 << retries) * 1000
        log.warn(
          `retry attempt #${retries} failed with error "${
            err.message
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
