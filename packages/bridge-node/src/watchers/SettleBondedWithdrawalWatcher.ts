import '../moduleAlias'
import { BondTransferRootEvent } from 'src/constants'
import { store } from 'src/store'
import chalk from 'chalk'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  L1BridgeContract: any
  L2BridgeContract: any
  label: string
}

class SettleBondedWithdrawalWatcher extends BaseWatcher {
  L1BridgeContract: any
  L2BridgeContract: any
  label: string

  constructor (config: Config) {
    super({
      label: 'settleBondedWithdrawalWatcher',
      logColor: 'magenta'
    })
    this.L1BridgeContract = config.L1BridgeContract
    this.L2BridgeContract = config.L2BridgeContract
    this.label = config.label
  }

  async start () {
    this.logger.log('starting L1 BondTransferRoot event watcher')
    try {
      await this.watch()
    } catch (err) {
      this.logger.error('watcher error:', err)
    }
  }

  sendTx = async (
    chainId: string,
    transferHash: string,
    rootHash: string,
    proof: string[]
  ) => {
    this.logger.log('settleBondedWithdrawal params:')
    this.logger.log('chainId:', chainId)
    this.logger.log('transferHash:', transferHash)
    this.logger.log('rootHash:', rootHash)
    this.logger.log('proof:', proof)
    if (chainId === '1' || chainId === '42') {
      return this.L1BridgeContract.settleBondedWithdrawal(
        transferHash,
        rootHash,
        proof
      )
    } else {
      return this.L2BridgeContract.settleBondedWithdrawal(
        transferHash,
        rootHash,
        proof
      )
    }
  }

  handleBondTransferEvent = async (
    bondRoot: string,
    bondAmount: string,
    meta: any
  ) => {
    const { transactionHash } = meta
    this.logger.log(
      'received L1 BondTransferRoot event:',
      bondRoot,
      bondAmount.toString(),
      transactionHash
    )

    const proof = []
    const transfers: any[] = Object.values(store.transferHashes)
    for (let item of transfers) {
      try {
        const { transferHash, chainId } = item
        const tx = await this.sendTx(chainId, transferHash, bondRoot, proof)
        this.logger.log(
          `settleBondedWithdrawal on chain ${chainId} tx: ${chalk.yellow(
            tx.hash
          )}`
        )
        delete store.transferHashes[transferHash]
      } catch (err) {
        this.logger.error('settleBondedWithdrawal tx error:', err.message)
      }
    }
  }

  async watch () {
    this.L1BridgeContract.on(
      BondTransferRootEvent,
      this.handleBondTransferEvent
    ).on('error', err => {
      this.logger.error('event watcher error:', err.message)
    })
  }
}

export default SettleBondedWithdrawalWatcher
