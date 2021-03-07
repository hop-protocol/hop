import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { wait } from 'src/utils'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import db from 'src/db'
import chalk from 'chalk'
import Logger from 'src/logger'
import BaseWatcher from 'src/watchers/BaseWatcher'

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

  sendBondTransferRootTx = (
    transferRootHash: string,
    chainId: string,
    totalAmount: number
  ) => {
    this.logger.log(`bondTransferRoot`)
    this.logger.log(`bondTransferRoot transferRootHash:`, transferRootHash)
    this.logger.log(`bondTransferRoot chainId:`, chainId)
    this.logger.log(`bondTransferRoot totalAmount:`, totalAmount)
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    return this.l1BridgeContract.bondTransferRoot(
      transferRootHash,
      chainId,
      parsedTotalAmount,
      {
        //gasLimit: 100000
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
      this.logger.log(`received L2 TransfersCommittedEvent event`)
      this.logger.log(`transferRootHash:`, transferRootHash)
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
      const sourceChainId = (
        await this.l2BridgeContract.getChainId()
      ).toString()
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
