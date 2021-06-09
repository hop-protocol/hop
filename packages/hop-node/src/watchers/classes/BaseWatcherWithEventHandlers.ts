import { Contract, BigNumber } from 'ethers'
import BaseWatcher from './BaseWatcher'
import db from 'src/db'
import L2Bridge from './L2Bridge'
import chalk from 'chalk'

interface Config {
  tag: string
  prefix?: string
  logColor?: string
  order?: () => number
  isL1?: boolean
  bridgeContract?: Contract
  dryMode?: boolean
}

class BaseWatcherWithEventHandlers extends BaseWatcher {
  constructor (config: Config) {
    super(config)
  }

  public handleTransferSentEvent = async (
    transferId: string,
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    index: string,
    amountOutMin: BigNumber,
    deadline: BigNumber,
    meta: any
  ) => {
    const logger = this.logger.create({ id: transferId })
    logger.debug('received TransferSent event')

    try {
      const dbTransfer = await db.transfers.getByTransferId(transferId)
      if (dbTransfer?.withdrawalBonded) {
        return
      }
      if (dbTransfer?.sourceChainId) {
        //return
      }

      logger.debug(`received TransferSent event`)
      logger.debug('transfer event amount:', this.bridge.formatUnits(amount))
      logger.debug('transferId:', chalk.bgCyan.black(transferId))

      const { transactionHash, blockNumber } = meta
      await this.bridge.waitSafeConfirmations()
      const sentTimestamp = await this.bridge.getBlockTimestamp(blockNumber)
      const { data } = await this.bridge.getTransaction(transactionHash)

      const l2Bridge = this.bridge as L2Bridge
      const { chainId } = await l2Bridge.decodeSendData(data)
      const sourceChainId = await l2Bridge.getChainId()
      await db.transfers.update(transferId, {
        transferId,
        chainId,
        sourceChainId,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        deadline: Number(deadline.toString()),
        sentTxHash: transactionHash,
        sentBlockNumber: blockNumber,
        sentTimestamp: sentTimestamp
      })
    } catch (err) {
      logger.error(`handleTransferSentEvent error: ${err.message}`)
      this.notifier.error(`handleTransferSentEvent error: ${err.message}`)
    }
  }

  handleTransferRootConfirmedEvent = async (
    sourceChainId: BigNumber,
    destChainId: BigNumber,
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('received TransferRootConfirmed event')

    try {
      const { transactionHash } = meta
      await db.transferRoots.update(transferRootHash, {
        confirmed: true,
        confirmTxHash: transactionHash
      })
    } catch (err) {
      logger.error(`handleTransferRootConfirmedEvent error: ${err.message}`)
      this.notifier.error(`handleTransferRootConfirmedEvent error: ${err.message}`)
    }
  }

  handleTransferRootBondedEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    meta: any
  ) => {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('received TransferRootBonded event')

    try {
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        transferRootHash
      )
      if (dbTransferRoot?.bonded) {
        return
      }
      const { transactionHash } = meta
      const tx = await meta.getTransaction()
      const { from: bonder } = tx
      const transferRootId = await this.bridge.getTransferRootId(
        transferRootHash,
        totalAmount
      )
      logger.debug(`received L1 BondTransferRoot event:`)
      logger.debug(`transferRootHash from event: ${transferRootHash}`)
      logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
      logger.debug(`transferRootId: ${transferRootId}`)
      logger.debug(`event transactionHash: ${transactionHash}`)
      await db.transferRoots.update(transferRootHash, {
        transferRootHash,
        transferRootId,
        committed: true,
        bonded: true,
        bonder,
        bondTxHash: transactionHash
      })
    } catch (err) {
      logger.error(`handleTransferRootBondedEvent error: ${err.message}`)
      this.notifier.error(`handleTransferRootBondedEvent error: ${err.message}`)
    }
  }

  handleTransfersCommittedEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    committedAtBn: BigNumber,
    meta: any
  ) => {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('received TransfersCommitted event')

    try {
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        transferRootHash
      )
      if (
        dbTransferRoot?.committed &&
        dbTransferRoot?.committedAt &&
        dbTransferRoot?.commitTxHash
      ) {
        return
      }
      const committedAt = Number(committedAtBn.toString())
      logger.debug(`received L2 TransfersCommitted event`)
      logger.debug(`committedAt:`, committedAt)
      logger.debug(`totalAmount:`, this.bridge.formatUnits(totalAmount))
      logger.debug(`transferRootHash:`, transferRootHash)
      const { transactionHash } = meta
      const { data } = await this.bridge.getTransaction(transactionHash)
      const l2Bridge = this.bridge as L2Bridge
      const {
        destinationChainId: chainId
      } = await l2Bridge.decodeCommitTransfersData(data)
      const sourceChainId = await l2Bridge.getChainId()
      const destinationBridgeAddress = await this.getSiblingWatcherByChainId(
        chainId
      ).bridge.getAddress()
      const transferRootId = await this.bridge.getTransferRootId(
        transferRootHash,
        totalAmount
      )

      await db.transferRoots.update(transferRootHash, {
        transferRootHash,
        transferRootId,
        totalAmount,
        chainId,
        committedAt,
        destinationBridgeAddress,
        sourceChainId,
        committed: true,
        commitTxHash: transactionHash
      })
    } catch (err) {
      logger.error(`handleTransfersCommittedEvent error: ${err.message}`)
      this.notifier.error(`handleTransfersCommittedEvent error: ${err.message}`)
    }
  }
}

export default BaseWatcherWithEventHandlers
