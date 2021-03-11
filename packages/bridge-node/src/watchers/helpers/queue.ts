import { Mutex } from 'async-mutex'
import promiseTimeout from 'src/utils/promiseTimeout'
import { wait } from 'src/utils'

const mutexes: { [key: string]: Mutex } = {}
const MAX_RETRIES = 3
const TIMEOUT_MS = 15 * 1000

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
      return runner(originalMethod.apply(this, args))
    })
  }

  return descriptor
}

async function runner (fn: any) {
  let retries = MAX_RETRIES
  const retry = () => promiseTimeout(fn, TIMEOUT_MS)
  while (retries) {
    try {
      return await retry()
    } catch (err) {
      retries--
      if (!retries) {
        throw err
      }
      console.log(`queue function error; retrying (${retries})`)
      await wait(1 * 1000)
    }
  }
}
