import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { wait } from 'src/utils'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import db from 'src/db'
import { TransferRoot } from 'src/db/TransferRootsDb'
import chalk from 'chalk'
import Logger from 'src/logger'
import BaseWatcher from 'src/watchers/BaseWatcher'
import MerkleTree from 'src/lib/MerkleTree'

export interface Config {
  l1BridgeContract: Contract
  l2BridgeContract: Contract
  label: string
  order?: () => number
}

class BondTransferRootWatcher extends BaseWatcher {
  l1BridgeContract: Contract
  l2BridgeContract: Contract

  constructor (config: Config) {
    super({
      tag: 'bondTransferRootWatcher',
      prefix: config.label,
      logColor: 'cyan',
      order: config.order
    })
    this.l1BridgeContract = config.l1BridgeContract
    this.l2BridgeContract = config.l2BridgeContract
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
    this.l2BridgeContract.off(
      this.l2BridgeContract.filters.TransfersCommitted(),
      this.handleTransferCommittedEvent
    )
    this.started = false
    this.logger.setEnabled(false)
  }

  async watch () {
    this.l2BridgeContract
      .on(
        this.l2BridgeContract.filters.TransfersCommitted(),
        this.handleTransferCommittedEvent
      )
      .on('error', err => {
        this.emit('error', err)
        this.logger.error('event watcher error:', err.message)
      })
  }

  sendBondTransferRootTx = async (
    transferRootHash: string,
    chainId: string,
    totalAmount: number
  ) => {
    this.logger.log(`bondTransferRoot`)
    this.logger.log(
      `bondTransferRoot transferRootHash:`,
      chalk.bgMagenta.black(transferRootHash)
    )
    this.logger.log(`bondTransferRoot chainId:`, chainId)
    this.logger.log(`bondTransferRoot totalAmount:`, totalAmount)
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)

    const credit = await this.getCredit()
    const debit = await this.getDebit()
    this.logger.log(`bondTransferRoot credit:`, credit)
    this.logger.log(`bondTransferRoot debit:`, debit)
    if (credit < debit) {
      this.logger.log('not enough available credit')
    }

    return this.l1BridgeContract.bondTransferRoot(
      transferRootHash,
      chainId,
      parsedTotalAmount,
      {
        //gasLimit: 1000000
      }
    )
  }

  handleTransferCommittedEvent = async (
    transferRootHash: string,
    _totalAmount: BigNumber,
    meta: any
  ) => {
    try {
      const { transactionHash } = meta
      const sourceChainId = (
        await this.l2BridgeContract.getChainId()
      ).toString()
      this.logger.log(`received L2 TransfersCommitted event`)
      this.logger.log(
        sourceChainId,
        `transferRootHash:`,
        chalk.bgMagenta.black(transferRootHash)
      )
      await wait(2 * 1000)
      const {
        from: sender,
        data
      } = await this.l2BridgeContract.provider.getTransaction(transactionHash)
      const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
        'commitTransfers',
        data
      )
      const chainId = decoded.destinationChainId.toString()
      const totalAmount = Number(formatUnits(_totalAmount.toString(), 18))
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
        const tree = new MerkleTree(
          pendingTransfers.map(x => Buffer.from(x.replace('0x', ''), 'hex'))
        )
        const rootHash = tree.getHexRoot()
        this.logger.log('calculated transfer root hash:', rootHash)
        if (rootHash !== transferRootHash) {
          this.logger.log('calculated transfer root hash does not match')
        }
      }

      const tx = await this.sendBondTransferRootTx(
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
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.emit('error', err)
        this.logger.error('bondTransferRoot tx error:', err.message)
      }
    }
  }

  async getCredit () {
    const bonder = await this.getBonderAddress()
    const credit = (await this.l1BridgeContract.getCredit(bonder)).toString()
    return Number(formatUnits(credit, 18))
  }

  async getDebit () {
    const bonder = await this.getBonderAddress()
    const debit = (
      await this.l1BridgeContract.getDebitAndAdditionalDebit(bonder)
    ).toString()
    return Number(formatUnits(debit, 18))
  }

  async getBonderAddress () {
    return this.l1BridgeContract.signer.getAddress()
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
      const bond = await this.l1BridgeContract.transferBonds(transferRootHash)
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
