import PQueue from 'p-queue'

type Options = {
  concurrency: number
  timeoutMs?: number
}

export async function promiseQueue (items: any[], cb: any, options: Options): Promise<void> {
  return promiseQueueConcurrent(items, cb, options)
}

async function promiseQueueConcurrent (items: any[], cb: any, options: Options): Promise<void> {
  const { concurrency, timeoutMs: timeout } = options
  const queue = new PQueue({ concurrency, timeout })
  for (let i = 0; i < items.length; i++) {
    await queue.add(async () => cb(items[i], i))
  }
  await queue.onEmpty()
  await queue.onIdle()
}
