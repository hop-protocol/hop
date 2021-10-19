import L1Bridge from './L1Bridge'
import L2Bridge from './L2Bridge'
import Logger from 'src/logger'
import Metrics from './Metrics'
import SyncWatcher from 'src/watchers/SyncWatcher'
import getRpcProvider from 'src/utils/getRpcProvider'
import wait from 'src/utils/wait'
import { BigNumber, Contract } from 'ethers'
import { Chain } from 'src/constants'
import { DbSet, getDbSet } from 'src/db'
import { EventEmitter } from 'events'
import { IBaseWatcher } from './IBaseWatcher'
import { Notifier } from 'src/notifier'
import { hostname } from 'src/config'

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
  stateUpdateAddress?: string
}

enum State {
  Normal = 0,
  DryMode = 1,
  PauseMode = 2,
  Exit = 3
}

class BaseWatcher extends EventEmitter implements IBaseWatcher {
  db: DbSet
  logger: Logger
  notifier: Notifier
  order: () => number = () => 0
  started: boolean = false
  pollIntervalMs: number = 10 * 1000
  chainSlug: string
  tokenSymbol: string

  isL1: boolean
  bridge: L2Bridge | L1Bridge
  siblingWatchers: { [chainId: string]: any }
  syncWatcher: SyncWatcher
  metrics = new Metrics()
  dryMode: boolean
  tag: string
  prefix: string
  pauseMode: boolean = false
  stateUpdateAddress: string

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
    this.db = getDbSet(tokenSymbol)
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
    if (config.stateUpdateAddress) {
      this.stateUpdateAddress = config.stateUpdateAddress
    }
    this.pollGasCost()
  }

  isAllSiblingWatchersInitialSyncCompleted (): boolean {
    return this.syncWatcher?.isAllSiblingWatchersInitialSyncCompleted()
  }

  async pollCheck () {
    while (true) {
      if (!this.started) {
        return
      }
      if (!this.pauseMode) {
        try {
          const shouldPoll = this.prePollHandler()
          if (shouldPoll) {
            await this.pollHandler()
          }
        } catch (err) {
          this.logger.error(`poll check error: ${err.message}\ntrace: ${err.stack}`)
          this.notifier.error(`poll check error: ${err.message}`)
        }
      } else {
        // Allow a paused bonder to go into dry mode or exit
        await this.handleStateSwitch()
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
        `sibling watcher for chain id ${chainId} not found. Check configuration`
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

  chainIdToSlug (chainId: number): Chain {
    return this.bridge.chainIdToSlug(chainId)
  }

  chainSlugToId (chainSlug: string): number {
    return this.bridge.chainSlugToId(chainSlug)
  }

  cacheKey (key: string) {
    return `${this.tag}:${key}`
  }

  handleStateSwitch = async () => {
    if (!this.stateUpdateAddress) {
      return
    }

    let state: number
    try {
      const l1ChainId = this.chainSlugToId(Chain.Ethereum)
      const l1Bridge = this.getSiblingWatcherByChainId(l1ChainId).bridge
      state = await l1Bridge.getStateUpdateStatus(this.stateUpdateAddress, this.bridge.chainId)
    } catch (err) {
      this.logger.log(`getStateUpdateStatus failed with ${err}`)
      return
    }

    this.setDryMode(state === State.DryMode)
    this.setPauseMode(state === State.PauseMode)

    if (state === State.Exit) {
      this.logger.error('exit mode enabled')
      this.quit()
    }
  }

  get isDryOrPauseMode () {
    return this.dryMode || this.pauseMode
  }

  setDryMode (enabled: boolean) {
    if (this.dryMode !== enabled) {
      this.logger.warn(`Dry mode updated: ${enabled}`)
      this.dryMode = enabled
    }
  }

  setPauseMode (enabled: boolean) {
    if (this.pauseMode !== enabled) {
      this.logger.warn(`Pause mode updated: ${enabled}`)
      this.pauseMode = enabled
    }
  }

  async pollGasCost () {
    while (true) {
      try {
        const timestamp = Math.floor(Date.now() / 1000)
        const deadline = 7 * 24 * 60 // 1 week
        const bridgeContract = this.bridge.bridgeContract.connect(getRpcProvider(this.chainSlug))
        const txOverrides = await this.bridge.txOverrides()
        const amount = BigNumber.from(0)
        const amountOutMin = BigNumber.from(1)
        const bonderFee = BigNumber.from(0)
        const bonder = await this.bridge.getConfigBonderAddress()
        txOverrides.from = bonder
        const transferNonce = `0x${'0'.repeat(64)}`
        let gasLimit: BigNumber
        let attemptSwap = false
        if (bridgeContract.estimateGas.bondWithdrawalAndDistribute) {
          attemptSwap = true
          const payload = [
            bonder,
            amount,
            transferNonce,
            bonderFee,
            txOverrides
          ]

          gasLimit = await bridgeContract.estimateGas.bondWithdrawal(...payload)
        } else {
          const payload = [
            bonder,
            amount,
            transferNonce,
            bonderFee,
            amountOutMin,
            deadline,
            txOverrides
          ]

          gasLimit = await bridgeContract.estimateGas.bondWithdrawalAndDistribute(...payload)
        }

        const data = await this.bridge.compareBonderDestinationFeeCost(
          bonderFee,
          gasLimit,
          this.chainSlug,
          this.tokenSymbol
        )
        console.log('gas limit', data)

        await this.db.gasCost.addGasCost({
          chain: this.chainSlug,
          token: this.tokenSymbol,
          timestamp,
          attemptSwap,
          gasCost: data.gasCost,
          gasCostUsd: Number(data.usdGasCostFormatted),
          gasPrice: data.gasPrice,
          gasLimit: data.gasLimit,
          tokenPrice: data.tokenUsdPrice,
          nativeTokenPrice: data.chainNativeTokenUsdPrice
        })

        // const nearest = await this.db.gasCost.getNearest(this.chainSlug, this.tokenSymbol, timestamp)
      } catch (err) {
        this.logger.error(`pollGasCost error: ${err.message}`)
      }
      await wait(30 * 1000)
    }
  }

  // force quit so docker can restart
  public async quit () {
    console.trace()
    this.logger.info('exiting')
    process.exit(1)
  }
}

export default BaseWatcher
