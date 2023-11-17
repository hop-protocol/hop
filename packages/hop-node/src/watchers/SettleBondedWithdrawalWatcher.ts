import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import MerkleTree from 'src/utils/MerkleTree'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { Transfer } from 'src/db/TransfersDb'
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
  settleAttemptedAt: { [rootHash: string]: number } = {}

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

    const promises: Array<Promise<any>> = []
    for (const dbTransferRoot of dbTransferRoots) {
      const { transferRootId, transferIds } = dbTransferRoot
      const logger = this.logger.create({ id: transferRootId })

      // Mark a settlement as attempted here so that multiple db reads are not attempted every poll
      // This comes into play when a transfer is bonded after others in the same root have been settled
      const settleAttemptedAt = Date.now()
      await this.db.transferRoots.update(transferRootId, {
        settleAttemptedAt
      })

      // get all db transfer items that belong to root
      const dbTransfers: Transfer[] = []
      for (const transferId of transferIds) {
        const dbTransfer = await this.db.transfers.getByTransferId(transferId)
        if (!dbTransfer) {
          continue
        }
        dbTransfers.push(dbTransfer)
      }

      if (dbTransfers.length !== transferIds.length) {
        this.logger.error(`could not find all db transfers for root id ${transferRootId}. Has ${transferIds.length}, found ${dbTransfers.length}. Db may not be fully synced`)
        continue
      }

      // skip attempt to settle transfer root if none of the transfers are bonded because there is nothing to settle
      const hasBondedWithdrawals = dbTransfers.some(
        (dbTransfer: Transfer) => dbTransfer.withdrawalBonded
      )
      if (!hasBondedWithdrawals) {
        this.logger.debug(`no bonded withdrawals found for root id ${transferRootId}. Has ${transferIds.length}, found ${dbTransfers.length}. Db may not be fully synced`)
        continue
      }

      const allBondableTransfersSettled = this.syncWatcher.getIsDbTransfersAllSettled(dbTransfers)
      if (allBondableTransfersSettled) {
        this.logger.debug(`all bondable transfers for root id ${transferRootId} are settled. Marking transfer root as settled`)
        await this.db.transferRoots.update(transferRootId, {
          allSettled: true
        })
        continue
      }

      // find all unique bonders that have bonded transfers in this transfer root
      const bonderSet = new Set<string>()
      for (const dbTransfer of dbTransfers) {
        const hasWithdrawalBonder = dbTransfer?.withdrawalBonder
        const isAlreadySettled = dbTransfer?.withdrawalBondSettled
        const shouldSkip = !hasWithdrawalBonder || isAlreadySettled
        if (shouldSkip) {
          this.logger.debug(`skipping db transfer ${dbTransfer?.transferId} for root id ${transferRootId}. withdrawalBonder: ${hasWithdrawalBonder}, withdrawalBondSettled: ${isAlreadySettled}`)
          continue
        }

        logger.debug(`unsettled transferId: ${dbTransfer?.transferId}, transferRootHash: ${dbTransferRoot?.transferRootHash}, transferAmount: ${this.bridge.formatUnits(dbTransfer.amount!)}`)
        bonderSet.add(dbTransfer.withdrawalBonder!)
      }

      for (const bonder of bonderSet.values()) {
        // check settle-able transfer root
        promises.push(
          this.checkTransferRootId(transferRootId, bonder)
            .catch((err: Error) => {
              this.logger.error('checkTransferRootId error:', err.message)
            })
        )
      }
    }

    if (promises.length === 0) {
      this.logger.debug('no unsettled db transfer roots to check')
      return
    }

    this.logger.info(
      `checking ${promises.length} unsettled db transfer roots`
    )

    await Promise.all(promises)
  }

  async checkTransferRootId (transferRootId: string, bonder: string) {
    if (!bonder) {
      throw new Error('bonder is required')
    }
    const logger = this.logger.create({ root: transferRootId })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(
      transferRootId
    )
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

    // TMP: Remove
    if (
      destinationChainId === 59144 &&
      transferIds.length > 750
    ) {
      return
    }

    const destBridge = this.getSiblingWatcherByChainId(destinationChainId!)
      .bridge

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
      logger.debug(`transfer root amountWithdrawn (${this.bridge.formatUnits(onChainAmountWithdrawn)}) matches total. Marking transfer root as all settled`)
      await this.db.transferRoots.update(transferRootId, {
        allSettled: true
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
    return this.checkTransferRootId(dbTransferRoot.transferRootId, bonder!)
  }

  async depositToVaultIfNeeded (destinationChainId: number) {
    const vaultConfig = (globalConfig.vault as any)?.[this.tokenSymbol]?.[this.chainSlug]
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
