import AvailableLiquidityWatcher from 'src/watchers/AvailableLiquidityWatcher'
import BNMin from 'src/utils/BNMin'
import L1Bridge from './L1Bridge'
import L2Bridge from './L2Bridge'
import Logger from 'src/logger'
import Metrics from './Metrics'
import SyncWatcher from 'src/watchers/SyncWatcher'
import wait from 'src/utils/wait'
import wallets from 'src/wallets'
import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import { DbSet, getDbSet } from 'src/db'
import { EventEmitter } from 'events'
import { IBaseWatcher } from './IBaseWatcher'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Mutex } from 'async-mutex'
import { Notifier } from 'src/notifier'
import { Vault } from 'src/vault'
import { config as globalConfig, hostname } from 'src/config'

const mutexes: Record<string, Mutex> = {}
export type BridgeContract = L1BridgeContract | L2BridgeContract

type Config = {
  chainSlug: string
  tokenSymbol: string
  prefix?: string
  logColor?: string
  bridgeContract?: BridgeContract
  dryMode?: boolean
}

class BaseWatcher extends EventEmitter implements IBaseWatcher {
  db: DbSet
  logger: Logger
  notifier: Notifier
  started: boolean = false
  pollIntervalMs: number = 10 * 1000
  chainSlug: string
  tokenSymbol: string

  bridge: L2Bridge | L1Bridge
  siblingWatchers: { [chainId: string]: any }
  syncWatcher: SyncWatcher
  availableLiquidityWatcher: AvailableLiquidityWatcher
  metrics = new Metrics()
  dryMode: boolean = false
  tag: string
  prefix: string
  vault?: Vault
  mutex: Mutex

  constructor (config: Config) {
    super()
    const { chainSlug, tokenSymbol, logColor } = config
    const prefix = `${chainSlug}.${tokenSymbol}`
    const tag = this.constructor.name
    this.logger = new Logger({
      tag,
      prefix,
      color: logColor
    })
    this.chainSlug = chainSlug
    this.tokenSymbol = tokenSymbol
    this.db = getDbSet(tokenSymbol)
    if (tag) {
      this.tag = tag
    }
    if (prefix) {
      this.prefix = prefix
    }
    this.notifier = new Notifier(
      `watcher: ${tag}, label: ${prefix}, host: ${hostname}`
    )
    if (config.bridgeContract != null) {
      if (this.isL1) {
        this.bridge = new L1Bridge(config.bridgeContract as L1BridgeContract)
      } else {
        this.bridge = new L2Bridge(config.bridgeContract as L2BridgeContract)
      }
    }
    if (config.dryMode) {
      this.dryMode = config.dryMode
    }
    const signer = wallets.get(this.chainSlug)
    this.vault = Vault.from(this.chainSlug as Chain, this.tokenSymbol, signer)
    if (!mutexes[this.chainSlug]) {
      mutexes[this.chainSlug] = new Mutex()
    }

    this.mutex = mutexes[this.chainSlug]
  }

  get isL1 (): boolean {
    return this.chainSlug === Chain.Ethereum
  }

  isAllSiblingWatchersInitialSyncCompleted (): boolean {
    return this.syncWatcher?.isAllSiblingWatchersInitialSyncCompleted() ?? false
  }

  async pollCheck () {
    while (true) {
      if (!this.started) {
        return
      }
      try {
        const shouldPoll = this.prePollHandler()
        if (shouldPoll) {
          await this.pollHandler()
        }
      } catch (err) {
        this.logger.error(`poll check error: ${err.message}\ntrace: ${err.stack}`)
        this.notifier.error(`poll check error: ${err.message}`)
      }
      await this.postPollHandler()
    }
  }

  prePollHandler (): boolean {
    const initialSyncCompleted = this.isAllSiblingWatchersInitialSyncCompleted()
    if (!initialSyncCompleted) {
      return false
    }

    return true
  }

  async pollHandler () {
    // virtual method
  }

  async postPollHandler () {
    await wait(this.pollIntervalMs)
  }

  async start () {
    this.started = true
    try {
      await this.pollCheck()
    } catch (err) {
      this.logger.error(`base watcher error: ${err.message}\ntrace: ${err.stack}`)
      this.notifier.error(`base watcher error: ${err.message}`)
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
      throw new Error(
        `sibling watcher (chainId: ${chainId}) not found. Check configuration`
      )
    }
    return this.siblingWatchers[chainId]
  }

  setSiblingWatchers (watchers: any): void {
    this.siblingWatchers = watchers
  }

  setSyncWatcher (syncWatcher: SyncWatcher): void {
    this.syncWatcher = syncWatcher
  }

  setAvailableLiquidityWatcher (availableLiquidityWatcher: AvailableLiquidityWatcher): void {
    this.availableLiquidityWatcher = availableLiquidityWatcher
  }

  chainIdToSlug (chainId: number): Chain {
    return this.bridge.chainIdToSlug(chainId)
  }

  chainSlugToId (chainSlug: string): number {
    return this.bridge.chainSlugToId(chainSlug)
  }

  cacheKey (key: string) {
    return `${this.tag}:${key}`
  }

  async getFilterSourceChainId () {
    const sourceChainId = await this.bridge.getChainId()
    return sourceChainId
  }

  async getFilterDestinationChainIds () {
    const sourceChainId = await this.bridge.getChainId()
    let filterDestinationChainIds: number[] = []
    const customRouteSourceChains = Object.keys(globalConfig.routes)
    const hasCustomRoutes = customRouteSourceChains.length > 0
    if (hasCustomRoutes) {
      const isSourceRouteOk = customRouteSourceChains.includes(this.chainSlug)
      if (!isSourceRouteOk) {
        return filterDestinationChainIds
      }
      const customRouteDestinationChains = Object.keys(globalConfig.routes[this.chainSlug])
      filterDestinationChainIds = customRouteDestinationChains.map(chainSlug => this.chainSlugToId(chainSlug))
    }
    return filterDestinationChainIds
  }

  async getFilterRoute (): Promise<any> {
    const sourceChainId = await this.getFilterSourceChainId()
    const destinationChainIds = await this.getFilterDestinationChainIds()
    return {
      sourceChainId,
      destinationChainIds
    }
  }

  async unstakeAndDepositToVault (amount: BigNumber) {
    if (!this.vault) {
      return
    }

    if (this.chainSlug !== Chain.Ethereum) {
      return
    }

    const creditBalance = await this.bridge.getBaseAvailableCredit()
    if (amount.lt(creditBalance)) {
      return
    }

    this.logger.debug(`unstaking from bridge. amount: ${this.bridge.formatUnits(amount)}`)
    let tx = await this.bridge.unstake(amount)
    await tx.wait()

    this.logger.debug(`deposting to vault. amount: ${this.bridge.formatUnits(amount)}`)
    tx = await this.vault.deposit(amount)
    await tx.wait()
    this.logger.debug('unstake and vault deposit complete')
  }

  async withdrawFromVaultAndStake (amount: BigNumber) {
    if (!this.vault) {
      return
    }

    if (this.chainSlug !== Chain.Ethereum) {
      return
    }

    const vaultBalance = await this.vault.getBalance()
    if (amount.lt(vaultBalance)) {
      return
    }

    this.logger.debug(`withdrawing from vault. amount: ${this.bridge.formatUnits(amount)}`)
    let tx = await this.vault.withdraw(amount)
    await tx.wait()

    let balance: BigNumber
    if (this.tokenSymbol === 'ETH') {
      const address = await this.bridge.getBonderAddress()
      balance = await this.bridge.getBalance(address)
    } else {
      const token = await (this.bridge as L1Bridge).l1CanonicalToken()
      balance = await token.getBalance()
    }

    // this is needed because the amount withdrawn from vault may not be exact
    amount = BNMin(amount, balance)

    this.logger.debug(`staking on bridge. amount: ${this.bridge.formatUnits(amount)}`)
    tx = await this.bridge.stake(amount)
    await tx.wait()
    this.logger.debug('vault withdraw and stake complete')
  }

  // force quit so docker can restart
  public async quit () {
    console.trace()
    this.logger.info('exiting')
    process.exit(1)
  }
}

export default BaseWatcher
