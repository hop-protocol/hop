import { Mutex } from 'async-mutex'
import promiseTimeout from 'src/utils/promiseTimeout'
import { wait } from 'src/utils'
import { Notifier } from 'src/notifier'
import Logger from 'src/logger'

const mutexes: { [key: string]: Mutex } = {}
const MAX_RETRIES = 1
const TIMEOUT_MS = 300 * 1000

const logger = new Logger('queue')
const notifier = new Notifier('queue')

export default function queue (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): any {
  const originalMethod = descriptor.value
  descriptor.value = async function (...args: any[]) {
    if (!mutexes[this.queueGroup]) {
      mutexes[this.queueGroup] = new Mutex()
    }
    const mutex = mutexes[this.queueGroup]
    return mutex.runExclusive(async () => {
      return await runner(originalMethod.apply(this, args))
    })
  }

  return descriptor
}

async function runner (fn: any) {
  let retries = 0
  const retry = () => promiseTimeout(fn, TIMEOUT_MS)
  while (true) {
    try {
      let result = await retry()
      // TODO: debounce runner function
      await wait(2 * 1000)
      return result
    } catch (err) {
      retries++
      if (retries >= MAX_RETRIES) {
        notifier.error(`queue function error: ${err.message}`)
        throw err
      }
      logger.error('error:', err.message)
      logger.error(`queue function error; retrying (${retries})`)
      await wait(1 * 1000)
    }
  }
}
