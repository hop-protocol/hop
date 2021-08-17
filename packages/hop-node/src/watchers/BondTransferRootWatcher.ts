import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import chalk from 'chalk'
import { BigNumber, Contract, providers } from 'ethers'
import { Chain, TX_RETRY_DELAY_MS } from 'src/constants'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { config as globalConfig } from 'src/config'
import { wait } from 'src/utils'

export interface Config {
  chainSlug: string
  tokenSymbol: string
  isL1: boolean
  bridgeContract: Contract
  label: string
  order?: () => number
  dryMode?: boolean
  stateUpdateAddress: string
}

class BondTransferRootWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: BondTransferRootWatcher }
  waitMinBondDelay: boolean = globalConfig.isMainnet
  skipChains: string[] = globalConfig.isMainnet
    ? [Chain.xDai, Chain.Polygon]
    : [Chain.xDai]

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'BondTransferRootWatcher',
      prefix: config.label,
      logColor: 'cyan',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode,
      stateUpdateAddress: config.stateUpdateAddress
    })
  }

  async pollHandler () {
    await this.checkTransfersCommittedFromDb()
  }

  async checkTransfersCommittedFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getUnbondedTransferRoots({
      sourceChainId: await this.bridge.getChainId()
    })
    if (dbTransferRoots.length) {
      this.logger.debug(
        `checking ${dbTransferRoots.length} unbonded transfer roots db items`
      )
    }

    for (const dbTransferRoot of dbTransferRoots) {
      const {
        transferRootHash,
        totalAmount,
        destinationChainId,
        committedAt
      } = dbTransferRoot

      await this.checkTransfersCommitted(
        transferRootHash,
        totalAmount,
        destinationChainId,
        committedAt
      )
    }
  }

  checkTransfersCommitted = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    destinationChainId: number,
    committedAt: number
  ) => {
    const logger = this.logger.create({ root: transferRootHash })

    if (this.isL1) {
      return
    }
    let dbTransferRoot: TransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    const l2Bridge = this.bridge as L2Bridge
    const bridgeChainId = await l2Bridge.getChainId()
    const { sourceChainId, commitTxHash } = dbTransferRoot
    const sourceChainSlug = this.chainIdToSlug(sourceChainId)

    // bonding transfer root should only happen when exiting
    // Optimism or Arbitrum or any chain where exit period is longer than 1 day
    if (this.skipChains.includes(sourceChainSlug)) {
      // TODO: mark as skipped
      // logger.warn('source chain is not Arbitrum or Optimism. Skipping bondTransferRoot')
      return
    }

    const isBonder = await this.getSiblingWatcherByChainId(
      destinationChainId
    ).bridge.isBonder()
    if (!isBonder) {
      logger.warn(
        `not a bonder on chain ${destinationChainId}. Cannot bond transfer root.`
      )
      return
    }

    const l1Bridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum)
      .bridge as L1Bridge

    const minDelay = await l1Bridge.getMinTransferRootBondDelaySeconds()
    const blockTimestamp = await l1Bridge.getBlockTimestamp()
    const delta = blockTimestamp - committedAt - minDelay
    const shouldBond = delta > 0
    if (this.waitMinBondDelay && !shouldBond) {
      logger.debug(
        `transferRootHash ${transferRootHash} too early to bond. Must wait ${Math.abs(
          delta
        )} seconds`
      )
      return
    }

    const transferRootId = await this.bridge.getTransferRootId(
      transferRootHash,
      totalAmount
    )
    const isBonded = await l1Bridge.isTransferRootIdBonded(transferRootId)
    if (isBonded) {
      logger.debug(
        `transferRootHash ${transferRootHash} already bonded. skipping.`
      )
      await this.db.transferRoots.update(transferRootHash, {
        transferRootId,
        transferRootHash,
        bonded: true
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
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('transferRootId:', transferRootId)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    logger.debug('transferRootId:', transferRootId)

    await this.waitTimeout(transferRootHash, totalAmount)
    dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot) {
      logger.warn('no transfer root')
      return
    }

    logger.debug(
      'dbTransferRoot transferRootHash:',
      dbTransferRoot.transferRootHash
    )
    logger.debug(
      'dbTransferRoot totalAmount:',
      this.bridge.formatUnits(dbTransferRoot.totalAmount)
    )
    logger.debug(
      'dbTransferRoot destinationChainId:',
      dbTransferRoot.destinationChainId
    )
    logger.debug('dbTransferRoot sourceChainId:', sourceChainId)
    logger.debug('dbTransferRoot committedAt:', dbTransferRoot.committedAt)
    logger.debug('dbTransferRoot committed:', dbTransferRoot.committed)
    logger.debug('dbTransferRoot sentBondTx:', !!dbTransferRoot.sentBondTx)
    const pendingTransfers: string[] = Object.values(
      dbTransferRoot.transferIds || []
    )
    logger.debug('transferRootHash transferIds:', pendingTransfers)
    if (pendingTransfers.length) {
      const tree = new MerkleTree(pendingTransfers)
      const rootHash = tree.getHexRoot()
      logger.debug('calculated transfer root hash:', rootHash)
      if (rootHash !== transferRootHash) {
        logger.warn('calculated transfer root hash does not match')
      }
    }

    dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (
      (dbTransferRoot?.sentBondTx || dbTransferRoot?.bonded) &&
      dbTransferRoot.sentBondTxAt
    ) {
      // skip if a transaction was sent in the last 10 minutes
      if (dbTransferRoot.sentBondTxAt + TX_RETRY_DELAY_MS > Date.now()) {
        logger.debug(
          transferRootHash,
          'sent?:',
          !!dbTransferRoot.sentBondTx,
          'bonded?:',
          !!dbTransferRoot?.bonded
        )
      }
      return
    }

    const hasPositiveBalance = await l1Bridge.hasPositiveBalance()
    if (!hasPositiveBalance) {
      logger.warn('bonder requires positive balance to bond transfer root')
      return
    }

    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping bondTransferRoot`)
      return
    }

    const [credit, debit] = await Promise.all([
      this.bridge.getCredit(),
      this.bridge.getDebit()
    ])
    if (
      credit
        .sub(debit)
        .sub(totalAmount)
        .lt(0)
    ) {
      logger.warn(
        `not enough available credit to bond transfer root. Have ${this.bridge.formatUnits(
          credit
        ) - this.bridge.formatUnits(debit)}, need ${this.bridge.formatUnits(
          totalAmount
        )}`
      )
      return
    }

    logger.debug(
      `bonding transfer root ${transferRootHash} on chain ${destinationChainId}`
    )
    await this.db.transferRoots.update(transferRootHash, {
      sentBondTx: true,
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
            sentBondTx: false,
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
          sentBondTx: false,
          sentBondTxAt: 0
        })

        throw err
      })
    logger.info('L1 bondTransferRoot tx', chalk.bgYellow.black.bold(tx.hash))
    this.notifier.info(
      `destinationChainId: ${destinationChainId} bondTransferRoot tx: ${tx.hash}`
    )
  }

  async waitTimeout (transferRootHash: string, totalAmount: BigNumber) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for bond root event. transfer root hash: ${transferRootHash}`
    )
    let timeout = this.order() * 15 * 1000
    while (timeout > 0) {
      if (!this.started) {
        return
      }
      const transferRootId = await this.bridge.getTransferRootId(
        transferRootHash,
        totalAmount
      )
      const l1Bridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum)
        .bridge as L1Bridge
      const bond = await l1Bridge.getTransferBond(transferRootId)
      if (bond.createdAt.toNumber() > 0) {
        break
      }
      const delay = 2 * 1000
      timeout -= delay
      await wait(delay)
    }
    if (timeout <= 0) {
      return
    }
    this.logger.debug(`transfer root hash already bonded: ${transferRootHash}`)
    throw new Error('cancelled')
  }
}

export default BondTransferRootWatcher
