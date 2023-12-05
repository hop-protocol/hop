import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import MerkleTree from 'src/utils/MerkleTree'
import { ChainSlug } from '@hop-protocol/core/config'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { config as globalConfig } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
  minThresholdPercent: number
}

class SettleBondedWithdrawalWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: SettleBondedWithdrawalWatcher }

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'magenta',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
  }

  async pollHandler () {
    await this.checkUnsettledTransferRootsFromDb()
  }

  async checkUnsettledTransferRootsFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getUnsettledTransferRoots(await this.getFilterRoute())
    if (!dbTransferRoots.length) {
      this.logger.debug('no unsettled db transfer roots to check')
    }
    this.logger.info(`total unsettled transfer roots db items: ${dbTransferRoots.length}`)
    const promises: Array<Promise<any>> = []
    for (const dbTransferRoot of dbTransferRoots) {
      promises.push(this.checkTransferRootId(dbTransferRoot.transferRootId))
    }
    await Promise.all(promises)
  }

  async checkTransferRootId (transferRootId: string, bonder?: string) {
    const logger = this.logger.create({ root: transferRootId })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(
      transferRootId
    )
    if (!dbTransferRoot) {
      this.logger.error('db transfer root not found')
      return
    }
    const {
      transferRootHash,
      sourceChainId,
      destinationChainId,
      totalAmount,
      transferIds
    } = dbTransferRoot
    if (!Array.isArray(transferIds)) {
      throw new Error('transferIds expected to be array')
    }

    const destBridge = this.getSiblingWatcherByChainId(destinationChainId!)
      .bridge
    bonder = bonder ?? await destBridge.getBonderAddress()
    logger.debug(`transferRootId: ${transferRootId}`)

    const tree = new MerkleTree(transferIds)
    const calculatedTransferRootHash = tree.getHexRoot()
    if (calculatedTransferRootHash !== transferRootHash) {
      logger.debug('transferIds:', JSON.stringify(transferIds))
      logger.error(
        `transfers computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${calculatedTransferRootHash}`
      )
      await this.db.transferRoots.update(transferRootId, {
        transferIds: []
      })
      return
    }

    logger.debug('sourceChainId:', sourceChainId)
    logger.debug('destinationChainId:', destinationChainId)
    logger.debug('computed transferRootHash:', transferRootHash)
    logger.debug('bonder:', bonder)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount!))
    logger.debug('transferIds', JSON.stringify(transferIds))

    const {
      total: onChainTotalAmount,
      amountWithdrawn: onChainAmountWithdrawn
    } = await destBridge.getTransferRoot(transferRootHash, totalAmount!)
    if (onChainTotalAmount.eq(0)) {
      logger.debug('onChainTotalAmount is 0. Skipping')
      return
    }
    if (onChainTotalAmount.eq(onChainAmountWithdrawn)) {
      logger.debug(`transfer root amountWithdrawn (${this.bridge.formatUnits(onChainAmountWithdrawn)}) matches total. Marking as not found`)
      await this.db.transferRoots.update(transferRootId, {
        isNotFound: true
      })
      return
    }

    if (this.dryMode || globalConfig.emergencyDryMode) {
      logger.warn(`dry: ${this.dryMode}, emergencyDryMode: ${globalConfig.emergencyDryMode}, skipping settleBondedWithdrawals`)
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      withdrawalBondSettleTxSentAt: Date.now()
    })
    logger.debug('sending settle tx')
    try {
      const tx = await destBridge.settleBondedWithdrawals(
        bonder,
        transferIds,
        totalAmount
      )
      const msg = `settleBondedWithdrawals on destinationChainId: ${destinationChainId} (sourceChainId: ${sourceChainId}) tx: ${tx.hash}, transferRootId: ${transferRootId}, transferRootHash: ${transferRootHash}, totalAmount: ${this.bridge.formatUnits(totalAmount!)}, transferIds: ${transferIds.length}`
      logger.info(msg)
      this.notifier.info(msg)

      tx.wait()
        .then(() => {
          this.depositToVaultIfNeeded(destinationChainId!)
        })
    } catch (err) {
      logger.error('settleBondedWithdrawals error:', err.message)
      throw err
    }
  }

  async checkTransferRootHash (transferRootHash: string, bonder: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot?.transferRootId) {
      throw new Error('db transfer root not found')
    }
    return this.checkTransferRootId(dbTransferRoot.transferRootId, bonder)
  }

  async depositToVaultIfNeeded (destinationChainId: number) {
    const vaultConfig = globalConfig.vault?.[this.tokenSymbol]?.[this.chainSlug as ChainSlug]
    if (!vaultConfig) {
      return
    }

    if (!vaultConfig?.autoDeposit) {
      return
    }

    const depositThresholdAmount = this.bridge.parseUnits(vaultConfig.depositThresholdAmount)
    const depositAmount = this.bridge.parseUnits(vaultConfig.depositAmount)
    if (depositAmount.eq(0) || depositThresholdAmount.eq(0)) {
      return
    }

    return await this.mutex.runExclusive(async () => {
      const availableCredit = this.availableLiquidityWatcher.getEffectiveAvailableCredit(destinationChainId)
      const vaultBalance = this.availableLiquidityWatcher.getVaultBalance(destinationChainId)
      const availableCreditMinusVault = availableCredit.sub(vaultBalance)
      const shouldDeposit = (availableCreditMinusVault.sub(depositAmount)).gt(depositThresholdAmount)
      if (shouldDeposit) {
        try {
          const msg = `attempting unstakeAndDepositToVault. amount: ${this.bridge.formatUnits(depositAmount)}`
          this.notifier.info(msg)
          this.logger.info(msg)
          const destinationWatcher = this.getSiblingWatcherByChainId(destinationChainId)
          await destinationWatcher.unstakeAndDepositToVault(depositAmount)
        } catch (err) {
          const errMsg = `unstakeAndDepositToVault error: ${err.message}`
          this.notifier.error(errMsg)
          this.logger.error(errMsg)
          throw err
        }
      }
    })
  }
}

export default SettleBondedWithdrawalWatcher
