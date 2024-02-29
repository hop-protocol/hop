import wait from 'wait'
// import { Hop } from '@hop-protocol/v2-sdk'
import { SyncStateDb } from '../db/syncStateDb'
import { db } from '../db'
import { dbPath, sdkContractAddresses } from 'src/config'
import { pgDb } from '../pgDb'

type StartBlocks = {
  [chainId: string]: number
}

type EndBlocks = {
  [chainId: string]: number
}

type Options = {
  dbPath?: string
  startBlocks: StartBlocks
  endBlocks?: EndBlocks // used for testing
  pollIntervalSeconds?: number
  sdkContractAddresses?: any
}

export const defaultPollSeconds = 10

export class Indexer {
  // TODO: fix sdk
  // sdk: Hop
  sdk: any
  pollIntervalMs: number = defaultPollSeconds * 1000
  startBlocks: StartBlocks = {}
  endBlocks: EndBlocks = {}
  chainIds: any = {
    5: true, // goerli
    420: true // goerli optimism
  }

  paused: boolean = false
  syncIndex: number = 0
  db = db
  pgDb = pgDb
  eventsToSync: Record<string, any>

  constructor (options?: Options) {
    if (options?.pollIntervalSeconds) {
      this.pollIntervalMs = options?.pollIntervalSeconds * 1000
    }
    // TODO: fix sdk
    // this.sdk = new Hop('goerli', {
    //   batchBlocks: 10_000,
    //   contractAddresses: options?.sdkContractAddresses ?? sdkContractAddresses
    // })
    if (options?.startBlocks) {
      this.startBlocks = options.startBlocks
    }
    for (const chainId in this.chainIds) {
      this.startBlocks[chainId] = this.startBlocks[chainId] ?? 0
    }
    if (options?.endBlocks) {
      this.endBlocks = options.endBlocks
    }
    for (const chainId in this.chainIds) {
      this.endBlocks[chainId] = this.endBlocks[chainId] ?? 0
    }
    if (options?.dbPath) {
      this.db.setDbPath(options.dbPath)
    }

    this.eventsToSync = {
      BundleCommitted: new SyncStateDb(dbPath, 'BundleCommitted'),
      BundleForwarded: new SyncStateDb(dbPath, 'BundleForwarded'), // hub
      BundleReceived: new SyncStateDb(dbPath, 'BundleReceived'), // hub
      BundleSet: new SyncStateDb(dbPath, 'BundleSet'), // hub
      FeesSentToHub: new SyncStateDb(dbPath, 'FeesSentToHub'),
      MessageBundled: new SyncStateDb(dbPath, 'MessageBundled'),
      MessageExecuted: new SyncStateDb(dbPath, 'MessageExecuted'),
      MessageSent: new SyncStateDb(dbPath, 'MessageSent')
    }
  }

  async start () {
    this.paused = false
    await this.startPoller()
  }

  async stop () {
    this.paused = true
  }

  async startPoller () {
    while (true) {
      if (this.paused) {
        return
      }
      try {
        await this.poll()
      } catch (err: any) {
        console.error('indexer poll error:', err)
      }
      await wait(this.pollIntervalMs)
    }
  }

  async syncEvents (): Promise<any[]> {
    const l1Events = ['BundleForwarded', 'BundleReceived']
    const baseEvents = [
      'BundleSet',
      'BundleCommitted',
      'FeesSentToHub',
      'MessageBundled',
      'MessageExecuted',
      'MessageSent'
    ]

    const _events: any[] = []

    for (const _chainId in this.chainIds) {
      const chainId = Number(_chainId)
      const isL1 = this.getIsL1(chainId)
      let _db: any
      let eventNames: string[] = []

      if (isL1) {
        _db = this.eventsToSync[l1Events[0]]
        eventNames = baseEvents.concat(...l1Events)
      } else {
        _db = this.eventsToSync[baseEvents[0]]
        eventNames = baseEvents
      }

      if (!_db) {
        continue
      }

      const syncState = await _db.getSyncState(chainId)
      console.log('syncState', chainId, syncState)

      // TODO: fix sdk
      // const provider = this.sdk.getRpcProvider(chainId)
      const provider : any = null
      let fromBlock = this.startBlocks[chainId]
      let headBlock = await provider.getBlockNumber()
      if (this.endBlocks[chainId]) {
        headBlock = this.endBlocks[chainId]
      }
      let toBlock = headBlock
      if (syncState?.toBlock) {
        fromBlock = syncState.toBlock as number + 1
        toBlock = headBlock
      }

      console.log('get', eventNames, chainId, fromBlock, toBlock)
      // TODO: fix sdk
      // const events = await this.sdk.getEvents({ eventNames, chainId, fromBlock, toBlock })
      const events : any[] = []
      console.log('events', eventNames, events.length)
      for (const event of events) {
        console.log('event', event)

        const _db = this.eventsToSync[event.eventName]
        await this.pgDb.events[event.eventName].upsertItem({ ...event, context: event.context })
        await _db.putSyncState(chainId, { fromBlock, toBlock })
        _events.push(event)
      }
      await _db.putSyncState(chainId, { fromBlock, toBlock })
    }

    return _events
  }

  async poll () {
    console.log('poll start')

    const events = await this.syncEvents()

    this.syncIndex++
    console.log('poll done')
  }

  async waitForSyncIndex (syncIndex: number): Promise<boolean> {
    if (this.syncIndex === syncIndex) {
      return true
    }

    await wait(100)
    return await this.waitForSyncIndex(syncIndex)
  }

  getIsL1 (chainId: number) {
    return chainId === 5 || chainId === 1
  }
}
