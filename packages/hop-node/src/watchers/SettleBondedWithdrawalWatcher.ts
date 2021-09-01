import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import MerkleTree from 'src/utils/MerkleTree'
import chalk from 'chalk'
import { Contract, providers } from 'ethers'
import { Transfer } from 'src/db/TransfersDb'
import { wait } from 'src/utils'

export interface Config {
  chainSlug: string
  tokenSymbol: string
  isL1: boolean
  bridgeContract: Contract
  label: string
  order?: () => number
  dryMode?: boolean
  minThresholdPercent: number
  stateUpdateAddress?: string
}

const BONDER_ORDER_DELAY_MS = 60 * 1000

class SettleBondedWithdrawalWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: SettleBondedWithdrawalWatcher }
  shouldWaitMinThreshold: boolean = false

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
    try {
      await this.checkUnsettledTransferRootsFromDb()
    } catch (err) {
      this.logger.error(
        `poll error checkUnsettledTransfers: ${err.message}`
      )
      this.notifier.error(
        `poll error checkUnsettledTransfers: ${err.message}`
      )
    }
  }

  checkUnsettledTransferRootsFromDb = async () => {
    // only process transfer where this bridge is the destination chain
    const dbTransferRoots = await this.db.transferRoots.getUnsettledTransferRoots(
      {
        destinationChainId: await this.bridge.getChainId()
      }
    )

    const promises: Promise<any>[] = []
    for (const dbTransferRoot of dbTransferRoots) {
      const { transferRootHash, transferIds } = dbTransferRoot

      // get all db transfer items that belong to root
      const dbTransfers : Transfer[] = []
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
      const allSettled = dbTransfers.every(
        (dbTransfer: Transfer) => dbTransfer?.withdrawalBondSettled
      )
      if (allSettled) {
        await this.db.transferRoots.update(transferRootHash, {
          allSettled
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

    if (!promises.length) {
      return
    }

    this.logger.debug(
      `checking ${promises.length} unsettled db transfer roots`
    )

    await Promise.all(promises)
  }

  checkTransferRootHash = async (transferRootHash: string, bonder: string) => {
    try {
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

      logger.debug(
        'transferRootId:',
        chalk.bgMagenta.black(transferRootId)
      )

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

      await this.handleStateSwitch()
      if (this.isDryOrPauseMode) {
        logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping settleBondedWithdrawals`)
        return
      }

      await this.db.transferRoots.update(transferRootHash, {
        withdrawalBondSettleTxSentAt: Date.now()
      })
      logger.debug('sending settle tx')
      const tx = await destBridge.settleBondedWithdrawals(
        bonder,
        transferIds,
        totalAmount
      )
      tx?.wait()
        .then(async (receipt: providers.TransactionReceipt) => {
          if (receipt.status !== 1) {
            throw new Error('status=0')
          }
          this.emit('settleBondedWithdrawals', {
            transferRootHash,
            networkName: this.chainIdToSlug(destinationChainId),
            chainId: destinationChainId
          })
        })
        .catch(async (err: Error) => {
          throw err
        })
      logger.info(
        `settleBondedWithdrawals on destinationChainId:${destinationChainId} tx: ${chalk.bgYellow.black.bold(
          tx.hash
        )}`
      )
      this.notifier.info(
        `settleBondedWithdrawals on destinationChainId:${destinationChainId} tx: ${tx.hash}`
      )
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.logger.error('settleBondedWithdrawal error:', err.message)
        this.notifier.error(`settleBondedWithdrawal error: ${err.message}`)
      }
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

    return this.checkTransferRootHash(transferRootHash, withdrawalBonder)
  }

  async waitTimeout (transferId: string, destinationChainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for settle bonded withdrawal event. transferId: ${transferId} destinationChainId: ${destinationChainId}`
    )
    const bridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    let timeout = this.order() * BONDER_ORDER_DELAY_MS
    while (timeout > 0) {
      if (!this.started) {
        return
      }

      // TODO
      // break

      const delay = 2 * 1000
      timeout -= delay
      await wait(delay)
    }
    if (timeout <= 0) {
      return
    }
    this.logger.debug(`transfer id already bonded ${transferId}`)
    throw new Error('cancelled')
  }
}

export default SettleBondedWithdrawalWatcher
