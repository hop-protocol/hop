import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import S3Upload from 'src/aws/s3Upload'
import { BigNumber } from 'ethers'
import { Chain, TenMinutesMs } from 'src/constants'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { getConfigBonderForRoute, config as globalConfig, oruChains } from 'src/config'

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
  s3Upload: S3Upload
  s3Namespace: S3Upload
  bonderCreditPollerIncrementer: number = 0

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
  }

  async syncBonderCredit () {
    this.bonderCreditPollerIncrementer++
    const bonderCreditSyncInterval = 10
    // Don't check the 0 remainder so that the bonder has a valid credit immediately on startup
    const shouldSync = this.bonderCreditPollerIncrementer % bonderCreditSyncInterval === 1

    // When not uploading to S3, only sync on certain poll intervals
    if (!this.s3Upload && !shouldSync) {
      return
    }

    this.logger.debug('syncing bonder credit')
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
      throw new Error(`no destination watcher for ${destinationChain}`)
    }
    const destinationBridge = destinationWatcher.bridge
    const baseAvailableCredit = await destinationBridge.getBaseAvailableCredit(bonder)
    const vaultBalance = await destinationWatcher.getOnchainVaultBalance(bonder)
    this.logger.debug(`vault balance ${destinationChain} ${vaultBalance.toString()}`)
    const baseAvailableCreditIncludingVault = baseAvailableCredit.add(vaultBalance)
    let availableCredit = baseAvailableCreditIncludingVault
    const isToL1 = destinationChain === Chain.Ethereum
    if (isToL1) {
      const pendingAmount = await this.getOruToL1PendingAmount()
      availableCredit = availableCredit.sub(pendingAmount)

      const unbondedTransferRootAmounts = await this.getOruToAllUnbondedTransferRootAmounts()
      availableCredit = availableCredit.sub(unbondedTransferRootAmounts)
    }

    if (availableCredit.lt(0)) {
      availableCredit = BigNumber.from(0)
    }

    return { availableCredit, baseAvailableCredit, baseAvailableCreditIncludingVault, vaultBalance }
  }

  async calculatePendingAmount (destinationChainId: number) {
    const bridge = this.bridge as L2Bridge
    const pendingAmount = await bridge.getPendingAmountForChainId(destinationChainId)
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
        logger.warn('calculateUnbondedTransferRootAmounts already bonded. isNotFound: true')
        await this.db.transferRoots.update(transferRootId, { isNotFound: true })
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
    return routeBonder || await this.bridge.getBonderAddress()
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
      const isSourceChainOru = oruChains.has(sourceChain)
      const shouldSkip = (
        !isSourceChainOru ||
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
    for (const chain of oruChains) {
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
}

export default AvailableLiquidityWatcher
