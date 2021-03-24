import { Mutex } from 'async-mutex'
import promiseTimeout from 'src/utils/promiseTimeout'
import { wait } from 'src/utils'

const mutexes: { [key: string]: Mutex } = {}
const MAX_RETRIES = 1
const TIMEOUT_MS = 60 * 1000

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
      return await retry()
    } catch (err) {
      retries++
      if (retries >= MAX_RETRIES) {
        throw err
      }
      console.log('error:', err.message)
      console.log(`queue function error; retrying (${retries})`)
      await wait(1 * 1000)
    }
  }
}
