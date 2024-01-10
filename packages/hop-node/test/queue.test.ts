import wait from 'src/utils/wait'
import { Mutex } from 'async-mutex'

const DELAY_SECONDS = 1
const ITERATIONS = 5

class Test {
  mutex: Mutex = new Mutex()
  async getValue () {
    return this.mutex.runExclusive(async () => {
      await wait(DELAY_SECONDS * 1000)
      return (Date.now() / 1000) | 0
    })
  }
}

test(
  'queue',
  async () => {
    const t = new Test()
    const values = await Promise.all(
      Array(ITERATIONS)
        .fill('0')
        .map(async () => t.getValue())
    )

    for (let i = 0; i < values.length - 1; i++) {
      console.log(values[i])
      expect(values[i] + DELAY_SECONDS).toEqual(values[i + 1])
    }
  },
  60 * 1000
)
