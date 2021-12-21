import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import MerkleTree from 'src/utils/MerkleTree'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L1ERC20Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/L1ERC20Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { OneHourMs } from 'src/constants'
import { Transfer } from 'src/db/TransfersDb'

type Config = {
  chainSlug: string
  tokenSymbol: string
  isL1: boolean
  bridgeContract: L1BridgeContract | L1ERC20BridgeContract | L2BridgeContract
  label: string
  order?: () => number
  dryMode?: boolean
  minThresholdPercent: number
  stateUpdateAddress?: string
}

class SettleBondedWithdrawalWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: SettleBondedWithdrawalWatcher }
  settleAttemptedAt: { [rootHash: string]: number } = {}

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'SettleBondedWithdrawalWatcher',
      prefix: config.label,
      logColor: 'magenta',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode,
      stateUpdateAddress: config.stateUpdateAddress
    })
  }

  async pollHandler () {
    await this.checkUnsettledTransferRootsFromDb()
  }

  checkUnsettledTransferRootsFromDb = async () => {
    const dbTransferRoots = await this.db.transferRoots.getUnsettledTransferRoots(await this.getFilterRoute())

    const promises: Array<Promise<any>> = []
    for (const dbTransferRoot of dbTransferRoots) {
      const { transferRootId, transferIds } = dbTransferRoot
      // Mark a settlement as attempted here so that multiple db reads are not attempted every poll
      // This comes into play when a transfer is bonded after others in the same root have been settled
      if (!this.settleAttemptedAt[transferRootId!]) {
        this.settleAttemptedAt[transferRootId!] = 0
      }
      const timestampOk = this.settleAttemptedAt[transferRootId!] + OneHourMs < Date.now()
      if (!timestampOk) {
        continue
      }
      this.settleAttemptedAt[transferRootId!] = Date.now()

      // get all db transfer items that belong to root
      const dbTransfers: Transfer[] = []
      for (const transferId of transferIds!) {
        const dbTransfer = await this.db.transfers.getByTransferId(transferId)
        if (!dbTransfer) {
          continue
        }
        dbTransfers.push(dbTransfer)
      }

      if (dbTransfers.length !== transferIds!.length) {
        this.logger.error(`could not find all db transfers for root id ${transferRootId}. Has ${transferIds!.length}, found ${dbTransfers.length}. Db may not be fully synced`)
        continue
      }

      // skip attempt to settle transfer root if none of the transfers are bonded because there is nothing to settle
      const hasBondedWithdrawals = dbTransfers.some(
        (dbTransfer: Transfer) => dbTransfer.withdrawalBonded
      )
      if (!hasBondedWithdrawals) {
        continue
      }

      const allBondableTransfersSettled = this.syncWatcher.getIsDbTransfersAllSettled(dbTransfers)
      if (allBondableTransfersSettled) {
        await this.db.transferRoots.update(transferRootId!, {
          allSettled: true
        })
        continue
      }

      // find all unique bonders that have bonded transfers in this transfer root
      const bonderSet = new Set<string>()
      for (const dbTransfer of dbTransfers) {
        const doesBonderExist = dbTransfer?.withdrawalBonder
        const shouldTransferBeSettled = dbTransfer?.withdrawalBondSettled === false
        if (!doesBonderExist || !shouldTransferBeSettled) {
          continue
        }
        bonderSet.add(dbTransfer.withdrawalBonder!)
      }

      for (const bonder of bonderSet.values()) {
        // check settle-able transfer root
        promises.push(
          this.checkTransferRootId(transferRootId!, bonder)
            .catch((err: Error) => {
              this.logger.error('checkTransferRootId error:', err.message)
            })
        )
      }
    }

    if (promises.length === 0) {
      return
    }

    this.logger.info(
      `checking ${promises.length} unsettled db transfer roots`
    )

    await Promise.all(promises)
  }

  checkTransferRootId = async (transferRootId: string, bonder: string) => {
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
    } = await this.bridge.getTransferRoot(transferRootHash, totalAmount!)
    if (onChainTotalAmount.eq(onChainAmountWithdrawn)) {
      logger.debug(`transfer root amountWithdrawn (${this.bridge.formatUnits(onChainAmountWithdrawn)}) matches total. Marking transfer root as all settled`)
      await this.db.transferRoots.update(transferRootId, {
        allSettled: true
      })
      return
    }

    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping settleBondedWithdrawals`)
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
      const msg = `settleBondedWithdrawals on destinationChainId:${destinationChainId} tx: ${tx.hash}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }

  checkTransferId = async (transferId: string) => {
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      throw new Error(`transfer id "${transferId}" not found in db`)
    }
    const { transferRootId, withdrawalBonder } = dbTransfer
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(
      transferRootId!
    )
    if (!dbTransferRoot) {
      throw new Error(`transfer root id "${transferRootId}" not found in db`)
    }

    return await this.checkTransferRootId(transferRootId!, withdrawalBonder!)
  }
}

export default SettleBondedWithdrawalWatcher
