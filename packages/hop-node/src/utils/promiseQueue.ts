import PQueue from 'p-queue'
import { chunk } from 'lodash'

export type Options = {
  concurrency: number
  timeoutMs?: number
}

export async function promiseQueue (items: any[], cb: any, options: Options) {
  return promiseQueueConcurrent(items, cb, options)
}

async function promiseQueueChunk (items: any[], cb: any, options: Options) {
  const { concurrency } = options
  const allChunks = chunk(items, concurrency)
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
    queue.add(async () => await cb(items[i], i))
  }
  await queue.onEmpty()
  await queue.onIdle()
}
