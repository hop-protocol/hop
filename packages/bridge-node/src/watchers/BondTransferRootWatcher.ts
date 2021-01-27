import '../moduleAlias'
import wait from '@authereum/utils/core/wait'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import { TransfersCommittedEvent } from 'src/constants'
import { store } from 'src/store'
import chalk from 'chalk'
import Logger from 'src/logger'

const logger = new Logger('[bondTransferRootWatcher]', { color: 'cyan' })

export interface Config {
  L2BridgeContract: any
  label: string
}

class BondTransferRootWatcher {
  L2BridgeContract: any
  label: string

  constructor(config: Config) {
    this.L2BridgeContract = config.L2BridgeContract
    this.label = config.label
  }

  async start () {
    logger.log(
      `starting L2 ${this.label} TransfersCommitted event watcher for L1 bondTransferRoot tx`
    )

    try {
      await this.watch()
    } catch (err) {
      logger.error('watcher error:', err)
    }
  }

  async watch () {
    this.L2BridgeContract.on(
      TransfersCommittedEvent,
      this.handleTransferCommittedEvent
    )
  }

  sendL1TransferRootTx = (
    transferRootHash: string,
    chainIds: string[],
    chainAmounts: string[]
  ) => {
    return L1BridgeContract.bondTransferRoot(
      transferRootHash,
      chainIds,
      chainAmounts,
      {
        //gasLimit: 100000
      }
    )
  }

  handleTransferCommittedEvent = async (
    transferRootHash: string,
    amountHash: string,
    chainIds: string[],
    chainAmounts: string[],
    meta: any
  ) => {
    try {
      const { transactionHash } = meta
      logger.log(`received L2 ${this.label} TransfersCommittedEvent event`)
      logger.log('transferRootHash', transferRootHash)
      logger.log(
        'chainIds',
        chainIds.map(x => x.toString())
      )
      logger.log(
        'chainAmounts',
        chainAmounts.map(x => x.toString())
      )
      store.transferRoots[transferRootHash] = {
        transferRootHash,
        chainIds,
        chainAmounts
      }

      await wait(2 * 1000)
      const tx = await this.sendL1TransferRootTx(
        transferRootHash,
        chainIds,
        chainAmounts
      )
      logger.log('L1 bondTransferRoot tx', chalk.yellow(tx.hash))
    } catch (err) {
      logger.error('bondTransferRoot tx error:', err)
    }
  }
}

export default BondTransferRootWatcher
