import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import S3Upload from 'src/aws/s3Upload'
import { BigNumber } from 'ethers'
import {
  getConfigBonderForRoute,
  getEnabledNetworks,
  config as globalConfig,
  modifiedLiquidityRoutes
} from 'src/config'
import {
  BondTransferRootChains,
  Chain,
  TenMinutesMs
} from 'src/constants'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { TransferRoot } from 'src/db/TransferRootsDb'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  s3Upload?: boolean
  s3Namespace?: string
}

type S3JsonData = {
  [token: string]: {
    baseAvailableCredit: {[chain: string]: string}
    baseAvailableCreditIncludingVault: {[chain: string]: string}
    vaultBalance: {[chain: string]: string}
    bonderVaultBalance: Record<string, Record<string, string>>
    availableCredit: {[chain: string]: string}
    pendingAmounts: {[chain: string]: string}
    unbondedTransferRootAmounts: {[chain: string]: string}
  }
}

// These should be global since they apply to all instances
const cache: Record<string, BigNumber> = {}

// TODO: better way of managing aggregate state
const s3JsonData: S3JsonData = {}
let s3LastUpload: number
const bonderVaultBalance: Record<string, Record<string, string>> = {}
class AvailableLiquidityWatcher extends BaseWatcher {
  private baseAvailableCredit: { [destinationChain: string]: BigNumber } = {}
  private baseAvailableCreditIncludingVault: { [destinationChain: string]: BigNumber } = {}
  private vaultBalance: { [destinationChain: string]: BigNumber } = {}
  private availableCredit: { [destinationChain: string]: BigNumber } = {}
  private pendingAmounts: { [destinationChain: string]: BigNumber } = {}
  private unbondedTransferRootAmounts: { [destinationChain: string]: BigNumber } = {}
  private lastCalculated: { [destinationChain: string]: number } = {}
  private pollCount: number = 0
  private readonly pollTimeSec: number = 15 * 60
  private readonly cacheTimeSec: number = 30
  private lastCacheTimestampSec: Record<string, number> = {}
  s3Upload: S3Upload
  s3Namespace: S3Upload

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'gray',
      bridgeContract: config.bridgeContract
    })
    if (config.s3Upload) {
      this.s3Upload = new S3Upload({
        bucket: 'assets.hop.exchange',
        key: `${config.s3Namespace ?? globalConfig.network}/v1-available-liquidity.json`
      })
    }

    this.logger.debug('modified liquidity routes', modifiedLiquidityRoutes)
    this.logger.debug('starting poller for syncing bonder credit')
  }

  async syncBonderCredit () {
    // Ensure this runs once immediately on startup so that the bonder has a valid credit.
    // Use a time-based poller here since this function is called from the SyncWatcher
    // which makes calls at different times based on the bridge and token.
    const cacheKey = this.getPollCacheKey()
    const getNewData = this.shouldGetNewCacheData(cacheKey, this.pollTimeSec)
    if (!getNewData) {
      return
    }
    this.updateCache(cacheKey, this.pollCount)

    this.pollCount++
    this.logger.debug('syncing bonder credit index:', this.pollCount)
    await this.syncUnbondedTransferRootAmounts()
      .then(async () => await this.syncPendingAmounts())
      .then(async () => await this.syncAvailableCredit())
  }

  // L2 -> L1: (credit - debit - OruToL1PendingAmount - OruToAllUnbondedTransferRoots)
  // L2 -> L2: (credit - debit)
  private async calculateAvailableCredit (destinationChainId: number, bonder?: string) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const destinationWatcher = this.getSiblingWatcherByChainSlug(destinationChain)
    if (!destinationWatcher) {
      throw new Error(`no destination watcher for chain ${destinationChain}`)
    }

    let baseAvailableCredit = await this.getOnchainBaseAvailableCredit(destinationWatcher, bonder)
    this.logger.debug(`calculateAvailableCredit: baseAvailableCredit; bonder: ${bonder}, chain: ${destinationChain}, balance: ${baseAvailableCredit.toString()}`)
    const vaultBalance = await destinationWatcher.getOnchainVaultBalance(bonder)
    this.logger.debug(`calculateAvailableCredit: on-chain vault balance; bonder: ${bonder}, chain: ${destinationChain}, balance: ${vaultBalance.toString()}`)
    let baseAvailableCreditIncludingVault = baseAvailableCredit.add(vaultBalance)
    let availableCredit = baseAvailableCreditIncludingVault
    const isToL1 = destinationChain === Chain.Ethereum
    if (isToL1) {
      const pendingAmount = await this.getOruToL1PendingAmount()
      availableCredit = availableCredit.sub(pendingAmount)
      this.logger.debug(`calculateAvailableCredit: availableCredit; bonder: ${bonder}, chain: ${destinationChain}, l1Values pendingAmount: ${pendingAmount.toString()}, availableCredit: ${availableCredit.toString()}, pendingAmount: ${pendingAmount.toString()}`)

      const unbondedTransferRootAmounts = await this.getOruToAllUnbondedTransferRootAmounts()
      availableCredit = availableCredit.sub(unbondedTransferRootAmounts)
      this.logger.debug(`calculateAvailableCredit: availableCredit; bonder: ${bonder}, chain: ${destinationChain}, l1Values pendingAmount: ${pendingAmount.toString()}, availableCredit: ${availableCredit.toString()}, unbondedTransferRootAmounts: ${unbondedTransferRootAmounts.toString()}`)
    }

    if (modifiedLiquidityRoutes?.length > 0) {
      const shouldDisableRoute = this.shouldDisableRoute(modifiedLiquidityRoutes, destinationChain)
      this.logger.debug(`calculateAvailableCredit: modifiedLiquidityRoutes: ${this.chainSlug}->${destinationChain} ${this.tokenSymbol}, shouldDisableRoute: ${shouldDisableRoute}`)
      if (shouldDisableRoute) {
        availableCredit = BigNumber.from('0')
        baseAvailableCredit = BigNumber.from('0')
        baseAvailableCreditIncludingVault = BigNumber.from('0')
      }
    }

    if (availableCredit.lt(0)) {
      availableCredit = BigNumber.from(0)
    }

    if (baseAvailableCredit.lt(0)) {
      baseAvailableCredit = BigNumber.from(0)
    }

    if (baseAvailableCreditIncludingVault.lt(0)) {
      baseAvailableCreditIncludingVault = BigNumber.from(0)
    }

    return { availableCredit, baseAvailableCredit, baseAvailableCreditIncludingVault, vaultBalance }
  }

  async calculatePendingAmount (destinationChainId: number) {
    const cacheKey = this.getPendingAmountCacheKey(destinationChainId)
    const getNewData = this.shouldGetNewCacheData(cacheKey, this.cacheTimeSec)
    if (!getNewData) {
      return cache[cacheKey]
    }

    const bridge = this.bridge as L2Bridge
    const pendingAmount = await bridge.getPendingAmountForChainId(destinationChainId)

    this.updateCache(cacheKey, pendingAmount)
    return pendingAmount
  }

  public async calculateUnbondedTransferRootAmounts (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const transferRoots = await this.db.transferRoots.getUnbondedTransferRoots({
      sourceChainId: this.chainSlugToId(this.chainSlug),
      destinationChainId
    })

    this.logger.debug(`getUnbondedTransferRoots ${this.chainSlug}→${destinationChain}:`, JSON.stringify(transferRoots.map(({ transferRootHash, totalAmount }: TransferRoot) => ({ transferRootHash, totalAmount }))))
    let totalAmount = BigNumber.from(0)
    for (const transferRoot of transferRoots) {
      const { transferRootId } = transferRoot
      const l1Bridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum).bridge as L1Bridge
      const isBonded = await l1Bridge.isTransferRootIdBonded(transferRootId)
      if (isBonded) {
        const logger = this.logger.create({ root: transferRootId })
        logger.warn('calculateUnbondedTransferRootAmounts already bonded')
        continue
      }

      totalAmount = totalAmount.add(transferRoot.totalAmount)
    }

    return totalAmount
  }

  private async updateAvailableCreditMap (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const bonder = await this.getBonderAddress(destinationChain)
    const { availableCredit, baseAvailableCredit, baseAvailableCreditIncludingVault, vaultBalance } = await this.calculateAvailableCredit(destinationChainId, bonder)
    this.availableCredit[destinationChain] = availableCredit
    this.baseAvailableCredit[destinationChain] = baseAvailableCredit
    this.baseAvailableCreditIncludingVault[destinationChain] = baseAvailableCreditIncludingVault
    this.vaultBalance[destinationChain] = vaultBalance
    if (!bonderVaultBalance[bonder]) {
      bonderVaultBalance[bonder] = {}
    }
    bonderVaultBalance[bonder][destinationChain] = vaultBalance.toString()
  }

  async getBonderAddress (destinationChain: string): Promise<string> {
    const routeBonder = getConfigBonderForRoute(this.tokenSymbol, this.chainSlug, destinationChain)
    return (routeBonder ?? await this.bridge.getBonderAddress())?.toLowerCase()
  }

  private async updatePendingAmountsMap (destinationChainId: number) {
    const pendingAmount = await this.calculatePendingAmount(destinationChainId)
    const destinationChain = this.chainIdToSlug(destinationChainId)
    this.pendingAmounts[destinationChain] = pendingAmount
  }

  private async updateUnbondedTransferRootAmountsMap (destinationChainId: number) {
    const totalAmounts = await this.calculateUnbondedTransferRootAmounts(destinationChainId)
    const destinationChain = this.chainIdToSlug(destinationChainId)
    this.unbondedTransferRootAmounts[destinationChain] = totalAmounts
    this.lastCalculated[destinationChain] = Date.now()
  }

  async syncPendingAmounts () {
    // Individual bonders are not concerned about pending amounts
    if (!this.s3Upload) {
      return
    }

    this.logger.debug('syncing pending amounts: start')
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const sourceChain = this.chainSlug
      const destinationChain = this.chainIdToSlug(destinationChainId)
      if (
        this.chainSlug === Chain.Ethereum ||
        this.chainSlug === destinationChain
      ) {
        this.logger.debug('syncing pending amounts: skipping')
        continue
      }
      await this.updatePendingAmountsMap(destinationChainId)
      const pendingAmounts = this.getPendingAmounts(destinationChainId)
      this.logger.debug(`pendingAmounts (${this.tokenSymbol} ${sourceChain}→${destinationChain}): ${this.bridge.formatUnits(pendingAmounts)}`)
    }
  }

  async syncUnbondedTransferRootAmounts () {
    this.logger.debug('syncing unbonded transferRoot amounts: start')
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const sourceChain = this.chainSlug
      const destinationChain = this.chainIdToSlug(destinationChainId)
      const doesChainSupportRootBond = BondTransferRootChains.includes(sourceChain)
      const shouldSkip = (
        !doesChainSupportRootBond ||
        sourceChain === Chain.Ethereum ||
        sourceChain === destinationChain ||
        !this.hasSiblingWatcher(destinationChainId)
      )
      if (shouldSkip) {
        this.unbondedTransferRootAmounts[destinationChain] = BigNumber.from(0)
        this.logger.debug(`syncing unbonded transferRoot amounts: skipping ${destinationChainId}`)
        continue
      }
      await this.updateUnbondedTransferRootAmountsMap(destinationChainId)
      const unbondedTransferRootAmounts = this.getUnbondedTransferRootAmounts(destinationChainId)
      this.logger.debug(`unbondedTransferRootAmounts (${this.tokenSymbol} ${sourceChain}→${destinationChain}): ${this.bridge.formatUnits(unbondedTransferRootAmounts)}`)
    }
  }

  private async syncAvailableCredit () {
    this.logger.debug('syncing available credit: start')
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const sourceChain = this.chainSlug
      const destinationChain = this.chainIdToSlug(destinationChainId)
      const shouldSkip = (
        sourceChain === Chain.Ethereum ||
        sourceChain === destinationChain ||
        !this.hasSiblingWatcher(destinationChainId)
      )
      if (shouldSkip) {
        this.logger.debug(`syncing available credit: skipping ${destinationChainId}`)
        continue
      }
      await this.updateAvailableCreditMap(destinationChainId)
      const availableCredit = this.getEffectiveAvailableCredit(destinationChainId)
      this.logger.debug(`availableCredit (${this.tokenSymbol} ${sourceChain}→${destinationChain}): ${this.bridge.formatUnits(availableCredit)}`)
    }
  }

  async getOruToL1PendingAmount () {
    let pendingAmounts = BigNumber.from(0)
    const enabledNetworks = getEnabledNetworks()
    for (const chain of BondTransferRootChains) {
      if (!enabledNetworks.includes(chain)) {
        continue
      }
      const watcher = this.getSiblingWatcherByChainSlug(chain)
      if (!watcher) {
        continue
      }

      const destinationChainId = this.chainSlugToId(Chain.Ethereum)
      const pendingAmount = await watcher.calculatePendingAmount(destinationChainId)
      pendingAmounts = pendingAmounts.add(pendingAmount)
    }

    return pendingAmounts
  }

  async getOruToAllUnbondedTransferRootAmounts () {
    let totalAmount = BigNumber.from(0)
    for (const destinationChain in this.unbondedTransferRootAmounts) {
      if (this.lastCalculated[destinationChain]) {
        const isStale = Date.now() - this.lastCalculated[destinationChain] > TenMinutesMs
        if (isStale) {
          continue
        }
      }
      const amount = this.unbondedTransferRootAmounts[destinationChain]
      totalAmount = totalAmount.add(amount)
    }
    return totalAmount
  }

  async getOnchainBaseAvailableCredit (destinationWatcher: any, bonder?: string): Promise<BigNumber> {
    const cacheKey = this.getAvailableLiquidityCacheKey(destinationWatcher.chainSlug, bonder)
    const getNewData = this.shouldGetNewCacheData(cacheKey, this.cacheTimeSec)
    if (!getNewData) {
      this.logger.debug(`getOnchainBaseAvailableCredit, using cache. key: ${cacheKey}, value: ${cache[cacheKey]}`)
      return cache[cacheKey]
    }

    const destinationBridge = destinationWatcher.bridge
    const onchainBaseAvailableCredit = await destinationBridge.getBaseAvailableCredit(bonder)

    this.updateCache(cacheKey, onchainBaseAvailableCredit)
    return onchainBaseAvailableCredit
  }

  public getBaseAvailableCredit (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const baseAvailableCredit = this.baseAvailableCredit[destinationChain]
    if (!baseAvailableCredit) {
      return BigNumber.from(0)
    }

    return baseAvailableCredit
  }

  public getBaseAvailableCreditIncludingVault (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const baseAvailableCreditIncludingVault = this.baseAvailableCreditIncludingVault[destinationChain]
    if (!baseAvailableCreditIncludingVault) {
      return BigNumber.from(0)
    }

    return baseAvailableCreditIncludingVault
  }

  public getEffectiveAvailableCredit (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const availableCredit = this.availableCredit[destinationChain]
    if (!availableCredit) {
      return BigNumber.from(0)
    }

    return availableCredit
  }

  public getPendingAmounts (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const pendingAmounts = this.pendingAmounts[destinationChain]
    if (!pendingAmounts) {
      return BigNumber.from(0)
    }

    return pendingAmounts
  }

  public getUnbondedTransferRootAmounts (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const unbondedAmounts = this.unbondedTransferRootAmounts[destinationChain]
    if (!unbondedAmounts) {
      return BigNumber.from(0)
    }

    return unbondedAmounts
  }

  public getVaultBalance (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const vaultBalance = this.vaultBalance[destinationChain]
    if (!vaultBalance) {
      return BigNumber.from(0)
    }

    return vaultBalance
  }

  async getOnchainVaultBalance (bonder?: string) {
    this.logger.debug(`getOnchainVaultBalance, bonder: ${bonder}, vault: ${!!this.vault}`)
    if (!this.vault) {
      return BigNumber.from(0)
    }

    const vaultBalance = await this.vault.getBalance(bonder)
    return vaultBalance
  }

  async uploadToS3 () {
    if (!this.s3Upload) {
      return
    }

    const data: any = {
      baseAvailableCredit: {},
      baseAvailableCreditIncludingVault: {},
      vaultBalance: {},
      bonderVaultBalance: {},
      availableCredit: {},
      pendingAmounts: {},
      unbondedTransferRootAmounts: {}
    }
    for (const chainId in this.siblingWatchers) {
      const sourceChain = this.chainIdToSlug(Number(chainId))
      const watcher = this.siblingWatchers[chainId]
      const shouldSkip = (
        sourceChain === Chain.Ethereum
      )
      if (shouldSkip) {
        continue
      }
      data.baseAvailableCredit[sourceChain] = watcher.baseAvailableCredit
      data.baseAvailableCreditIncludingVault[sourceChain] = watcher.baseAvailableCreditIncludingVault
      data.vaultBalance[sourceChain] = watcher.vaultBalance
      data.availableCredit[sourceChain] = watcher.availableCredit
      data.pendingAmounts[sourceChain] = watcher.pendingAmounts
      data.unbondedTransferRootAmounts[sourceChain] = watcher.unbondedTransferRootAmounts
      data.bonderVaultBalance = bonderVaultBalance
    }

    s3JsonData[this.tokenSymbol] = data
    if (!s3LastUpload || s3LastUpload < Date.now() - (60 * 1000)) {
      s3LastUpload = Date.now()
      await this.s3Upload.upload(s3JsonData)
      this.logger.debug(`s3 uploaded data: ${JSON.stringify(s3JsonData)}`)
    }
  }

  private shouldDisableRoute (modifiedLiquidityRoutes: string[], destinationChain: string): boolean {
    for (const modifiedLiquidityRoute of modifiedLiquidityRoutes) {
      const [source, destination, tokenSymbol] = modifiedLiquidityRoute.split(':')
      if (!source || !destination || !tokenSymbol) {
        continue
      }

      const isSource = source === 'all' || source === this.chainSlug
      const isDestination = destination === 'all' || destination === destinationChain
      const isTokenSymbol = tokenSymbol === 'all' || tokenSymbol === this.tokenSymbol
      if (isSource && isDestination && isTokenSymbol) {
        return true
      }
    }
    return false
  }

  private shouldGetNewCacheData (cacheKey: string, cacheTime: number): boolean {
    const isFirstCache = !cache[cacheKey]
    const nowSec = Math.floor(Date.now() / 1000)
    const isCacheExpired = nowSec - this.lastCacheTimestampSec[cacheKey] > cacheTime

    if (isFirstCache || isCacheExpired) {
      return true
    }
    return false
  }

  private updateCache (cacheKey: string, value: BigNumber | number): void {
    if (typeof value === 'number') {
      value = BigNumber.from(value)
    }
    cache[cacheKey] = value
    this.lastCacheTimestampSec[cacheKey] = Math.floor(Date.now() / 1000)
  }

  private getPollCacheKey (): string {
    const cacheName = 'poll'
    return this._getCacheKey(cacheName)
  }

  private getPendingAmountCacheKey (destinationChainId: number): string {
    const destinationChainSlug = this.chainIdToSlug(destinationChainId)
    const cacheName = 'pendingAmount'
    return this._getCacheKey(cacheName, destinationChainSlug)
  }

  private getAvailableLiquidityCacheKey (destinationChainSlug: string, bonder?: string): string {
    const cacheName = 'availableLiquidity'
    return this._getCacheKey(cacheName, destinationChainSlug, bonder)
  }

  private _getCacheKey (cacheName: string, destinationChainSlug?: string, bonder?: string): string {
    let cacheKey = `${this.chainSlug}:${this.tokenSymbol}:${cacheName}`
    if (destinationChainSlug) {
      cacheKey += `:${destinationChainSlug}`
    }
    if (bonder) {
      cacheKey += `:${bonder}`
    }
    return cacheKey
  }
}

export default AvailableLiquidityWatcher
