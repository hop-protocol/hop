import AvailableLiquidityWatcher from 'src/watchers/AvailableLiquidityWatcher'
import Bridge from './Bridge'
import L1Bridge from './L1Bridge'
import L2Bridge from './L2Bridge'
import Logger from 'src/logger'
import Metrics from './Metrics'
import SyncWatcher from 'src/watchers/SyncWatcher'
import bigNumberMin from 'src/utils/bigNumberMin'
import getRpcProviderFromUrl from 'src/utils/getRpcProviderFromUrl'
import wait from 'src/utils/wait'
import wallets from 'src/wallets'
import { AssetSymbol, ChainSlug } from '@hop-protocol/core/config'
import { BigNumber, constants } from 'ethers'
import {
  Chain,
  GasCostTransactionType,
  MaxReorgCheckBackoffIndex
} from 'src/constants'
import { DbSet, getDbSet, isDbSetReady } from 'src/db'
import { EventEmitter } from 'events'
import { IBaseWatcher } from './IBaseWatcher'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { Mutex } from 'async-mutex'
import { Notifier } from 'src/notifier'
import {
  PossibleReorgDetected,
  RedundantProviderOutOfSync
} from 'src/types/error'
import { Strategy, Vault } from 'src/vault'
import {
  TxRetryDelayMs,
  config as globalConfig,
  hostname
} from 'src/config'
import { isFetchExecutionError } from 'src/utils/isFetchExecutionError'
import { isNativeToken } from 'src/utils/isNativeToken'

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
    const vaultConfig = globalConfig.vault
    if (vaultConfig[this.tokenSymbol as AssetSymbol]?.[this.chainSlug as ChainSlug]) {
      const strategy = vaultConfig[this.tokenSymbol as AssetSymbol]?.[this.chainSlug as ChainSlug]?.strategy as Strategy
      if (strategy) {
        this.logger.debug(`setting vault instance. strategy: ${strategy}, chain: ${this.chainSlug}, token: ${this.tokenSymbol}`)
        this.vault = Vault.from(strategy, this.chainSlug as Chain, this.tokenSymbol, signer)
      }
    }
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

  async unstakeAndDepositToVault (amount: BigNumber) {
    if (!this.vault) {
      return
    }

    if (amount.eq(0)) {
      return
    }

    const creditBalance = await this.bridge.getBaseAvailableCredit()
    if (creditBalance.lt(amount)) {
      this.logger.warn(`available credit balance is less than amount wanting to deposit. Returning. creditBalance: ${this.bridge.formatUnits(creditBalance)}, unstakeAndDepositAmount: ${this.bridge.formatUnits(amount)}`)
      return
    }

    this.logger.debug(`unstaking from bridge. amount: ${this.bridge.formatUnits(amount)}`)
    let tx = await this.bridge.unstake(amount)
    await tx.wait()

    this.logger.debug(`depositing to vault. amount: ${this.bridge.formatUnits(amount)}`)
    tx = await this.vault.deposit(amount)
    await tx.wait()
    this.logger.debug('unstake and vault deposit complete')
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

  async withdrawFromVaultAndStake (amount: BigNumber) {
    if (!this.vault) {
      return
    }

    if (amount.eq(0)) {
      return
    }

    const vaultBalance = await this.vault.getBalance()
    if (vaultBalance.lt(amount)) {
      this.logger.warn(`vault balance is less than amount wanting to withdraw. Returning. vaultBalance: ${this.bridge.formatUnits(vaultBalance)}, withdrawAndStakeAmount: ${this.bridge.formatUnits(amount)}`)
      return
    }

    this.logger.debug(`withdrawing from vault. amount: ${this.bridge.formatUnits(amount)}`)
    let tx = await this.vault.withdraw(amount)
    await tx.wait()

    let balance: BigNumber
    const isNative = isNativeToken(this.chainSlug as Chain, this.tokenSymbol)
    if (isNative) {
      const address = await this.bridge.getBonderAddress()
      balance = await this.bridge.getBalance(address)
    } else {
      const token = await (this.bridge as L1Bridge).l1CanonicalToken()
      balance = await token.getBalance()
    }

    // this is needed because the amount withdrawn from vault may not be exact
    amount = bigNumberMin(amount, balance)

    this.logger.debug(`staking on bridge. amount: ${this.bridge.formatUnits(amount)}`)
    tx = await this.bridge.stake(amount)
    await tx.wait()
    this.logger.debug('vault withdraw and stake complete')
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
