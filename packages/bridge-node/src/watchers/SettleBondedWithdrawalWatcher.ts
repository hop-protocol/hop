import '../moduleAlias'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import { BondTransferRootEvent, TransfersCommittedEvent } from 'src/constants'
import { store } from 'src/store'
import chalk from 'chalk'
import Logger from 'src/logger'

const logger = new Logger('[settleBondedWithdrawalWatcher]', {
  color: 'magenta'
})

export interface Config {
  L2BridgeContract: any
  label: string
}

class SettleBondedWithdrawalWatcher {
  L2BridgeContract: any
  label: string

  constructor(config: Config) {
    this.L2BridgeContract = config.L2BridgeContract
    this.label = config.label
  }

  async start () {
    logger.log('starting L1 BondTransferRoot event watcher')
    try {
      await this.watch()
    } catch (err) {
      logger.error('watcher error:', err)
    }
  }

  sendTx = async (
    chainId: string,
    transferHash: string,
    rootHash: string,
    proof: string[]
  ) => {
    logger.log('settleBondedWithdrawal params:')
    logger.log('chainId:', chainId)
    logger.log('transferHash:', transferHash)
    logger.log('rootHash:', rootHash)
    logger.log('proof:', proof)
    if (chainId === '1' || chainId === '42') {
      return L1BridgeContract.settleBondedWithdrawal(
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
    logger.log(
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
        logger.log(
          `settleBondedWithdrawal on chain ${chainId} tx: ${chalk.yellow(
            tx.hash
          )}`
        )
        delete store.transferHashes[transferHash]
      } catch (err) {
        logger.error('settleBondedWithdrawal tx error:', err)
      }
    }
  }

  async watch () {
    L1BridgeContract.on(BondTransferRootEvent, this.handleBondTransferEvent)
  }
}

export default SettleBondedWithdrawalWatcher
