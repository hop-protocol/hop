import { BigNumber } from 'ethers'
import { BundleCommittedEventsDb } from '../src/db/eventsDb/BundleCommittedEventsDb'

describe('BundleCommittedEventsDb', () => {
  it('should put, get, and update data', async () => {
    const dbPath = `/tmp/test/testdb/${Date.now()}`
    const db = new BundleCommittedEventsDb(dbPath)

    const data = {
      bundleId: '123',
      bundleRoot: '0x123',
      bundleFees: BigNumber.from(123),
      toChainId: 1,
      commitTime: 1000000000,
      context: {
        chainSlug: 'abc',
        chainId: 1,
        transactionHash: '0x456',
        transactionIndex: 0,
        logIndex: 0,
        blockNumber: 1000,
        blockTimestamp: 1000000000,
        from: '0x123',
        to: '0x123',
        value: '0',
        nonce: 1,
        gasLimit: 10000,
        gasUsed: 10000,
        gasPrice: '1',
        data: '0x'
      }
    }

    await db.putEvent(data.bundleId, data)
    expect(await db.getEvent(data.bundleId)).toStrictEqual(data)

    const updatedData = Object.assign({}, data, {
      toChainId: 2
    })

    await db.updateEvent(data.bundleId, { toChainId: 2 })

    expect(await db.getEvent(data.bundleId)).toStrictEqual(updatedData)
  }, 60 * 1000)

  it('should return multiple events for same property index', async () => {
    const dbPath = `/tmp/test/testdb/${Date.now()}`
    const db = new BundleCommittedEventsDb(dbPath)

    const events = [
      {
        bundleId: '123',
        bundleRoot: '0x123',
        bundleFees: BigNumber.from(123),
        toChainId: 1,
        commitTime: 1000000000,
        context: {
          chainSlug: 'abc',
          chainId: 1,
          transactionHash: '0x456',
          transactionIndex: 0,
          logIndex: 0,
          blockNumber: 1000,
          blockTimestamp: 1000000000,
          from: '0x123',
          to: '0x123',
          value: '0',
          nonce: 1,
          gasLimit: 10000,
          gasUsed: 10000,
          gasPrice: '1',
          data: '0x'
        }
      },
      {
        bundleId: '789',
        bundleRoot: '0x123',
        bundleFees: BigNumber.from(123),
        toChainId: 1,
        commitTime: 1000000000,
        context: {
          chainSlug: 'abc',
          chainId: 1,
          transactionHash: '0x456',
          transactionIndex: 0,
          logIndex: 0,
          blockNumber: 1000,
          blockTimestamp: 1000000000,
          from: '0x123',
          to: '0x123',
          value: '0',
          nonce: 1,
          gasLimit: 10000,
          gasUsed: 10000,
          gasPrice: '1',
          data: '0x'
        }
      }
    ]

    for (const event of events) {
      await db.putEvent(event.bundleId, event)
      expect(await db.getEvent(event.bundleId)).toStrictEqual(event)
    }

    const items = await db.getEventsByPropertyIndex('context.transactionHash', '0x456')
    expect(items?.length).toEqual(2)
    expect(items?.[0].bundleId).toEqual('123')
    expect(items?.[1].bundleId).toEqual('789')
  }, 60 * 1000)
})
