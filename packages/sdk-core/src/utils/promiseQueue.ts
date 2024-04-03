// Since p-queue is ESM-only, we need to use require instead of import
let PQueue: any
(async() => {
  PQueue = require('p-queue')
})();

export type Options = {
  concurrency: number
}

export async function promiseQueue (items: any[], cb: any, options: Options) {
  const { concurrency } = options
  const queue = new PQueue({ concurrency })
  for (let i = 0; i < items.length; i++) {
    queue.add(async () => cb(items[i], i))
  }
  await queue.onEmpty()
  await queue.onIdle()
}
