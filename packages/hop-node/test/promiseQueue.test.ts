import { wait } from '@hop-protocol/hop-node-core/utils'
import { promiseQueue } from '@hop-protocol/hop-node-core/utils'

test(
  'promiseQueue',
  async () => {
    const data = []

    for (let i = 0; i < 100; i++) {
      data.push(i)
    }

    console.time('elapsed')
    await promiseQueue(data, async (item: any, i: number) => {
      console.log(`processing #${i}: ${item}`)
      await wait(2 * 1000)
    }, { concurrency: 25 })
    console.timeEnd('elapsed')
  },
  60 * 1000
)
