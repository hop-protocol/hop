import promiseTimeout from 'src/utils/promiseTimeout'
import { wait } from 'src/utils'
import { Notifier } from 'src/notifier'
import Logger from 'src/logger'

const MAX_RETRIES = 5
const TIMEOUT_MS = 300 * 1000

const logger = new Logger('rateLimitRetry')
const notifier = new Notifier('rateLimitRetry')

export default function rateLimitRetry (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): any {
  const originalMethod = descriptor.value
  descriptor.value = async function (...args: any[]) {
    return runner(originalMethod.apply(this, args))
  }

  return descriptor
}

async function runner (fn: any): Promise<any> {
  let retries = 0
  const retry = () => promiseTimeout(fn, TIMEOUT_MS)
  while (true) {
    try {
      // the await here is intentional so it's caught in the try/catch below.
      const result = await retry()
      return result
    } catch (err) {
      const isRateLimitError = /(bad response|response error|rate limit|concurrency)/gi.test(
        err.message
      )
      // throw error as unsual if it's not a rate limit error
      if (!isRateLimitError) {
        throw err
      }
      retries++
      // if it's a rate limit error, then throw error after max retries attempted.
      if (retries >= MAX_RETRIES) {
        notifier.error(`rateLimitRetry function error: ${err.message}`)
        throw err
      }

      // exponential backoff wait
      await wait((1 >> retries) * 1000)
    }
  }
}
