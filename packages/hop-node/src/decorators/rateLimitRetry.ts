import Logger from 'src/logger'
import promiseTimeout from 'src/utils/promiseTimeout'
import { Notifier } from 'src/notifier'
import { rateLimitMaxRetries, rpcTimeoutSeconds } from 'src/config'
import { wait } from 'src/utils'

const logger = new Logger('rateLimitRetry')
const notifier = new Notifier('rateLimitRetry')

export default function rateLimitRetry (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): any {
  const originalMethod = descriptor.value
  descriptor.value = async function (...args: any[]) {
    return rateLimitRetryFn(originalMethod.bind(this))(...args)
  }

  return descriptor
}

export function rateLimitRetryFn (fn: any): any {
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
        const errorRegex = /(timeout|timedout|ETIMEDOUT|ENETUNREACH|ECONNRESET|bad response|response error|missing response|rate limit|too many concurrent requests|socket hang up)/gi
        const isRateLimitError = errorRegex.test(err.message)
        // throw error as usual if it's not a rate limit error
        if (!isRateLimitError) {
          log.error(err.message)
          throw err
        }
        retries++
        // if it's a rate limit error, then throw error after max retries attempted.
        if (retries >= rateLimitMaxRetries) {
          logger.error(`max retries (${rateLimitMaxRetries}) reached. Error: ${err.message}`)
          // this must be a regular console log to print original function name
          console.log(fn, id)
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
        console.log(fn, id)
        // exponential backoff wait
        await wait(delayMs)
      }
    }
  }
}
