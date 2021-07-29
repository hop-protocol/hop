import L1Bridge from './L1Bridge'
import L2Bridge from './L2Bridge'
import Logger from 'src/logger'
import db from 'src/db'
import { Contract } from 'ethers'
import { EventEmitter } from 'events'
import { IBaseWatcher } from './IBaseWatcher'
import { Notifier } from 'src/notifier'
import { boundClass } from 'autobind-decorator'
import { hostname } from 'src/config'
import { wait } from 'src/utils'

interface Config {
  chainSlug: string
  tokenSymbol: string
  tag: string
  prefix?: string
  logColor?: string
  order?: () => number
  isL1?: boolean
  bridgeContract?: Contract
  dryMode?: boolean
}

interface EventsBatchOptions {
  key?: string
  startBlockNumber?: number
  endBlockNumber?: number
}

@boundClass
class BaseWatcher extends EventEmitter implements IBaseWatcher {
  db: any
  logger: Logger
  notifier: Notifier
  order: () => number = () => 0
  started: boolean = false
  pollIntervalMs: number = 10 * 1000
  resyncIntervalMs: number = 60 * 1000
  chainSlug: string
  tokenSymbol: string
  initialSyncCompleted: boolean = false

  isL1: boolean
  bridge: L2Bridge | L1Bridge
  siblingWatchers: { [chainId: string]: any }
  dryMode: boolean
  tag: string
  prefix: string
  syncIndex: number = 0

  constructor (config: Config) {
    super()
    const { chainSlug, tokenSymbol, tag, prefix, order, logColor } = config
    this.logger = new Logger({
      tag,
      prefix,
      color: logColor
    })
    this.chainSlug = chainSlug
    this.tokenSymbol = tokenSymbol
    this.db = db.getDbSet(tokenSymbol)
    if (tag) {
      this.tag = tag
    }
    if (prefix) {
      this.prefix = prefix
    }
    if (order) {
      this.order = order
    }
    this.notifier = new Notifier(
      `watcher: ${tag}, label: ${prefix}, host: ${hostname}`
    )
    if (config.isL1) {
      this.isL1 = config.isL1
    }
    if (config.bridgeContract) {
      if (this.isL1) {
        this.bridge = new L1Bridge(config.bridgeContract)
      } else {
        this.bridge = new L2Bridge(config.bridgeContract)
      }
    }
    if (config.dryMode) {
      this.dryMode = config.dryMode
    }
  }

  async pollSync () {
    while (true) {
      await this.preSyncHandler()
      await this.syncHandler()
      await this.postSyncHandler()
    }
  }

  async preSyncHandler () {
    this.logger.debug('syncing up events. index:', this.syncIndex)
  }

  async syncHandler () {
    // virtual method
  }

  async postSyncHandler () {
    this.logger.debug('done syncing. index:', this.syncIndex)
    this.initialSyncCompleted = true
    this.syncIndex++
    await wait(this.resyncIntervalMs)
  }

  async pollCheck () {
    while (true) {
      if (!this.started) {
        return
      }
      try {
        await this.prePollHandler()
        await this.pollHandler()
      } catch (err) {
        this.logger.error(`poll check error: ${err.message}`)
        this.notifier.error(`poll check error: ${err.message}`)
        console.trace()
      }
      await this.postPollHandler()
    }
  }

  async prePollHandler () {
    // empty by default
  }

  async pollHandler () {
    // virtual method
  }

  async postPollHandler () {
    await wait(this.pollIntervalMs)
  }

  async start () {
    await this.bridge.waitTilReady()
    // TODO: Instantiate this in Bridge.ts
    this.bridge.bridgeDeployedBlockNumber = this.bridge.getDeployedBlockNumber()
    this.started = true
    try {
      await Promise.all([this.pollSync(), this.pollCheck()])
    } catch (err) {
      this.logger.error('base watcher error:', err.message)
      this.notifier.error(`base watcher error: '${err.message}`)
      console.trace()
      this.quit()
    }
  }

  async stop (): Promise<void> {
    this.bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  isInitialSyncCompleted (): boolean {
    return this.initialSyncCompleted
  }

  isAllSiblingWatchersInitialSyncCompleted (): boolean {
    return Object.values(this.siblingWatchers).every(
      (siblingWatcher: BaseWatcher) => {
        return siblingWatcher.isInitialSyncCompleted()
      }
    )
  }

  hasSiblingWatcher (chainId: number): boolean {
    return this.siblingWatchers && !!this.siblingWatchers[chainId]
  }

  getSiblingWatcherByChainSlug (chainSlug: string): any {
    return this.siblingWatchers[this.chainSlugToId(chainSlug)]
  }

  getSiblingWatcherByChainId (chainId: number): any {
    if (!this.hasSiblingWatcher(chainId)) {
      throw new Error(
        `sibling watcher for chain id ${chainId} not found. Check configuration`
      )
    }
    return this.siblingWatchers[chainId]
  }

  setSiblingWatchers (watchers: any): void {
    this.siblingWatchers = watchers
  }

  chainIdToSlug (chainId: number): string {
    return this.bridge.chainIdToSlug(chainId)
  }

  chainSlugToId (chainSlug: string): number {
    return this.bridge.chainSlugToId(chainSlug)
  }

  cacheKey (key: string) {
    return `${this.tag}:${key}`
  }

  // force quit so docker can restart
  public async quit () {
    console.trace()
    this.logger.info('exiting')
    process.exit(1)
  }
}

export default BaseWatcher
