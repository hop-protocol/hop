import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { wait } from 'src/utils'
import { formatUnits } from 'ethers/lib/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import chalk from 'chalk'
import MerkleTree from 'src/utils/MerkleTree'
import BaseWatcher from './helpers/BaseWatcher'
import L1Bridge from './helpers/L1Bridge'
import L2Bridge from './helpers/L2Bridge'

export interface Config {
  l1BridgeContract: Contract
  l2BridgeContract: Contract
  label: string
  order?: () => number
}

class BondTransferRootWatcher extends BaseWatcher {
  l1Bridge: L1Bridge
  l2Bridge: L2Bridge
  waitMinBondDelay: boolean = true

  constructor (config: Config) {
    super({
      tag: 'bondTransferRootWatcher',
      prefix: config.label,
      logColor: 'cyan',
      order: config.order
    })
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    this.l2Bridge = new L2Bridge(config.l2BridgeContract)
  }

  async start () {
    this.started = true
    try {
      await Promise.all([this.syncUp(), this.watch(), this.pollCheck()])
    } catch (err) {
      this.logger.error(`watcher error:`, err.message)
    }
  }

  async stop () {
    this.l1Bridge.removeAllListeners()
    this.l2Bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async syncUp () {
    this.logger.debug('syncing up events')
    const blockNumber = await this.l2Bridge.getBlockNumber()
    const startBlockNumber = blockNumber - 1000
    const events = await this.l2Bridge.getTransfersCommitedEvents(
      startBlockNumber,
      blockNumber
    )

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

  async watch () {
    this.l2Bridge.on(
      this.l2Bridge.TransfersCommitted,
      this.handleTransfersCommittedEvent
    )
    this.l2Bridge.on('error', err => {
      this.logger.error('event watcher error:', err.message)
    })
  }

  async pollCheck () {
    while (true) {
      if (!this.started) {
        return
      }
      try {
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
      } catch (err) {
        this.logger.error('poll check error:', err.message)
      }
      await wait(10 * 1000)
    }
  }

  checkTransfersCommited = async (
    transferRootHash: string,
    totalAmount: number,
    chainId: string,
    commitedAt: number
  ) => {
    let dbTransferRoot: TransferRoot = await db.transferRoots.getByTransferRootHash(
      transferRootHash
    )

    if (dbTransferRoot?.bonded) {
      return
    }

    if (dbTransferRoot?.sentBondTx) {
      return
    }

    const isBonder = await this.l1Bridge.isBonder()
    if (!isBonder) {
      return
    }

    const minDelay = await this.l1Bridge.getMinTransferRootBondDelaySeconds()
    const blockTimestamp = await this.l1Bridge.getBlockTimestamp()
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

    const transferRootId = await this.l1Bridge.getTransferRootId(
      transferRootHash,
      totalAmount
    )
    const transferBondStruct = await this.l1Bridge.getTransferBond(
      transferRootId
    )
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

    const sourceChainId = await this.l2Bridge.getChainId()
    this.logger.info(
      sourceChainId,
      `transferRootHash:`,
      chalk.bgMagenta.black(transferRootHash)
    )
    this.logger.debug('commitedAt:', commitedAt)
    this.logger.debug('chainId:', chainId)
    this.logger.debug('transferRootHash:', transferRootHash)
    this.logger.debug('totalAmount:', totalAmount)
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
    this.logger.debug('dbTransferRoot totalAmount:', dbTransferRoot.totalAmount)
    this.logger.debug('dbTransferRoot chainId:', dbTransferRoot.chainId)
    this.logger.debug(
      'dbTransferRoot sourceChainId:',
      dbTransferRoot.sourceChainID
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

    await db.transferRoots.update(transferRootHash, {
      sentBondTx: true
    })
    const tx = await this.l1Bridge.bondTransferRoot(
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
  }

  handleTransfersCommittedEvent = async (
    transferRootHash: string,
    _totalAmount: BigNumber,
    _commitedAt: BigNumber,
    meta: any
  ) => {
    try {
      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        transferRootHash
      )
      if (dbTransferRoot?.commitedAt) {
        return
      }

      const commitedAt = Number(_commitedAt.toString())
      this.logger.debug(`received L2 TransfersCommitted event`)
      this.logger.debug(`commitedAt:`, commitedAt)
      const { transactionHash } = meta
      const { data } = await this.l2Bridge.getTransaction(transactionHash)
      const {
        destinationChainId: chainId
      } = await this.l2Bridge.decodeCommitTransfersData(data)
      const totalAmount = Number(formatUnits(_totalAmount.toString(), 18))

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
        this.logger.error('bondTransferRoot tx error:', err.message)
      }
    }
  }

  async waitTimeout (transferRootHash: string, totalAmount: number) {
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
      const transferRootId = await this.l1Bridge.getTransferRootId(
        transferRootHash,
        totalAmount
      )
      const bond = await this.l1Bridge.getTransferBond(transferRootId)
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
