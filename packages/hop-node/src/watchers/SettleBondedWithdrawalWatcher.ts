import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import MerkleTree from 'src/utils/MerkleTree'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L1ERC20Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/L1ERC20Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Transfer } from 'src/db/TransfersDb'
import { enabledSettleWatcherDestinationChains, enabledSettleWatcherSourceChains } from 'src/config'

export interface Config {
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

const BONDER_ORDER_DELAY_MS = 60 * 1000

class SettleBondedWithdrawalWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: SettleBondedWithdrawalWatcher }

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
    if (enabledSettleWatcherSourceChains?.length) {
      if (!enabledSettleWatcherSourceChains.includes(this.chainSlug)) {
        return
      }
    }

    // only process transfer where this bridge is the source chain
    const dbTransferRoots = await this.db.transferRoots.getUnsettledTransferRoots(
      {
        sourceChainId: await this.bridge.getChainId()
      }
    )

    const promises: Array<Promise<any>> = []
    for (const dbTransferRoot of dbTransferRoots) {
      const { transferRootHash, transferIds, destinationChainId } = dbTransferRoot

      if (enabledSettleWatcherDestinationChains?.length) {
        if (!enabledSettleWatcherDestinationChains.includes(this.chainIdToSlug(destinationChainId))) {
          continue
        }
      }

      // get all db transfer items that belong to root
      const dbTransfers: Transfer[] = []
      for (const transferId of transferIds) {
        const dbTransfer = await this.db.transfers.getByTransferId(transferId)
        dbTransfers.push(dbTransfer)
      }

      // skip attempt to settle transfer root if none of the transfers are bonded because there is nothing to settle
      const hasBondedWithdrawals = dbTransfers.some(
        (dbTransfer: Transfer) => dbTransfer?.withdrawalBonded
      )
      if (!hasBondedWithdrawals) {
        continue
      }

      // if all transfer ids have been marked as settled,
      // then mark transfer root as all settled since there is nothing to settle anymore
      const allBondableTransfersSettled = dbTransfers.every(
        (dbTransfer: Transfer) => {
          // A transfer should not be settled if it is unbondable
          return !dbTransfer.isBondable || dbTransfer?.withdrawalBondSettled
        }
      )
      if (allBondableTransfersSettled) {
        await this.db.transferRoots.update(transferRootHash, {
          allSettled: allBondableTransfersSettled
        })
        continue
      }

      // find all unique bonders that have bonded transfers in this transfer root
      const bonderSet = new Set<string>()
      for (const dbTransfer of dbTransfers) {
        if (!dbTransfer?.withdrawalBonder) {
          continue
        }
        bonderSet.add(dbTransfer.withdrawalBonder)
      }

      for (const bonder of bonderSet.values()) {
        // if all transfers have been settled that belong to a bonder
        // then don't attempt to settle root with that bonder
        // because there is nothing to settle anymore
        const allSettledByBonder = dbTransfers.filter(
          (dbTransfer: Transfer) => dbTransfer.withdrawalBonder === bonder
        )
          .every((dbTransfer: Transfer) =>
            dbTransfer?.withdrawalBondSettled
          )
        if (allSettledByBonder) {
          continue
        }

        // check settle-able transfer root
        promises.push(
          this.checkTransferRootHash(transferRootHash, bonder)
            .catch((err: Error) => {
              this.logger.error('checkTransferRootHash error:', err.message)
            })
        )
      }
    }

    if (promises.length === 0) {
      return
    }

    this.logger.debug(
      `checking ${promises.length} unsettled db transfer roots`
    )

    await Promise.all(promises)
  }

  checkTransferRootHash = async (transferRootHash: string, bonder: string) => {
    if (!transferRootHash) {
      throw new Error('transfer root hash is required')
    }
    if (!bonder) {
      throw new Error('bonder is required')
    }
    const logger = this.logger.create({ root: transferRootHash })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    const {
      transferRootId,
      sourceChainId,
      destinationChainId,
      totalAmount,
      transferIds
    } = dbTransferRoot
    if (!Array.isArray(transferIds)) {
      throw new Error('transferIds expected to be array')
    }

    const destBridge = this.getSiblingWatcherByChainId(destinationChainId)
      .bridge

    logger.debug(`transferRootId: ${transferRootId}`)

    const tree = new MerkleTree(transferIds)
    const calculatedTransferRootHash = tree.getHexRoot()
    if (calculatedTransferRootHash !== transferRootHash) {
      logger.debug('transferIds:', JSON.stringify(transferIds))
      logger.error(
        `transfers computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${calculatedTransferRootHash}`
      )
      await this.db.transferRoots.update(transferRootHash, {
        transferIds: []
      })
      return
    }

    logger.debug('sourceChainId:', sourceChainId)
    logger.debug('destinationChainId:', destinationChainId)
    logger.debug('computed transferRootHash:', transferRootHash)
    logger.debug('bonder:', bonder)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    logger.debug('transferIds', JSON.stringify(transferIds))

    const transferRootStruct = await this.bridge.getTransferRoot(transferRootHash, totalAmount)
    if (transferRootStruct.amountWithdrawn.eq(totalAmount)) {
      logger.debug(`transfer root amountWithdrawn (${this.bridge.formatUnits(transferRootStruct.amountWithdrawn)}) matches totalAmount (${this.bridge.formatUnits(totalAmount)}). Marking transfer root as all settled`)
      await this.db.transferRoots.update(transferRootHash, {
        allSettled: true
      })
      return
    }

    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping settleBondedWithdrawals`)
      return
    }

    await this.db.transferRoots.update(transferRootHash, {
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
    const { transferRootHash, withdrawalBonder } = dbTransfer
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot) {
      throw new Error(`transfer root hash "${transferRootHash}" not found in db`)
    }

    return await this.checkTransferRootHash(transferRootHash, withdrawalBonder)
  }
}

export default SettleBondedWithdrawalWatcher
