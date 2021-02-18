import '../moduleAlias'
import { TransfersCommittedEvent } from 'src/constants'
import { wait } from 'src/utils'
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
    this.logger.log(
      `starting L2 ${this.label} TransfersCommitted event watcher for L1 bondTransferRoot tx`
    )

    try {
      await this.watch()
    } catch (err) {
      this.logger.error('watcher error:', err.message)
    }
  }

  async watch () {
    this.l2BridgeContract
      .on(TransfersCommittedEvent, this.handleTransferCommittedEvent)
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })
  }

  sendL1TransferRootTx = (
    transferRootHash: string,
    chainIds: string[],
    chainAmounts: string[]
  ) => {
    return this.l1BridgeContract.bondTransferRoot(
      transferRootHash,
      chainIds,
      chainAmounts,
      {
        //gasLimit: 100000
      }
    )
  }

  handleTransferCommittedEvent = async (
    a: any,
    b: any,
    c: any,
    d: any,
    meta: any
  ) => {
    let transferRootHash: string
    let chainIds: string[]
    let chainAmounts: string[]
    if (meta) {
      transferRootHash = a
      chainIds = c
      chainAmounts = d
    } else {
      transferRootHash = a
      chainIds = b
      chainAmounts = c
      meta = d
    }
    try {
      const { transactionHash } = meta
      this.logger.log(`received L2 ${this.label} TransfersCommittedEvent event`)
      this.logger.log('transferRootHash', transferRootHash)
      this.logger.log(
        'chainIds',
        chainIds.map(x => x.toString())
      )
      this.logger.log(
        'chainAmounts',
        chainAmounts.map(x => x.toString())
      )
      store.transferRoots[transferRootHash] = {
        transferRootHash,
        chainIds,
        chainAmounts
      }

      await this.waitTimeout(transferRootHash)
      const tx = await this.sendL1TransferRootTx(
        transferRootHash,
        chainIds,
        chainAmounts
      )
      this.logger.log(
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
