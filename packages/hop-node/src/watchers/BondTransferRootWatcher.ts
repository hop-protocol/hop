import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import chalk from 'chalk'
import getTransferRootId from 'src/utils/getTransferRootId'
import { BigNumber, Contract, providers } from 'ethers'

export interface Config {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: Contract
  label: string
  isL1: boolean
  order?: () => number
  dryMode?: boolean
  stateUpdateAddress: string
}

class BondTransferRootWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: BondTransferRootWatcher }

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'BondTransferRootWatcher',
      prefix: config.label,
      logColor: 'cyan',
      isL1: config.isL1,
      order: config.order,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode,
      stateUpdateAddress: config.stateUpdateAddress
    })
  }

  async pollHandler () {
    await this.checkTransfersCommittedFromDb()
  }

  async checkTransfersCommittedFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getUnbondedTransferRoots()
    if (dbTransferRoots.length) {
      this.logger.debug(
        `checking ${dbTransferRoots.length} unbonded transfer roots db items`
      )
    }

    const promises: Promise<any>[] = []
    for (const dbTransferRoot of dbTransferRoots) {
      const {
        transferRootHash,
        totalAmount,
        destinationChainId,
        committedAt,
        sourceChainId,
        transferIds
      } = dbTransferRoot

      promises.push(this.checkTransfersCommitted(
        transferRootHash,
        totalAmount,
        destinationChainId,
        committedAt,
        sourceChainId,
        transferIds
      ))
    }

    await Promise.all(promises)
  }

  checkTransfersCommitted = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    destinationChainId: number,
    committedAt: number,
    sourceChainId: number,
    transferIds: string[]
  ) => {
    const logger = this.logger.create({ root: transferRootHash })

    const l1Bridge = this.bridge as L1Bridge
    const transferRootId = getTransferRootId(
      transferRootHash,
      totalAmount
    )

    const minDelaySec = await l1Bridge.getMinTransferRootBondDelaySeconds()
    const minDelayMs = minDelaySec * 1000
    const committedAtMs = committedAt * 1000
    const delta = Date.now() - committedAtMs - minDelayMs
    const shouldBond = delta > 0
    if (!shouldBond) {
      logger.debug(
        `transferRootHash ${transferRootHash} too early to bond. Must wait ${Math.abs(
          delta
        )} seconds`
      )
      return
    }

    const isBonded = await l1Bridge.isTransferRootIdBonded(transferRootId)
    if (isBonded) {
      logger.debug(
        `transferRootHash ${transferRootHash} already bonded. skipping.`
      )
      const event = await l1Bridge.getTransferRootBondedEvent(transferRootHash)
      if (!event) {
        throw new Error(`expected event object. transferRootHash: ${transferRootHash}`)
      }
      const { transactionHash } = event
      const { from: sender } = await l1Bridge.getTransaction(
        event.transactionHash
      )
      const timestamp = await this.bridge.getEventTimestamp(event)

      await this.db.transferRoots.update(transferRootHash, {
        transferRootHash,
        bonded: true,
        bonder: sender,
        bondTotalAmount: totalAmount,
        bondTxHash: transactionHash,
        bondedAt: timestamp,
        bondTransferRootId: transferRootId
      })
      return
    }

    logger.info(
      sourceChainId,
      'transferRootHash:',
      chalk.bgMagenta.black(transferRootHash)
    )
    logger.debug('committedAt:', committedAt)
    logger.debug('destinationChainId:', destinationChainId)
    logger.debug('sourceChainId:', sourceChainId)
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('transferRootId:', transferRootId)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    logger.debug('transferRootId:', transferRootId)

    const pendingTransfers: string[] = transferIds || []
    logger.debug('transferRootHash transferIds:', pendingTransfers)
    if (pendingTransfers.length) {
      const tree = new MerkleTree(pendingTransfers)
      const rootHash = tree.getHexRoot()
      logger.debug('calculated transfer root hash:', rootHash)
      if (rootHash !== transferRootHash) {
        logger.error('calculated transfer root hash does not match')
        return
      }
    }

    const availableCredit = await l1Bridge.getBaseAvailableCredit()
    const bondAmount = await l1Bridge.getBondForTransferAmount(totalAmount)
    if (availableCredit.lt(bondAmount)) {
      const msg = `not enough credit to bond transferRoot. Have ${this.bridge.formatUnits(
          availableCredit
        )}, need ${this.bridge.formatUnits(bondAmount)}`
      logger.error(msg)
      this.notifier.error(msg)
      return
    }

    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping bondTransferRoot`)
      return
    }

    logger.debug(
      `bonding transfer root ${transferRootHash} with destination chain ${destinationChainId}`
    )
    await this.db.transferRoots.update(transferRootHash, {
      sentBondTxAt: Date.now()
    })
    const tx = await l1Bridge.bondTransferRoot(
      transferRootHash,
      destinationChainId,
      totalAmount
    )
    tx?.wait()
      .then(async (receipt: providers.TransactionReceipt) => {
        if (receipt.status !== 1) {
          await this.db.transferRoots.update(transferRootHash, {
            sentBondTxAt: 0
          })
          throw new Error('status=0')
        }

        this.emit('bondTransferRoot', {
          transferRootHash,
          destinationChainId,
          totalAmount
        })
      })
      .catch(async (err: Error) => {
        this.db.transferRoots.update(transferRootHash, {
          sentBondTxAt: 0
        })

        throw err
      })
    logger.info('L1 bondTransferRoot tx', chalk.bgYellow.black.bold(tx.hash))
    this.notifier.info(
      `destinationChainId: ${destinationChainId} bondTransferRoot tx: ${tx.hash}`
    )
  }
}

export default BondTransferRootWatcher
