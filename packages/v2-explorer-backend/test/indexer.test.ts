import { Indexer } from '../src/indexer'

describe('Indexer', () => {
  it('should sync events to db', async () => {
    const dbPath = `/tmp/test/testdb/${Date.now()}`
    const indexerConfig = {
      dbPath,
      startBlocks: {
        5: 8082112,
        420: 3218800
      },
      endBlocks: {
        5: 8106941,
        420: 3327401
      },
      sdkContractAddresses: {
        5: {
          startBlock: 8095954,
          hubCoreMessenger: '0xE3F4c0B210E7008ff5DE92ead0c5F6A5311C4FDC',
          spokeCoreMessenger: '0xE3F4c0B210E7008ff5DE92ead0c5F6A5311C4FDC',
          ethFeeDistributor: '0xf6eED903Ac2A34E115547874761908DD3C5fe4bf'
        },
        420: {
          startBlock: 3218800,
          spokeCoreMessenger: '0xeA35E10f763ef2FD5634dF9Ce9ad00434813bddB',
          connector: '0x6be2E6Ce67dDBCda1BcdDE7D2bdCC50d34A7eD24'
        }
      }
    }
    const indexer = new Indexer(indexerConfig)

    const items = await indexer.db.messageSentEventsDb.getFromRange({ gt: 0 })
    expect(items.length).toBe(0)

    const chainId = 420
    let syncState = await indexer.db.messageSentEventsDb.getSyncState(chainId)
    expect(syncState).toBeNull()
    expect(syncState).toBeNull()

    indexer.start()
    await indexer.waitForSyncIndex(1)

    const updatedItems = await indexer.db.messageSentEventsDb.getFromRange({ gt: 0 })
    expect(updatedItems.length).toBeGreaterThan(1)

    syncState = await indexer.db.messageSentEventsDb.getSyncState(chainId)
    expect(syncState?.fromBlock).toBe(indexerConfig.startBlocks[chainId])
    expect(syncState?.toBlock).toBe(indexerConfig.endBlocks[chainId])
  }, 10 * 60 * 1000)
})
