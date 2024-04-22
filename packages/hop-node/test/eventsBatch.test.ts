import Bridge from '#watchers/classes/Bridge.js'
import contracts from '#contracts/index.js'
import expectDefined from './utils/expectDefined.js'
import { Chain, Token } from '@hop-protocol/hop-node-core/constants'
import { config as globalConfig } from '#config/index.js'

describe.skip('eventsBatch', () => {
  it(
    'eventsBatch',
    async () => {
      const { l2Bridge } = contracts.get(Token.USDC, Chain.Gnosis)
      const bridge = new Bridge(l2Bridge)
      expectDefined(globalConfig.sync)
      const { totalBlocks, batchBlocks } = globalConfig.sync[Chain.Gnosis]
      expectDefined(totalBlocks)
      expectDefined(batchBlocks)
      const maxIterations = Math.ceil(totalBlocks / batchBlocks)
      const remainder = totalBlocks % batchBlocks
      let iterations = 0

      expect(totalBlocks).toBeGreaterThanOrEqual(100000)
      expect(totalBlocks).toBeLessThan(500000)
      expect(batchBlocks).toBe(1000)

      await bridge.eventsBatch(
        async (start: number, end: number, i: number | undefined) => {
          iterations++
          if (iterations < maxIterations) {
            expect(end - start).toBe(batchBlocks)
          } else {
            expect(end - start).toBe(remainder - (i as number))
          }
        }
      )

      expect(iterations).toBe(maxIterations)
    },
    60 * 1000
  )

  it(
    'eventsBatch with defined start and end block numbers',
    async () => {
      const { l2Bridge } = contracts.get(Token.USDC, Chain.Gnosis)
      const bridge = new Bridge(l2Bridge)
      expectDefined(globalConfig.sync)
      const { batchBlocks } = globalConfig.sync[Chain.Gnosis]
      expectDefined(batchBlocks)
      const endBlockNumber = 21519734
      const startBlockNumber = endBlockNumber - 123456
      const totalBlocks = endBlockNumber - startBlockNumber
      const maxIterations = Math.ceil(totalBlocks / batchBlocks)
      const remainder = totalBlocks % batchBlocks
      let iterations = 0

      expect(batchBlocks).toBe(1000)

      await bridge.eventsBatch(
        async (start: number, end: number, i: number | undefined) => {
          iterations++
          if (iterations === 1) {
            expect(end).toBe(endBlockNumber)
          }
          if (iterations < maxIterations) {
            expect(end - start).toBe(batchBlocks)
          } else {
            expect(end - start).toBe(remainder - (i as number))
            expect(start).toBe(startBlockNumber)
          }
        },
        { startBlockNumber, endBlockNumber }
      )

      expect(iterations).toBe(maxIterations)
    },
    60 * 1000
  )

  it(
    'eventsBatch with syncCacheKey',
    async () => {
      const { l2Bridge } = contracts.get(Token.USDC, Chain.Gnosis)
      const bridge = new Bridge(l2Bridge)
      expectDefined(globalConfig.sync)
      const { totalBlocks, batchBlocks } = globalConfig.sync[Chain.Gnosis]
      expectDefined(totalBlocks)
      expectDefined(batchBlocks)
      const maxIterations = Math.floor(totalBlocks / batchBlocks)
      const remainder = totalBlocks % batchBlocks
      const halfway = Math.floor(maxIterations / 2)
      const syncCacheKey = `${Date.now()}`
      let iterations = 0

      expect(batchBlocks).toBe(1000)

      let firstStart = 0
      let firstEnd = 0

      let lastStart = 0
      let lastEnd = 0

      await bridge.eventsBatch(
        async (start: number, end: number, i: number | undefined) => {
          iterations++
          if (iterations === 1) {
            firstStart = start
            firstEnd = end
          }
          // exit halfway through
          if (iterations === halfway) {
            lastStart = start
            lastEnd = end
            return false
          }
          return true
        },
        { syncCacheKey }
      )

      expect(iterations).toBe(halfway)

      await bridge.eventsBatch(
        async (start: number, end: number, i: number | undefined) => {
          // eventsBatch resets when it encounters an error in process
          if (iterations === halfway) {
            expect(start).toBeGreaterThanOrEqual(firstStart)
            expect(end).toBeGreaterThanOrEqual(firstEnd)
          }
          iterations++
        },
        { syncCacheKey }
      )

      expect(iterations).toBeGreaterThanOrEqual(halfway + maxIterations)
      expect(iterations).toBeLessThanOrEqual(halfway + maxIterations + 1)
    },
    60 * 1000
  )
})
