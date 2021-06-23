import '../moduleAlias'
import { Contract, BigNumber, Event } from 'ethers'
import { wait } from 'src/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import chalk from 'chalk'
import MerkleTree from 'src/utils/MerkleTree'
import { Chain } from 'src/constants'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import { config as globalConfig } from 'src/config'

export interface Config {
  isL1: boolean
  bridgeContract: Contract
  label: string
  order?: () => number
  dryMode?: boolean
}

class BondTransferRootWatcher extends BaseWatcherWithEventHandlers {
  siblingWatchers: { [chainId: string]: BondTransferRootWatcher }
  waitMinBondDelay: boolean = globalConfig.isMainnet
  skipChains: string[] = globalConfig.isMainnet
    ? [Chain.xDai, Chain.Polygon]
    : [Chain.xDai]

  constructor (config: Config) {
    super({
      tag: 'bondTransferRootWatcher',
      prefix: config.label,
      logColor: 'cyan',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
  }

  async start () {
    this.started = true
    try {
      await Promise.all([this.syncUp(), this.watch(), this.pollCheck()])
    } catch (err) {
      this.logger.error(`watcher error:`, err.message)
      this.notifier.error(`watcher error: '${err.message}`)
      this.quit()
    }
  }

  async syncUp (): Promise<any> {
    this.logger.debug('syncing up events')

    const promises: Promise<any>[] = []
    if (this.isL1) {
      const l1Bridge = this.bridge as L1Bridge
      promises.push(
        this.eventsBatch(
          async (start: number, end: number) => {
            const events = await l1Bridge.getTransferRootBondedEvents(
              start,
              end
            )
            await this.handleTransferRootBondedEvents(events)
          },
          { key: l1Bridge.TransferRootBonded }
        )
      )
    } else {
      const l2Bridge = this.bridge as L2Bridge
      promises.push(
        this.eventsBatch(
          async (start: number, end: number) => {
            const events = await l2Bridge.getTransfersCommittedEvents(
              start,
              end
            )
            await this.handleTransfersCommittedEvents(events)
          },
          { key: l2Bridge.TransfersCommitted }
        )
      )
    }

    await Promise.all(promises)
    this.logger.debug('done syncing')

    await wait(this.resyncIntervalSec)
    return this.syncUp()
  }

  async watch () {
    if (this.isL1) {
      const l1Bridge = this.bridge as L1Bridge
      this.bridge
        .on(l1Bridge.TransferRootBonded, this.handleTransferRootBondedEvent)
        .on('error', err => {
          this.logger.error(`event watcher error: ${err.message}`)
          this.notifier.error(`event watcher error: ${err.message}`)
          this.quit()
        })
      return
    }
    const l2Bridge = this.bridge as L2Bridge
    this.bridge
      .on(l2Bridge.TransfersCommitted, this.handleTransfersCommittedEvent)
      .on('error', err => {
        this.logger.error(`event watcher error: ${err.message}`)
        this.notifier.error(`event watcher error: ${err.message}`)
        this.quit()
      })
  }

  async pollCheck () {
    while (true) {
      if (!this.started) {
        return
      }
      try {
        await this.checkTransfersCommittedFromDb()
      } catch (err) {
        this.logger.error(`poll check error: ${err.message}`)
        this.notifier.error(`poll check error: ${err.message}`)
      }
      await wait(this.pollIntervalSec)
    }
  }

  async handleTransferRootBondedEvents (events: Event[]) {
    for (let event of events) {
      const { root, amount } = event.args
      await this.handleTransferRootBondedEvent(root, amount, event)
    }
  }

  async handleTransfersCommittedEvents (events: Event[]) {
    for (let event of events) {
      const {
        destinationChainId: chainId,
        rootHash,
        totalAmount,
        rootCommittedAt
      } = event.args
      await this.handleTransfersCommittedEvent(
        chainId,
        rootHash,
        totalAmount,
        rootCommittedAt,
        event
      )
    }
  }

  async checkTransfersCommittedFromDb () {
    const dbTransferRoots = await db.transferRoots.getUnbondedTransferRoots()
    for (let dbTransferRoot of dbTransferRoots) {
      const {
        transferRootHash,
        totalAmount,
        chainId,
        committedAt
      } = dbTransferRoot
      await this.checkTransfersCommitted(
        transferRootHash,
        totalAmount,
        chainId,
        committedAt
      )
    }
  }

  checkTransfersCommitted = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    chainId: number,
    committedAt: number
  ) => {
    const logger = this.logger.create({ root: transferRootHash })

    if (this.isL1) {
      return
    }
    let dbTransferRoot: TransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (dbTransferRoot?.bonded) {
      return
    }

    const l2Bridge = this.bridge as L2Bridge
    const bridgeChainId = await l2Bridge.getChainId()
    const sourceChainId = dbTransferRoot.sourceChainId
    if (!sourceChainId) {
      return
    }
    const sourceChainSlug = this.chainIdToSlug(sourceChainId)
    if (bridgeChainId !== sourceChainId) {
      return
    }

    // bonding transfer root should only happen when exiting
    // Optimism or Arbitrum or any chain where exit period is longer than 1 day
    if (this.skipChains.includes(sourceChainSlug)) {
      // TODO: mark as skipped
      // logger.warn('source chain is not Arbitrum or Optimism. Skipping bondTransferRoot')
      return
    }
    if (sourceChainId !== this.bridge.chainId) {
      return
    }
    const bridgeAddress = await this.getSiblingWatcherByChainId(
      chainId
    ).bridge.getAddress()
    if (dbTransferRoot.destinationBridgeAddress !== bridgeAddress) {
      return
    }

    const isBonder = await this.getSiblingWatcherByChainId(
      chainId
    ).bridge.isBonder()
    if (!isBonder) {
      logger.warn(
        `not a bonder on chain ${chainId}. Cannot bond transfer root.`
      )
      return
    }

    const l1Bridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum)
      .bridge as L1Bridge
    await l1Bridge.waitSafeConfirmations()
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
      await db.transferRoots.update(transferRootHash, {
        transferRootId,
        transferRootHash,
        bonded: true
      })
      return
    }

    logger.info(
      sourceChainId,
      `transferRootHash:`,
      chalk.bgMagenta.black(transferRootHash)
    )
    logger.debug('committedAt:', committedAt)
    logger.debug('chainId:', chainId)
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('transferRootId:', transferRootId)
    logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    logger.debug('transferRootId:', transferRootId)
    await db.transferRoots.update(transferRootHash, {
      transferRootHash,
      transferRootId,
      totalAmount,
      chainId,
      sourceChainId,
      committed: true,
      committedAt
    })

    await this.waitTimeout(transferRootHash, totalAmount)
    dbTransferRoot = await db.transferRoots.getByTransferRootHash(
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
    logger.debug('dbTransferRoot chainId:', dbTransferRoot.chainId)
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

    dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (
      (dbTransferRoot?.sentBondTx || dbTransferRoot?.bonded) &&
      dbTransferRoot.sentBondTxAt
    ) {
      const tenMinutes = 60 * 10 * 1000
      // skip if a transaction was sent in the last 10 minutes
      if (dbTransferRoot.sentBondTxAt + tenMinutes > Date.now()) {
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

    if (this.dryMode) {
      logger.warn('dry mode: skipping bondTransferRoot transaction')
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
      `bonding transfer root ${transferRootHash} on chain ${chainId}`
    )
    await db.transferRoots.update(transferRootHash, {
      sentBondTx: true,
      sentBondTxAt: Date.now()
    })
    const tx = await l1Bridge.bondTransferRoot(
      transferRootHash,
      chainId,
      totalAmount
    )
    tx?.wait()
      .then(async (receipt: any) => {
        if (receipt.status !== 1) {
          await db.transferRoots.update(transferRootHash, {
            sentBondTx: false,
            sentBondTxAt: 0
          })
          throw new Error('status=0')
        }

        this.emit('bondTransferRoot', {
          transferRootHash,
          chainId,
          totalAmount
        })

        db.transferRoots.update(transferRootHash, {
          bonded: true
        })
      })
      .catch(async (err: Error) => {
        db.transferRoots.update(transferRootHash, {
          sentBondTx: false,
          sentBondTxAt: 0
        })

        throw err
      })
    logger.info('L1 bondTransferRoot tx', chalk.bgYellow.black.bold(tx.hash))
    this.notifier.info(`chainId: ${chainId} bondTransferRoot tx: ${tx.hash}`)
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
