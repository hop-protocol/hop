import { Contract } from 'ethers'
import { EventEmitter } from 'events'
import Logger from 'src/logger'
import { Notifier } from 'src/notifier'
import { hostname } from 'src/config'
import L1Bridge from './L1Bridge'
import L2Bridge from './L2Bridge'
import { IBaseWatcher } from './IBaseWatcher'

interface Config {
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

class BaseWatcher extends EventEmitter implements IBaseWatcher {
  logger: Logger
  notifier: Notifier
  order: () => number = () => 0
  started: boolean = false
  pollIntervalSec: number = 10 * 1000
  resyncIntervalSec: number = 10 * 60 * 1000

  isL1: boolean
  bridge: L2Bridge | L1Bridge
  siblingWatchers: { [chainId: string]: any }
  dryMode: boolean
  tag: string
  prefix: string

  constructor (config: Config) {
    super()
    const { tag, prefix, order, logColor } = config
    this.logger = new Logger({
      tag,
      prefix,
      color: logColor
    })
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

  async syncUp () {
    // virtual method
  }

  async watch () {
    // virtual method
  }

  async pollCheck () {
    // virtual method
  }

  async start () {
    this.started = true
    try {
      await Promise.all([this.syncUp(), this.watch(), this.pollCheck()])
    } catch (err) {
      this.logger.error(`watcher error:`, err.message)
      this.notifier.error(`watcher error: '${err.message}`)
      this.quit()
    }
  }

  async stop (): Promise<void> {
    this.bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  hasSiblingWatcher (chainId: number): boolean {
    return this.siblingWatchers && !!this.siblingWatchers[chainId]
  }

  getSiblingWatcherByChainSlug (chainSlug: string): any {
    return this.siblingWatchers[this.chainSlugToId(chainSlug)]
  }

  getSiblingWatcherByChainId (chainId: number): any {
    if (!this.hasSiblingWatcher(chainId)) {
      throw new Error(`sibling watcher for chain id ${chainId} not found. Check configuration`)
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
    process.exit(1)
  }
}

export default BaseWatcher
