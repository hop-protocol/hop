import PQueue from 'p-queue'

export type Options = {
  concurrency: number
}

export async function promiseQueue (items: any[], cb: any, options: Options) {
  const { concurrency } = options
  // TODO debug why PQueue is not being imported correctly when sdk-core is used in v2-sdk
  const queue = (PQueue as any)?.default ? new (PQueue as any).default({ concurrency }) : new PQueue({ concurrency })
  for (let i = 0; i < items.length; i++) {
    queue.add(async () => cb(items[i], i))
  }
  await queue.onEmpty()
  await queue.onIdle()
}
