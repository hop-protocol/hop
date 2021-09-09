import Logger from 'src/logger'
import wait from 'src/utils/wait'
import {
  Chain,
  TxMaxDelayMs
} from 'src/constants'
import { Mutex } from 'async-mutex'

const mutexes: { [key: string]: Mutex } = {}
const logger = new Logger('delayDecorator')
const cache: { [key: string]: number } = {}
const delayTimes: { [chain: string]: number } = {
  [Chain.Ethereum]: TxMaxDelayMs.Ethereum,
  [Chain.xDai]: TxMaxDelayMs.xDai,
  [Chain.Polygon]: TxMaxDelayMs.Polygon
}

export default function delay (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): any {
  const originalMethod = descriptor.value
  descriptor.value = async function (...args: any[]) {
    let queueGroup = ''
    if (typeof this.getQueueGroup === 'function') {
      queueGroup = await this.getQueueGroup()
    }
    if (!queueGroup) {
      logger.warn('queue group not set')
    }

    // use a mutex for queue group
    if (!mutexes[queueGroup]) {
      mutexes[queueGroup] = new Mutex()
    }

    const mutex = mutexes[queueGroup]
    return mutex.runExclusive(async () => {
      // require delay for certain rpc provider so it provides correct pending nonce.
      // other endpoints handle the pending nonce correctly.
      const maxDelayMs = delayTimes[queueGroup] ?? 0
      const lastTimestamp = cache[queueGroup]

      // checks to see if last timestamp is older than maxDelayMs,
      // therefore there's no need to wait full delay or at all.
      if (maxDelayMs && lastTimestamp) {
        const delta = Date.now() - lastTimestamp
        const delayMs = maxDelayMs - delta
        if (delayMs > 0) {
          logger.debug(`delaying ${delayMs / 1000} seconds on ${queueGroup} queue group`)
          await wait(delayMs)
        }
      }

      // set current timestamp to know how long to wait for on next invocation
      cache[queueGroup] = Date.now()

      // call original function
      return originalMethod.apply(this, args)
    })
  }

  return descriptor
}
