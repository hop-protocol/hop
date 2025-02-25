import { wait } from '#utils/wait.js'
import { Hop, PriceFeed } from '@hop-protocol/v2-sdk'
import { SyncStateDb } from '#db/syncStateDb/index.js'
import { db } from '#db/index.js'
import { network, dbPath, rpcUrls, coingeckoApiKey } from '#config/index.js'
import { pgDb } from '#pgDb/index.js'

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
  skipChainIds?: string[]
}

export const defaultPollSeconds = 10

export class Indexer {
  sdk: Hop
  pollIntervalMs: number = defaultPollSeconds * 1000
  startBlocks: StartBlocks = {}
  endBlocks: EndBlocks = {}
  chainIds: Record<string, boolean> = {}
  skipChainIds: string[] = []
  priceFeed: PriceFeed

  paused: boolean = false
  syncIndex: number = 0
  db = db
  pgDb = pgDb
  eventsToSync: Record<string, any>

  constructor (options?: Options) {
    if (options?.pollIntervalSeconds) {
      this.pollIntervalMs = options?.pollIntervalSeconds * 1000
    }
    this.sdk = new Hop({
      network: network,
      batchBlocks: 10_000,
      contractAddresses: options?.sdkContractAddresses,
      signersOrProviders: Hop.getDefaultProviders(network)
    })
    this.sdk.setProviderUrls(rpcUrls)

    // console.log('sdk providers', this.sdk.signersOrProviders)

    this.priceFeed = new PriceFeed({
      coingecko: coingeckoApiKey
    })
    if (options?.startBlocks) {
      this.startBlocks = options.startBlocks
    }
    for (const chainId in this.startBlocks) {
      this.chainIds[chainId] = true
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
    if (Array.isArray(options?.skipChainIds)) {
      this.skipChainIds = options.skipChainIds
    }
    console.log('indexer skipChainIds', this.skipChainIds)

    this.eventsToSync = {
      BundleCommitted: new SyncStateDb(dbPath, 'BundleCommitted'),
      BundleForwarded: new SyncStateDb(dbPath, 'BundleForwarded'), // hub
      BundleReceived: new SyncStateDb(dbPath, 'BundleReceived'), // hub
      BundleSet: new SyncStateDb(dbPath, 'BundleSet'), // hub
      FeesSentToHub: new SyncStateDb(dbPath, 'FeesSentToHub'),
      MessageBundled: new SyncStateDb(dbPath, 'MessageBundled'),
      MessageExecuted: new SyncStateDb(dbPath, 'MessageExecuted'),
      MessageSent: new SyncStateDb(dbPath, 'MessageSent'),
      TransferSent: new SyncStateDb(dbPath, 'TransferSent'),
      TransferBonded: new SyncStateDb(dbPath, 'TransferBonded'),
      ClaimPosted: new SyncStateDb(dbPath, 'ClaimPosted'),
      ClaimReadded: new SyncStateDb(dbPath, 'ClaimReadded'),
      ClaimRemoved: new SyncStateDb(dbPath, 'ClaimRemoved'),
      BonderPreference: new SyncStateDb(dbPath, 'BonderPreference'),
    }
  }

  async start () {
    await this.pgDb.init()
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
        await Promise.all([
          this.pollPrices(),
          this.poll()
        ])
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
      'MessageSent',
      'TransferSent',
      'TransferBonded',
      'ClaimPosted',
      'ClaimReadded',
      'ClaimRemoved',
      'BonderPreference'
    ]

    const _events: any[] = []

    const promises = Object.keys(this.chainIds).map(async (chainId: string) => {
      if (this.skipChainIds.includes(chainId)) {
        return
      }
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
        return
      }

      const syncState = await _db.getSyncState(chainId)
      console.log('syncState', chainId, syncState)

      const provider = this.sdk.getProvider(chainId)
      if (!provider) {
        console.error('provider not found for chainId', chainId)
        return
      }
      let fromBlock = this.startBlocks[chainId]
      let headBlock = await provider.getBlockNumber()
      if (this.endBlocks[chainId]) {
        headBlock = this.endBlocks[chainId]
      }
      let toBlock = headBlock
      if (syncState?.toBlock) {
        fromBlock = syncState.toBlock as number + 1
        // if (chainId === '42069') {
        //   fromBlock = 866229
        // }
        // if (chainId === '84532') {
        //   fromBlock = 20620236
        // }
        // if (chainId === '11155420') {
        //   fromBlock = 18925085
        // }
        toBlock = headBlock
      }

      console.log('get', eventNames, 'chainId', chainId, 'fromBlock', fromBlock, 'toBlock', toBlock)
      const events: any[] = await this.sdk.getEvents({ eventNames, chainId, fromBlock, toBlock, fetchTxData: true })
      console.log('events', eventNames, events.length, fromBlock, toBlock, chainId)
      for (const event of events) {
        console.log('event', event)

        const _db = this.eventsToSync[event.context.eventName]
        if (!this.pgDb.events[event.context.eventName]) {
          console.error('event db found in pgDb', event.context.eventName)
          continue
        }

        const upsertData = { ...event.decoded, context: event.context }

        // TODO: better way of handling this
        if (event.context.eventName === 'TransferSent') {
          try {
            const dataDecoded = await this.sdk.getRailsGateway(chainId).helpers.decodeSendTxInputData(event.context.data)
            upsertData.context.dataDecoded = dataDecoded
          } catch (err: any) {
            console.warn('decodeSendTxInputData error', err)
          }
        } else if (event.context.eventName === 'TransferBonded') {
          try {
            const dataDecoded = await this.sdk.getRailsGateway(chainId).helpers.decodeBondTxInputData(event.context.data)
            upsertData.context.dataDecoded = dataDecoded
          } catch (err: any) {
            console.warn('decodeSendTxInputData error', err)
          }
        }

        await this.pgDb.events[event.context.eventName].upsertItem(upsertData)
        await _db.putSyncState(chainId, { fromBlock, toBlock })
        _events.push(event)
      }
      await _db.putSyncState(chainId, { fromBlock, toBlock })
    })

    await Promise.all(promises)

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
    return this.waitForSyncIndex(syncIndex)
  }

  getIsL1 (chainId: string) {
    return chainId === '5' || chainId === '1' || chainId === '11155111'
  }

  async pollPrices () {
    console.log('poll prices start')

    const tokens = new Set(this.sdk.getSupportedTokenSymbols()) // TODO: read from db list of tokens
    tokens.add('ETH')
    for  (const token of tokens) {
      let tokenLookup = token
      if (tokenLookup === 'MOCK') {
        tokenLookup = 'DOGE' // for testing, give fake token MOCK a price
      }
      const price = await this.priceFeed.getPriceByTokenSymbol(tokenLookup)
      await this.pgDb.priceTable.upsertItem({
        token,
        priceUsd: price,
        timestamp: Math.floor(Date.now() / 1000)
      })
    }

    console.log('poll prices done')
  }
}
