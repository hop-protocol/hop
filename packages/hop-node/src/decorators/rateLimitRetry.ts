import promiseTimeout from 'src/utils/promiseTimeout'
import { wait } from 'src/utils'
import { Notifier } from 'src/notifier'
import Logger from 'src/logger'
import { rateLimitMaxRetries, rpcTimeoutSeconds } from 'src/config'

const logger = new Logger('rateLimitRetry')
const notifier = new Notifier('rateLimitRetry')

export default function rateLimitRetry (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): any {
  const originalMethod = descriptor.value
  descriptor.value = async function (...args: any[]) {
    return rateLimitRetryFn(originalMethod.apply(this, args))
  }

  return descriptor
}

export async function rateLimitRetryFn (fn: any): Promise<any> {
  let retries = 0
  const retry = () => promiseTimeout(fn, rpcTimeoutSeconds * 1000)
  while (true) {
    try {
      // the await here is intentional so it's caught in the try/catch below.
      const result = await retry()
      return result
    } catch (err) {
      const errorRegex = /(bad response|response error|rate limit|too many concurrent requests)/gi
      const isRateLimitError = errorRegex.test(err.message)
      // throw error as usual if it's not a rate limit error
      if (!isRateLimitError) {
        throw err
      }
      retries++
      // if it's a rate limit error, then throw error after max retries attempted.
      if (retries >= rateLimitMaxRetries) {
        notifier.error(`rateLimitRetry function error: ${err.message}`)
        throw err
      }

      // exponential backoff wait
      await wait((1 << retries) * 1000)
    }
  }
}
