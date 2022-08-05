import AvailableLiquidityWatcher from 'src/watchers/AvailableLiquidityWatcher'
import BNMin from 'src/utils/BNMin'
import Bridge from './Bridge'
import L1Bridge from './L1Bridge'
import L2Bridge from './L2Bridge'
import Logger from 'src/logger'
import Metrics from './Metrics'
import SyncWatcher from 'src/watchers/SyncWatcher'
import isNativeToken from 'src/utils/isNativeToken'
import wait from 'src/utils/wait'
import wallets from 'src/wallets'
import { BigNumber, constants } from 'ethers'
import { Chain, GasCostTransactionType } from 'src/constants'
import { DbSet, getDbSet } from 'src/db'
import { EventEmitter } from 'events'
import { IBaseWatcher } from './IBaseWatcher'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Mutex } from 'async-mutex'
import { Notifier } from 'src/notifier'
import { Strategy, Vault } from 'src/vault'
import { config as globalConfig, hostname } from 'src/config'
import { isExecutionError } from 'src/utils/isExecutionError'

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
    const vaultConfig = globalConfig.vault as any
    if (vaultConfig[this.tokenSymbol]?.[this.chainSlug]) {
      const strategy = vaultConfig[this.tokenSymbol]?.[this.chainSlug]?.strategy as Strategy
      if (strategy) {
        this.logger.debug(`setting vault instance. strategy: ${strategy}, chain: ${this.chainSlug}, token: ${this.tokenSymbol}`)
        this.vault = Vault.from(strategy, this.chainSlug as Chain, this.tokenSymbol, signer)
      }
    }
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
      const isRevertError = isExecutionError(err.message)
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

    const sourceL2Bridge = this.getSiblingWatcherByChainSlug(sourceChain).bridge as L2Bridge
    const onChainBonderFeeAbsolute = await sourceL2Bridge.getOnChainMinBonderFeeAbsolute()

    if (nearestItemToTransferSent && nearestItemToNow) {
      ({ gasCostInToken, minBonderFeeAbsolute } = nearestItemToTransferSent)
      const { gasCostInToken: currentGasCostInToken, minBonderFeeAbsolute: currentMinBonderFeeAbsolute } = nearestItemToNow
      gasCostInToken = BNMin(gasCostInToken, currentGasCostInToken)
      minBonderFeeAbsolute = BNMin(minBonderFeeAbsolute, currentMinBonderFeeAbsolute)
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
      const isRedemptionFeeOk = relayerFee!.gte(minTxFee)
      return isRedemptionFeeOk
    }

    minBonderFeeAbsolute = onChainBonderFeeAbsolute.gt(minBonderFeeAbsolute) ? onChainBonderFeeAbsolute : minBonderFeeAbsolute
    logger.debug('minBonderFeeAbsolute:', minBonderFeeAbsolute?.toString())

    const minBpsFee = await this.bridge.getBonderFeeBps(destinationChain, amount, minBonderFeeAbsolute)
    const minBonderFeeTotal = minBpsFee.add(minTxFee)
    const isBonderFeeOk = bonderFee!.gte(minBonderFeeTotal)
    logger.debug(`bonderFee: ${bonderFee}, minBonderFeeTotal: ${minBonderFeeTotal}, minBpsFee: ${minBpsFee}, isBonderFeeOk: ${isBonderFeeOk}`)

    this.logAdditionalBonderFeeData(bonderFee!, minBonderFeeTotal, minBpsFee, gasCostInToken, destinationChain, transferId, logger)
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
      this.notifier.warn(msg)
    }
  }

}

export default BaseWatcher
