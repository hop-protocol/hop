import AvailableLiquidityWatcher from '#watchers/AvailableLiquidityWatcher.js'
import Bridge from './Bridge.js'
import L1Bridge from './L1Bridge.js'
import L2Bridge from './L2Bridge.js'
import { Logger } from '@hop-protocol/hop-node-core/logger'
import Metrics from './Metrics.js'
import SyncWatcher from '#watchers/SyncWatcher.js'
import { bigNumberMin } from '@hop-protocol/hop-node-core/utils'
import { getRpcProviderFromUrl } from '@hop-protocol/hop-node-core/utils'
import { wait } from '@hop-protocol/hop-node-core/utils'
import wallets from '@hop-protocol/hop-node-core/wallets'
import { BigNumber, constants } from 'ethers'
import {
  Chain
} from '@hop-protocol/hop-node-core/constants'
import { DbSet, getDbSet, isDbSetReady } from '#db/index.js'
import { EventEmitter } from 'node:events'
import {
  GasCostTransactionType,
  MaxReorgCheckBackoffIndex
} from '#constants/index.js'
import { IBaseWatcher } from './IBaseWatcher.js'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts'
import { Mutex } from 'async-mutex'
import { Notifier } from '@hop-protocol/hop-node-core/notifier'
import {
  PossibleReorgDetected,
  RedundantProviderOutOfSync
} from '@hop-protocol/hop-node-core/types'
import {
  TxRetryDelayMs,
  config as globalConfig
} from '#config/index.js'
import {
  hostname
} from '@hop-protocol/hop-node-core/config'
import { isFetchExecutionError } from '@hop-protocol/hop-node-core/utils'

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
    if (!mutexes[this.chainSlug]) {
      mutexes[this.chainSlug] = new Mutex()
    }

    this.mutex = mutexes[this.chainSlug]

    this.logger.debug(`tx retry delay: ${TxRetryDelayMs} ms`)
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
        await this.notifier.error(`poll check error: ${err.message}`)
      }
      await this.postPollHandler()
    }
  }

  prePollHandler (): boolean {
    const initialSyncCompleted = this.isAllSiblingWatchersInitialSyncCompleted()
    const dbSetReady = isDbSetReady(this.tokenSymbol)
    if (!initialSyncCompleted || !dbSetReady) {
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
      await this.notifier.error(`base watcher error: ${err.message}`)
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

  syncCacheKey (key: string) {
    return `${this.tag}:${key}`
  }

  async getFilterSourceChainId () {
    const sourceChainId = await this.bridge.getChainId()
    return sourceChainId
  }

  async getFilterDestinationChainIds () {
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

  async getIsRecipientReceivable (recipient: string, destinationBridge: Bridge, logger: Logger) {
    // PolygonZk RPC does not allow eth_call with a from address of 0x0.
    // TODO: More robust check for PolygonZk
    if (destinationBridge.chainSlug === Chain.PolygonZk) {
      return true
    }

    // It has been verified that all chains have at least 1 wei at 0x0.
    const tx = {
      from: constants.AddressZero,
      to: recipient,
      value: '1'
    }

    try {
      await destinationBridge.provider.call(tx)
      return true
    } catch (err) {
      const isRevertError = isFetchExecutionError(err.message)
      if (isRevertError) {
        logger.error(`getIsRecipientReceivable err: ${err.message}`)
        return false
      }
      logger.error(`getIsRecipientReceivable non-revert err: ${err.message}`)
      return true
    }
  }

  // force quit so docker can restart
  public quit () {
    console.trace()
    this.logger.info('exiting')
    process.exit(1)
  }

  async getIsFeeOk (
    transferId: string,
    transactionType: GasCostTransactionType
  ): Promise<boolean> {
    const logger = this.logger.create({ id: transferId })
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      throw new Error('expected db transfer item')
    }

    const { amount, bonderFee, relayerFee, sourceChainId, destinationChainId } = dbTransfer
    if (!amount || (!bonderFee && !relayerFee) || !sourceChainId || !destinationChainId) {
      throw new Error('expected complete dbTransfer data')
    }
    const sourceChain = this.chainIdToSlug(sourceChainId)
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const transferSentTimestamp = dbTransfer?.transferSentTimestamp
    if (!transferSentTimestamp) {
      throw new Error('expected transferSentTimestamp')
    }

    const now = Math.floor(Date.now() / 1000)
    const nearestItemToTransferSent = await this.db.gasCost.getNearest(destinationChain, this.tokenSymbol, transactionType, transferSentTimestamp)
    const nearestItemToNow = await this.db.gasCost.getNearest(destinationChain, this.tokenSymbol, transactionType, now)
    let gasCostInToken: BigNumber
    let minBonderFeeAbsolute: BigNumber

    if (nearestItemToTransferSent && nearestItemToNow) {
      ({ gasCostInToken, minBonderFeeAbsolute } = nearestItemToTransferSent)
      const { gasCostInToken: currentGasCostInToken, minBonderFeeAbsolute: currentMinBonderFeeAbsolute } = nearestItemToNow
      gasCostInToken = bigNumberMin(gasCostInToken, currentGasCostInToken)
      minBonderFeeAbsolute = bigNumberMin(minBonderFeeAbsolute, currentMinBonderFeeAbsolute)
      this.logger.debug('using nearestItemToTransferSent')
    } else if (nearestItemToNow) {
      ({ gasCostInToken, minBonderFeeAbsolute } = nearestItemToNow)
      this.logger.warn('nearestItemToTransferSent not found, using only nearestItemToNow')
    } else {
      throw new Error('expected nearestItemToTransferSent or nearestItemToNow')
    }

    logger.debug('gasCostInToken:', gasCostInToken?.toString())
    logger.debug('transactionType:', transactionType)

    const minTxFee = gasCostInToken.div(2)
    if (transactionType === GasCostTransactionType.Relay) {
      if (!relayerFee) {
        throw new Error('expected relayerFee')
      }
      const isRelayFeeOk = relayerFee.gte(minTxFee)
      logger.debug(`isRelayerFeeOk: relayerFee: ${relayerFee}, minTxFee: ${minTxFee}, isRelayFeeOk: ${isRelayFeeOk}`)
      return isRelayFeeOk
    }

    const sourceL2Bridge = this.getSiblingWatcherByChainSlug(sourceChain).bridge as L2Bridge
    const onChainBonderFeeAbsolute = await sourceL2Bridge.getOnChainMinBonderFeeAbsolute()

    minBonderFeeAbsolute = onChainBonderFeeAbsolute.gt(minBonderFeeAbsolute) ? onChainBonderFeeAbsolute : minBonderFeeAbsolute
    logger.debug('minBonderFeeAbsolute:', minBonderFeeAbsolute?.toString())

    const minBpsFee = await this.bridge.getBonderFeeBps(destinationChain, amount, minBonderFeeAbsolute)
    const minBonderFeeTotal = minBpsFee.add(minTxFee)
      if (!bonderFee) {
        throw new Error('expected relayerFee')
      }
    const isBonderFeeOk = bonderFee.gte(minBonderFeeTotal)
    logger.debug(`bonderFee: ${bonderFee}, minBonderFeeTotal: ${minBonderFeeTotal}, minBpsFee: ${minBpsFee}, isBonderFeeOk: ${isBonderFeeOk}`)

    this.logAdditionalBonderFeeData(bonderFee, minBonderFeeTotal, minBpsFee, gasCostInToken, destinationChain, transferId, logger)
    return isBonderFeeOk
  }

  logAdditionalBonderFeeData (
    bonderFee: BigNumber,
    minBonderFeeTotal: BigNumber,
    minBpsFee: BigNumber,
    gasCostInToken: BigNumber,
    destinationChain: string,
    transferId: string,
    logger: Logger
  ) {
    // Log how much additional % is being paid
    const precision = this.bridge.parseEth('1')
    const bonderFeeOverage = bonderFee.mul(precision).div(minBonderFeeTotal)
    logger.debug(`dest: ${destinationChain}, bonder fee overage: ${this.bridge.formatEth(bonderFeeOverage)}`)

    // Log how much additional % is being paid without destination tx fee buffer
    const minBonderFeeWithoutBuffer = minBpsFee.add(gasCostInToken)
    const bonderFeeOverageWithoutBuffer = bonderFee.mul(precision).div(minBonderFeeWithoutBuffer)
    logger.debug(`dest: ${destinationChain}, bonder fee overage (without buffer): ${this.bridge.formatEth(bonderFeeOverageWithoutBuffer)}`)

    const expectedMinBonderFeeOverage = precision
    if (bonderFeeOverage.lt(expectedMinBonderFeeOverage)) {
      const msg = `Bonder fee too low. bonder fee overage: ${this.bridge.formatEth(bonderFeeOverage)}, bonderFee: ${bonderFee}, minBonderFeeTotal: ${minBonderFeeTotal}, token: ${this.bridge.tokenSymbol}, sourceChain: ${this.bridge.chainSlug}, destinationChain: ${destinationChain}, transferId: ${transferId}`
      logger.warn(msg)
    }
  }

  async getRedundantRpcEventParams (
    logger: Logger,
    blockNumber: number,
    redundantRpcUrl: string,
    transferOrRootId: string,
    l2Bridge: L2BridgeContract,
    filter: any,
    backoffIndex: number = 0
  ): Promise<any> {
    const redundantProvider = getRpcProviderFromUrl(redundantRpcUrl)

    // If the redundant RPC provider is completely down (e.g. due to a network outage or an account hitting the daily limit),
    // then ignore it, since is the same as the bonder not providing a redundant provider in the first place
    let redundantBlockNumber
    try {
      redundantBlockNumber = await redundantProvider.getBlockNumber()
    } catch (err) {
      logger.debug(`redundantRpcUrl: ${redundantRpcUrl}, error getting block number: ${err.message}`)
      return
    }

    // If the redundant provider is not up to date to the block number, skip the check and try again later
    logger.debug(`redundantRpcUrl: ${redundantRpcUrl}, blockNumber: ${blockNumber}, redundantBlockNumber: ${redundantBlockNumber}`)
    if (!redundantBlockNumber || redundantBlockNumber < blockNumber) {
      throw new RedundantProviderOutOfSync(`redundantRpcUrl ${redundantRpcUrl} is not synced to block ${blockNumber}. It is only synced to ${redundantBlockNumber}`)
    }

    logger.debug(`redundantRpcUrl: ${redundantRpcUrl}, query filter: ${JSON.stringify(filter)}`)
    const events = await l2Bridge.connect(redundantProvider).queryFilter(filter, blockNumber, blockNumber)
    logger.debug(`events found: ${JSON.stringify(events)}`)
    const eventParams = events.find((x: any) => (x?.args?.transferId ?? x?.args?.rootHash) === transferOrRootId)
    if (!eventParams) {
      // Some providers have an up-to-date head but their logs don't reflect this yet. Try again to give provider time to catch up. If they don't catch up, this is a reorg
      if (backoffIndex <= MaxReorgCheckBackoffIndex) {
        throw new RedundantProviderOutOfSync(`out of sync. redundant event not found for transferOrRootId ${transferOrRootId} at block ${blockNumber}, redundantRpcUrl: ${redundantRpcUrl}, query filter: ${JSON.stringify(filter)}, backoffIndex: ${backoffIndex}`)
      }
      throw new PossibleReorgDetected(`possible reorg. redundant event not found for transferOrRootId ${transferOrRootId} at block ${blockNumber}, redundantRpcUrl: ${redundantRpcUrl}, query filter: ${JSON.stringify(filter)}, backoffIndex: ${backoffIndex}`)
    }

    if (!eventParams?.args) {
      throw new RedundantProviderOutOfSync(`eventParams.args not found for transferOrRootId ${transferOrRootId}, eventParams: ${JSON.stringify(eventParams)}, redundantRpcUrl: ${redundantRpcUrl}, query filter: ${JSON.stringify(filter)}, backoffIndex: ${backoffIndex}`)
    }

    return eventParams
  }
}

export default BaseWatcher
