import PQueue from 'p-queue'

export type Options = {
  concurrency: number
}

export async function promiseQueue (items: any[], cb: any, options: Options): Promise<void> {
  const { concurrency } = options
  // TODO debug why PQueue is not being imported correctly when sdk-core is used in v2-sdk
  let Q: any = PQueue
  if (Q?.default?.PQueue) {
    Q = Q.default.PQueue
  } else if (Q?.PQueue) {
    Q = Q.PQueue
  } else if (Q?.default) {
    Q = Q.default
  }
  const queue = new Q({ concurrency })
  for (let i = 0; i < items.length; i++) {
    queue.add(async () => cb(items[i], i))
  }
  await queue.onEmpty()
  await queue.onIdle()
}
