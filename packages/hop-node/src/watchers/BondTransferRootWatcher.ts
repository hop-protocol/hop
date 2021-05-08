import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { wait, networkIdToSlug, networkSlugToId } from 'src/utils'
import { formatUnits } from 'ethers/lib/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import chalk from 'chalk'
import MerkleTree from 'src/utils/MerkleTree'
import { Chain } from 'src/constants'
import BaseWatcher from './helpers/BaseWatcher'
import L1Bridge from './helpers/L1Bridge'
import L2Bridge from './helpers/L2Bridge'

export interface Config {
  isL1: boolean
  bridgeContract: Contract
  label: string
  order?: () => number
  dryMode?: boolean
}

class BondTransferRootWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: BondTransferRootWatcher }
  waitMinBondDelay: boolean = true

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
    }
  }

  async stop () {
    this.bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async syncUp () {
    if (this.isL1) {
      return
    }
    this.logger.debug('syncing up events')
    const blockNumber = await this.bridge.getBlockNumber()
    const startBlockNumber = blockNumber - 1000
    const events = await (this.bridge as L2Bridge).getTransfersCommitedEvents(
      startBlockNumber,
      blockNumber
    )

    await this.handleTransfersCommittedEvents(events)
  }

  async watch () {
    if (this.isL1) {
      return
    }
    this.bridge.on(
      (this.bridge as L2Bridge).TransfersCommitted,
      this.handleTransfersCommittedEvent
    )
    this.bridge.on('error', err => {
      this.logger.error('event watcher error:', err.message)
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
        this.logger.error('poll check error:', err.message)
        this.notifier.error(`poll check error: '${err.message}`)
      }
      await wait(10 * 1000)
    }
  }

  async handleTransfersCommittedEvents (events: any[]) {
    for (let event of events) {
      const { rootHash, totalAmount, rootCommittedAt } = event.args
      await this.handleTransfersCommittedEvent(
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
        commitedAt
      } = dbTransferRoot
      await this.checkTransfersCommited(
        transferRootHash,
        totalAmount,
        chainId,
        commitedAt
      )
    }
  }

  checkTransfersCommited = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    chainId: number,
    commitedAt: number
  ) => {
    if (this.isL1) {
      return
    }
    let dbTransferRoot: TransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (dbTransferRoot?.bonded) {
      return
    }
    if (dbTransferRoot?.sentBondTx) {
      return
    }

    const sourceChainId = await (this.bridge as L2Bridge).getChainId()
    const network = networkIdToSlug(chainId)
    const sourceNetwork = networkIdToSlug(sourceChainId)
    if (sourceNetwork === Chain.xDai || sourceNetwork === Chain.Polygon) {
      return
    }

    const isBonder = await this.siblingWatchers[chainId].bridge.isBonder()
    if (!isBonder) {
      return
    }

    await this.bridge.waitSafeConfirmations()
    const minDelay = await (this.siblingWatchers[
      networkSlugToId(Chain.Ethereum)
    ].bridge as L1Bridge).getMinTransferRootBondDelaySeconds()
    const blockTimestamp = await this.bridge.getBlockTimestamp()
    const delta = blockTimestamp - commitedAt - minDelay
    const shouldBond = delta > 0
    if (this.waitMinBondDelay && !shouldBond) {
      this.logger.debug(
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
    const transferBondStruct = await (this.siblingWatchers[
      networkSlugToId(Chain.Ethereum)
    ].bridge as L1Bridge).getTransferBond(transferRootId)
    const createdAt = Number(transferBondStruct.createdAt.toString())
    if (createdAt > 0) {
      this.logger.debug(
        `transferRootHash ${transferRootHash} already bonded. skipping.`
      )
      await db.transferRoots.update(transferRootHash, {
        bonded: true
      })
      return
    }

    this.logger.info(
      sourceChainId,
      `transferRootHash:`,
      chalk.bgMagenta.black(transferRootHash)
    )
    this.logger.debug('commitedAt:', commitedAt)
    this.logger.debug('chainId:', chainId)
    this.logger.debug('transferRootHash:', transferRootHash)
    this.logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
    this.logger.debug('transferRootId:', transferRootId)
    await db.transferRoots.update(transferRootHash, {
      transferRootHash,
      totalAmount,
      chainId,
      sourceChainId,
      commited: true
    })

    await this.waitTimeout(transferRootHash, totalAmount)
    dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (!dbTransferRoot) {
      this.logger.warn('no transfer root')
      return
    }

    this.logger.debug(
      'dbTransferRoot transferRootHash:',
      dbTransferRoot.transferRootHash
    )
    this.logger.debug(
      'dbTransferRoot totalAmount:',
      this.bridge.formatUnits(dbTransferRoot.totalAmount)
    )
    this.logger.debug('dbTransferRoot chainId:', dbTransferRoot.chainId)
    this.logger.debug(
      'dbTransferRoot sourceChainId:',
      dbTransferRoot.sourceChainId
    )
    this.logger.debug('dbTransferRoot commitedAt:', dbTransferRoot.commitedAt)
    this.logger.debug('dbTransferRoot commited:', dbTransferRoot.commited)
    this.logger.debug('dbTransferRoot sentBondTx:', !!dbTransferRoot.sentBondTx)
    const pendingTransfers: string[] = Object.values(
      dbTransferRoot.transferHashes || []
    )
    this.logger.debug('transferRootHash transferHashes:', pendingTransfers)
    if (pendingTransfers.length) {
      const tree = new MerkleTree(pendingTransfers)
      const rootHash = tree.getHexRoot()
      this.logger.debug('calculated transfer root hash:', rootHash)
      if (rootHash !== transferRootHash) {
        this.logger.warn('calculated transfer root hash does not match')
      }
    }

    dbTransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )
    if (dbTransferRoot?.sentBondTx || dbTransferRoot?.bonded) {
      this.logger.debug(
        'sent?:',
        !!dbTransferRoot.sentBondTx,
        'bonded?:',
        !!dbTransferRoot?.bonded
      )
      return
    }

    const l1Bridge = this.siblingWatchers[networkSlugToId(Chain.Ethereum)]
      .bridge as L1Bridge
    const hasPositiveBalance = await l1Bridge.hasPositiveBalance()
    if (!hasPositiveBalance) {
      throw new Error('bonder requires positive balance to bond transfer root')
    }

    if (this.dryMode) {
      this.logger.warn('dry mode: skipping bondTransferRoot transaction')
      return
    }

    await db.transferRoots.update(transferRootHash, {
      sentBondTx: true
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
            sentBondTx: false
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
          sentBondTx: false
        })

        throw err
      })
    this.logger.info(
      'L1 bondTransferRoot tx',
      chalk.bgYellow.black.bold(tx.hash)
    )
    this.notifier.info(`chainId: ${chainId} bondTransferRoot tx: ${tx.hash}`)
  }

  handleTransfersCommittedEvent = async (
    transferRootHash: string,
    totalAmount: BigNumber,
    commitedAtBn: BigNumber,
    meta: any
  ) => {
    try {
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        transferRootHash
      )
      if (dbTransferRoot?.commitedAt) {
        return
      }

      const commitedAt = Number(commitedAtBn.toString())
      this.logger.debug(`received L2 TransfersCommitted event`)
      this.logger.debug(`commitedAt:`, commitedAt)
      const { transactionHash } = meta
      const { data } = await this.bridge.getTransaction(transactionHash)
      const { destinationChainId: chainId } = await (this
        .bridge as L2Bridge).decodeCommitTransfersData(data)
      const decimals = await this.getBridgeTokenDecimals()

      await db.transferRoots.update(transferRootHash, {
        transferRootHash,
        totalAmount,
        chainId,
        commitedAt
      })

      await this.checkTransfersCommited(
        transferRootHash,
        totalAmount,
        chainId,
        commitedAt
      )
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.logger.error('bondTransferRoot error:', err.message)
      }
    }
  }

  async getBridgeTokenDecimals () {
    const token = await (this.siblingWatchers[networkSlugToId(Chain.Ethereum)]
      .bridge as L1Bridge).l1CanonicalToken()
    return token.decimals()
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
      const bond = await (this.siblingWatchers[networkSlugToId(Chain.Ethereum)]
        .bridge as L1Bridge).getTransferBond(transferRootId)
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
