import PQueue from 'p-queue'
import _ from 'lodash'

type Options = {
  concurrency: number
  timeoutMs?: number
}

export async function promiseQueue (items: any[], cb: any, options: Options) {
  return promiseQueueConcurrent(items, cb, options)
}

async function promiseQueueChunk (items: any[], cb: any, options: Options) {
  const { concurrency } = options
  const allChunks = _.chunk(items, concurrency)
  let i = 0
  for (const chunks of allChunks) {
    await Promise.all(chunks.map(async (item) => {
      i++
      await cb(item, i)
    }))
  }
}

async function promiseQueueConcurrent (items: any[], cb: any, options: Options) {
  const { concurrency, timeoutMs: timeout } = options
  const queue = new PQueue({ concurrency, timeout })
  for (let i = 0; i < items.length; i++) {
    await queue.add(async () => cb(items[i], i))
  }
  await queue.onEmpty()
  await queue.onIdle()
}
