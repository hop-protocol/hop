import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import MerkleTree from 'src/utils/MerkleTree'
import chalk from 'chalk'
import { Contract, providers } from 'ethers'
import { TX_RETRY_DELAY_MS } from 'src/constants'
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
    const promises: Promise<any>[] = []
    promises.push(
      new Promise(async resolve => {
        try {
          await this.checkUnsettledTransfersFromDb()
        } catch (err) {
          this.logger.error(
            `poll error checkUnsettledTransfers: ${err.message}`
          )
          this.notifier.error(
            `poll error checkUnsettledTransfers: ${err.message}`
          )
        }
        resolve(null)
      })
    )
    await Promise.all(promises)
  }

  checkUnsettledTransfersFromDb = async () => {
    // only process transfer where this bridge is the destination chain
    const dbTransfers: Transfer[] = await this.db.transfers.getUnsettledBondedWithdrawalTransfers(
      {
        destinationChainId: await this.bridge.getChainId()
      }
    )
    const filtered: Transfer[] = []
    const filteredRootHashes: string[] = []
    for (const dbTransfer of dbTransfers) {
      if (filteredRootHashes.includes(dbTransfer.transferRootHash)) {
        continue
      }
      const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
        dbTransfer.transferRootHash
      )
      if (!dbTransferRoot) {
        this.logger.warn(
          `no db transfer root transfer id ${dbTransfer.transferId}`
        )
        continue
      }

      let rootSetTimestampOk = true
      if (dbTransferRoot?.rootSetTimestamp) {
        rootSetTimestampOk = dbTransferRoot.rootSetTimestamp * 1000 + TX_RETRY_DELAY_MS < Date.now()
      }

      let bondSettleTimestampOk = true
      if (dbTransferRoot?.withdrawalBondSettleTxSentAt) {
        bondSettleTimestampOk =
          dbTransferRoot?.withdrawalBondSettleTxSentAt + TX_RETRY_DELAY_MS <
          Date.now()
      }

      const ok =
        !!dbTransferRoot.destinationChainId &&
        !!dbTransferRoot.totalAmount &&
        !!dbTransferRoot.confirmed &&
        !!dbTransferRoot.confirmTxHash &&
        !!dbTransferRoot.committed &&
        !!dbTransferRoot.committedAt &&
        !!dbTransferRoot.rootSetTxHash &&
        rootSetTimestampOk &&
        bondSettleTimestampOk

      if (!ok) {
        continue
      }

      if (!dbTransferRoot?.transferIds?.length) {
        this.logger.warn(
          `db transfer root hash ${dbTransferRoot.transferRootHash} doesn't contain any transfer ids`
        )
        continue
      }

      filtered.push(dbTransfer)
      filteredRootHashes.push(dbTransfer.transferRootHash)
    }
    if (filtered.length) {
      this.logger.debug(
        `checking ${filtered.length} unsettled bonded withdrawal transfers db items`
      )
    }
    const promises: Promise<any>[] = []
    for (const { transferId } of filtered) {
      promises.push(
        new Promise(async resolve => {
          try {
            await this.checkUnsettledTransferId(transferId)
          } catch (err) {
            this.logger.error('checkUnsettledTransferId error:', err.message)
          }
          resolve(null)
        })
      )
    }

    await Promise.all(promises)
  }

  checkUnsettledTransferId = async (transferId: string) => {
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      this.logger.warn(`transfer id "${transferId}" not found in db`)
      return
    }
    try {
      const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
        dbTransfer.transferRootHash
      )
      const {
        transferRootHash: dbTransferRootHash,
        destinationChainId,
        totalAmount
      } = dbTransferRoot
      const transferIds: string[] = dbTransferRoot?.transferIds || []

      const logger = this.logger.create({ root: dbTransferRootHash })
      const destBridge = this.getSiblingWatcherByChainId(destinationChainId)
        .bridge

      logger.debug(
        'transferRootId:',
        chalk.bgMagenta.black(dbTransfer.transferRootId)
      )

      const tree = new MerkleTree(transferIds)
      const transferRootHash = tree.getHexRoot()
      if (transferRootHash !== dbTransferRootHash) {
        logger.debug('transferIds:', JSON.stringify(transferIds))
        logger.error(
          `transfers computed transfer root hash doesn't match. Expected ${dbTransferRootHash}`
        )
        await this.db.transferRoots.update(dbTransferRootHash, {
          transferIds: []
        })
        return
      }

      const bonder = dbTransfer.withdrawalBonder
      logger.debug('sourceChainId:', dbTransfer.sourceChainId)
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
            await this.db.transferRoots.update(transferRootHash, {
              withdrawalBondSettleTxSentAt: 0
            })
            throw new Error('status=0')
          }
          this.emit('settleBondedWithdrawal', {
            transferRootHash,
            networkName: this.chainIdToSlug(destinationChainId),
            chainId: destinationChainId,
            transferId: dbTransfer.transferId
          })
        })
        .catch(async (err: Error) => {
          await this.db.transferRoots.update(transferRootHash, {
            withdrawalBondSettleTxSentAt: 0
          })

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
      await this.db.transfers.update(dbTransfer.transferId, {
        withdrawalBondSettleTxSentAt: 0
      })
    }
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
