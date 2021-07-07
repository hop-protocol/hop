import { config } from 'src/config'
import { wait } from 'src/utils'
import Bridge from 'src/watchers/classes/Bridge'
import { Chain, Token } from 'src/constants'
import contracts from 'src/contracts'

test(
  'eventsBatch',
  async () => {
    const { l2Bridge } = contracts.get(Token.USDC, Chain.xDai)
    const bridge = new Bridge(l2Bridge)
    const { totalBlocks, batchBlocks } = config.sync[Chain.xDai]
    const maxIterations = Math.round(totalBlocks / batchBlocks)
    let iterations = 0
    const remainder = Math.round(totalBlocks % batchBlocks)

    expect(totalBlocks).toBeGreaterThanOrEqual(100000)
    expect(totalBlocks).toBeLessThan(500000)
    expect(batchBlocks).toBe(1000)

    await bridge.eventsBatch(async (start: number, end: number, i: number) => {
      iterations++
      if (iterations < maxIterations) {
        expect(end - start).toBe(batchBlocks)
      } else {
        expect(end - start).toBe(remainder)
      }
    })

    expect(iterations).toBe(maxIterations)
  },
  60 * 1000
)
