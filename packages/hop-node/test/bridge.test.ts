require('dotenv').config()
import contracts from 'src/contracts'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import { config } from 'src/config'
import db from 'src/db'

const token = 'USDC'
const network = 'ethereum'
const tokenContracts = contracts.get(token, network)
const bridgeContract = tokenContracts.l1Bridge
const bridge = new L1Bridge(bridgeContract)
let { totalBlocks, batchBlocks } = config.sync[network]

describe('Happy Path', () => {
  test('Full loop', async () => {
    let count = 0
    await bridge.eventsBatch(
      async (start: number, end: number, index: number) => {
        expect(index).toBe(count)
        expect(end).toBe(start + batchBlocks)
        count++
      }
    )

    const totalCount = totalBlocks / batchBlocks
    expect(count).toBe(totalCount)
  })

  test('Single Batch', async () => {
    const startBlockNumber = 100
    const endBlockNumber = 150
    const totalBlocks = endBlockNumber - startBlockNumber

    let count = 0
    await bridge.eventsBatch(
      async (start: number, end: number, index: number) => {
        expect(index).toBe(count)
        expect(end).toBe(start + totalBlocks)
        count++
      }, { startBlockNumber, endBlockNumber }
    )

    // const totalCount = 1
    // expect(count).toBe(totalCount)
  })

  test('Use an unused key', async () => {
    const key: string = 'testKey' + Math.random().toString()
    let count = 0

    await bridge.eventsBatch(
      async (start: number, end: number, index: number) => {
        expect(index).toBe(count)
        expect(end).toBe(start + batchBlocks)
        count++
      }, { key }
    )

    const totalCount = totalBlocks / batchBlocks
    expect(count).toBe(totalCount)
  })

  test('Use a used key', async () => {
    const key: string = 'testingKey'
    const chainId = await bridge.getChainId()
    const address = bridge.getAddress()
    const cacheKey = bridge.getCacheKeyFromKey(chainId, address, key)
    let state = await db.syncState.getByKey(cacheKey)

    // Create entry for key if it does not exist
    if (!state) {
      let count = 0
      await bridge.eventsBatch(
        async (start: number, end: number, index: number) => {
          expect(index).toBe(count)
          expect(end).toBe(start + batchBlocks)
          count++
        }, { key }
      )
    }

    state = await db.syncState.getByKey(cacheKey)
    expect(state.latestBlockSynced).toBeDefined()
    expect(state.timestamp).toBeDefined()

    const latestBlockSynced = state.latestBlockSynced
    const timestamp = state.timestamp

    let count = 0
    await bridge.eventsBatch(
      async (start: number, end: number, index: number) => {
        expect(index).toBe(count)
        count++
      }, { key }
    )

    state = await db.syncState.getByKey(cacheKey)
    expect(state.latestBlockSynced).toBeGreaterThan(latestBlockSynced)
    expect(state.timestamp).toBeGreaterThan(timestamp)
    expect(count).toBe(1)
  })

  test('Loop is exited because false was returned', async () => {
    const expectedCount = 5
    let count = 0
    await bridge.eventsBatch(
      async (start: number, end: number, index: number) => {
        expect(index).toBe(count)
        expect(end).toBe(start + batchBlocks)

        count++
        if (index === expectedCount) {
          return false
        }
      }
    )

    expect(count - 1).toBe(expectedCount)
  })

  test('Loop is exited because true was returned', async () => {
    const expectedCount = 5
    let count = 0
    await bridge.eventsBatch(
      async (start: number, end: number, index: number) => {
        expect(index).toBe(count)
        expect(end).toBe(start + batchBlocks)

        count++
        if (index === expectedCount) {
          return true
        }
      }
    )

    const totalCount = totalBlocks / batchBlocks
    expect(count).toBe(totalCount)
  })

  test('Total blocks in chain is lower than our total blocks config', async () => {
    // TODO: Test the case where the chain has less than our total counter
  })
})

describe('Non-Happy Path', () => {
  test('Only one of startBlockNumber or endBlockNumber are defined', async () => {
    const startBlockNumber = 100
    const endBlockNumber = 150

    try {
      await bridge.eventsBatch(
        async (start: number, end: number, index: number) => {
        }, { startBlockNumber }
      )
    } catch (err) {
      expect(err.message).toBe('If either a start or end block number exist, both must exist')
    }

    try {
      await bridge.eventsBatch(
        async (start: number, end: number, index: number) => {
        }, { endBlockNumber }
      )
    } catch (err) {
      expect(err.message).toBe('If either a start or end block number exist, both must exist')
    }
  })

  test('Pass in a negative start and negative end block number', async () => {
    const startBlockNumber = -150
    const endBlockNumber = -100

    try {
      await bridge.eventsBatch(
        async (start: number, end: number, index: number) => {
        }, { startBlockNumber, endBlockNumber }
      )
    } catch (err) {
      expect(err.message).toBe('Cannot pass in a start or end block that is less than 0')
    }

    try {
      await bridge.eventsBatch(
        async (start: number, end: number, index: number) => {
        }, { startBlockNumber, endBlockNumber }
      )
    } catch (err) {
      expect(err.message).toBe('Cannot pass in a start or end block that is less than 0')
    }
  })

  test('startBlockNumber, endBlockNumber, and key are defined', async () => {
    const startBlockNumber = 100
    const endBlockNumber = 150
    const key = 'testKey'

    try {
      await bridge.eventsBatch(
        async (start: number, end: number, index: number) => {
        }, { startBlockNumber, endBlockNumber, key }
      )
    } catch (err) {
      expect(err.message).toBe('A key cannot exist when a start and end block are explicitly defined')
    }
  })

  test('startBlockNumber is greater than endBlockNumber', async () => {
    let startBlockNumber = 100
    let endBlockNumber = 150

    try {
      await bridge.eventsBatch(
        async (start: number, end: number, index: number) => {
        }, { startBlockNumber, endBlockNumber }
      )
    } catch (err) {
      expect(err.message).toBe('Cannot pass in an end block that is before a start block')
    }

    endBlockNumber = 100
    try {
      await bridge.eventsBatch(
        async (start: number, end: number, index: number) => {
        }, { startBlockNumber, endBlockNumber }
      )
    } catch (err) {
      expect(err.message).toBe('Cannot pass in an end block that is before a start block')
    }
  })
})
