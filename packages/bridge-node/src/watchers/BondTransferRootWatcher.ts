import '../moduleAlias'
import { wait } from 'src/utils'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { store } from 'src/store'
import chalk from 'chalk'
import Logger from 'src/logger'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  l1BridgeContract: any
  l2BridgeContract: any
  label: string
  order?: () => number
}

class BondTransferRootWatcher extends BaseWatcher {
  l1BridgeContract: any
  l2BridgeContract: any
  label: string

  constructor (config: Config) {
    super({
      label: 'bondTransferRootWatcher',
      logColor: 'cyan',
      order: config.order
    })
    this.l1BridgeContract = config.l1BridgeContract
    this.l2BridgeContract = config.l2BridgeContract
    this.label = config.label
  }

  async start () {
    this.started = true
    this.logger.log(
      `starting L2 ${this.label} TransfersCommitted event watcher for L1 bondTransferRoot tx`
    )

    try {
      await this.watch()
    } catch (err) {
      this.logger.error(`${this.label} watcher error:`, err.message)
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
        this.logger.error('event watcher error:', err.message)
      })
  }

  sendL1TransferRootTx = (
    transferRootHash: string,
    chainId: string,
    totalAmount: number
  ) => {
    this.logger.log(`${this.label} bondTransferRoot`)
    this.logger.log(
      `${this.label} bondTransferRoot transferRootHash:`,
      transferRootHash
    )
    this.logger.log(`${this.label} bondTransferRoot chainId:`, chainId)
    this.logger.log(`${this.label} bondTransferRoot totalAmount:`, totalAmount)

    return this.l1BridgeContract.bondTransferRoot(
      transferRootHash,
      chainId,
      parseUnits(totalAmount.toString(), 18),
      {
        //gasLimit: 100000
      }
    )
  }

  handleTransferCommittedEvent = async (
    transferRootHash: any,
    _totalAmount: any,
    meta: any
  ) => {
    try {
      const { transactionHash } = meta
      this.logger.log(`${this.label} received L2 TransfersCommittedEvent event`)
      this.logger.log(`${this.label} transferRootHash`, transferRootHash)
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
      this.logger.log(this.label, 'chainId:', chainId)
      this.logger.log(this.label, 'totalAmount:', totalAmount)
      store.transferRoots[transferRootHash] = {
        transferRootHash,
        totalAmount,
        chainId
      }

      await this.waitTimeout(transferRootHash)
      const tx = await this.sendL1TransferRootTx(
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
      })
      this.logger.log(
        this.label,
        'L1 bondTransferRoot tx',
        chalk.bgYellow.black.bold(tx.hash)
      )
    } catch (err) {
      if (err.message !== 'cancelled') {
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
    this.logger.debug(`transfer root hash already bonded ${transferRootHash}`)
    throw new Error('cancelled')
  }
}

export default BondTransferRootWatcher
