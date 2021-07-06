import { wait } from 'src/utils'
import { XDAI_TX_MAX_DELAY_MS } from 'src/constants'
import delay from 'src/decorators/delay'

const DELAY_SECONDS = 1
const ITERATIONS = 3

class Test {
  async getQueueGroup () {
    return 'xdai'
  }
  @delay
  async getValue () {
    await wait(DELAY_SECONDS * 1000)
    return (Date.now() / 1000) | 0
  }
}

test(
  'delayDecorator',
  async () => {
    const t = new Test()
    let start = Date.now()
    const values = await Promise.all(
      Array(ITERATIONS)
        .fill('0')
        .map(() => t.getValue())
    )
    for (let i = 0; i < values.length - 1; i++) {
      console.log(i, values[i])
    }
    let end = Date.now()
    let waitMs = end - start
    let expectedWaitMs = XDAI_TX_MAX_DELAY_MS * 2
    expect(waitMs).toBeGreaterThanOrEqual(expectedWaitMs)
    expect(waitMs).toBeLessThanOrEqual(expectedWaitMs + 2 * 1000)
  },
  60 * 1000
)
