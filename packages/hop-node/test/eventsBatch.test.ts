import { config } from 'src/config'
import { wait } from 'src/utils'
import Bridge from 'src/watchers/classes/Bridge'
import { Chain, Token } from 'src/constants'
import contracts from 'src/contracts'

describe('eventsBatch', () => {
  it(
    'eventsBatch',
    async () => {
      const { l2Bridge } = contracts.get(Token.USDC, Chain.xDai)
      const bridge = new Bridge(l2Bridge)
      const { totalBlocks, batchBlocks } = config.sync[Chain.xDai]
      const maxIterations = Math.round(totalBlocks / batchBlocks)
      const remainder = Math.round(totalBlocks % batchBlocks)
      let iterations = 0

      expect(totalBlocks).toBeGreaterThanOrEqual(100000)
      expect(totalBlocks).toBeLessThan(500000)
      expect(batchBlocks).toBe(1000)

      await bridge.eventsBatch(
        async (start: number, end: number, i: number) => {
          iterations++
          if (iterations < maxIterations) {
            expect(end - start).toBe(batchBlocks)
          } else {
            expect(end - start).toBe(remainder)
          }
        }
      )

      expect(iterations).toBe(maxIterations)
    },
    60 * 1000
  )

  it.skip(
    'eventsBatch with cacheKey',
    async () => {
      const { l2Bridge } = contracts.get(Token.USDC, Chain.xDai)
      const bridge = new Bridge(l2Bridge)
      const { totalBlocks, batchBlocks } = config.sync[Chain.xDai]
      const maxIterations = Math.round(totalBlocks / batchBlocks)
      const remainder = Math.round(totalBlocks % batchBlocks)
      const halfway = Math.round(maxIterations / 2)
      const cacheKey = `${Date.now()}`
      let iterations = 0

      expect(totalBlocks).toBeGreaterThanOrEqual(100000)
      expect(totalBlocks).toBeLessThan(500000)
      expect(batchBlocks).toBe(1000)

      let lastStart = 0
      let lastEnd = 0

      await bridge.eventsBatch(
        async (start: number, end: number, i: number) => {
          iterations++
          // exit halfway through
          if (iterations === halfway) {
            lastStart = start
            lastEnd = end
            return false
          }
          return true
        },
        { cacheKey }
      )

      expect(iterations).toBe(halfway)

      await bridge.eventsBatch(
        async (start: number, end: number, i: number) => {
          if (iterations === halfway) {
            expect(start).toBe(lastStart)
          }
          iterations++
        },
        { cacheKey }
      )

      expect(iterations).toBe(maxIterations)
    },
    60 * 1000
  )
})
