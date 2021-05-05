import { Contract } from 'ethers'
import { EventEmitter } from 'events'
import Logger from 'src/logger'
import { Notifier } from 'src/notifier'
import { hostname } from 'src/config'
import L1Bridge from './L1Bridge'
import L2Bridge from './L2Bridge'

interface Config {
  tag: string
  prefix?: string
  logColor?: string
  order?: () => number

  isL1?: boolean
  bridgeContract?: Contract
}

class BaseWatcher extends EventEmitter {
  logger: Logger
  notifier: Notifier
  order: () => number = () => 0
  started: boolean = false

  isL1: boolean
  bridge: L2Bridge | L1Bridge
  siblingWatchers: { [chainId: string]: any }

  constructor (config: Config) {
    super()
    const { tag, prefix, order, logColor } = config
    this.logger = new Logger({
      tag,
      prefix,
      color: logColor
    })
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
  }

  async start (): Promise<void> {
    this.logger.warn('not implemented: implement in child class')
  }

  async stop (): Promise<void> {
    this.logger.warn('not implemented: implement in child class')
  }

  setSiblingWatchers (watchers: any): void {
    this.siblingWatchers = watchers
  }
}

export default BaseWatcher
