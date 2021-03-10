import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { wait } from 'src/utils'
import { formatUnits } from 'ethers/lib/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import chalk from 'chalk'
import MerkleTree from 'src/utils/MerkleTree'
import BaseWatcher from './base/BaseWatcher'
import L1Bridge from './base/L1Bridge'
import L2Bridge from './base/L2Bridge'

export interface Config {
  l1BridgeContract: Contract
  l2BridgeContract: Contract
  label: string
  order?: () => number
}

class BondTransferRootWatcher extends BaseWatcher {
  l1Bridge: L1Bridge
  l2Bridge: L2Bridge

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
    this.logger.log(
      `starting L2 TransfersCommitted event watcher for L1 bondTransferRoot tx`
    )

    try {
      await this.watch()
    } catch (err) {
      this.emit('error', err)
      this.logger.error(`watcher error:`, err.message)
    }
  }

  async stop () {
    this.l1Bridge.removeAllListeners()
    this.l2Bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async watch () {
    this.l2Bridge.on(
      this.l2Bridge.TransfersCommitted,
      this.handleTransferCommittedEvent
    )
    this.l2Bridge.on('error', err => {
      this.emit('error', err)
      this.logger.error('event watcher error:', err.message)
    })
  }

  checkTransferCommited = async (
    transferRootHash: string,
    totalAmount: number,
    chainId: string
  ) => {
    const sourceChainId = await this.l2Bridge.getChainId()
    this.logger.log(
      sourceChainId,
      `transferRootHash:`,
      chalk.bgMagenta.black(transferRootHash)
    )
    this.logger.log('chainId:', chainId)
    this.logger.log('totalAmount:', totalAmount)
    await db.transferRoots.update(transferRootHash, {
      transferRootHash,
      totalAmount,
      chainId,
      sourceChainId,
      commited: true
    })

    await this.waitTimeout(transferRootHash)

    const transferRoot: TransferRoot = await db.transferRoots.getById(
      transferRootHash
    )
    if (!transferRoot) {
      this.logger.log('no transfer root')
      return
    }

    this.logger.log('transferRoot:', transferRoot)
    const pendingTransfers: string[] = Object.values(
      transferRoot.transferHashes || []
    )
    this.logger.log('transferRootHash transferHashes:', pendingTransfers)
    if (pendingTransfers.length) {
      const tree = new MerkleTree(pendingTransfers)
      const rootHash = tree.getHexRoot()
      this.logger.log('calculated transfer root hash:', rootHash)
      if (rootHash !== transferRootHash) {
        this.logger.log('calculated transfer root hash does not match')
      }
    }

    const tx = await this.l1Bridge.bondTransferRoot(
      transferRootHash,
      chainId,
      totalAmount
    )
    tx?.wait().then(() => {
      this.emit('bondTransferRoot', {
        transferRootHash,
        chainId,
        totalAmount
      })

      db.transferRoots.update(transferRootHash, {
        bonded: true
      })
    })
    this.logger.log(
      'L1 bondTransferRoot tx',
      chalk.bgYellow.black.bold(tx.hash)
    )
  }

  handleTransferCommittedEvent = async (
    transferRootHash: string,
    _totalAmount: BigNumber,
    meta: any
  ) => {
    try {
      this.logger.log(`received L2 TransfersCommitted event`)
      const { transactionHash } = meta
      const { data } = await this.l2Bridge.getTransaction(transactionHash)
      const {
        destinationChainId: chainId
      } = await this.l2Bridge.decodeCommitTransfersData(data)
      const totalAmount = Number(formatUnits(_totalAmount.toString(), 18))
      await this.checkTransferCommited(transferRootHash, totalAmount, chainId)
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.emit('error', err)
        this.logger.error('bondTransferRoot tx error:', err.message)
      }
    }
  }

  async waitTimeout (transferRootHash: string) {
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
      const bond = await this.l1Bridge.getTransferBond(transferRootHash)
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
