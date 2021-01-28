import '../moduleAlias'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import { TransfersCommittedEvent } from 'src/constants'
import { wait } from 'src/utils'
import { store } from 'src/store'
import chalk from 'chalk'
import Logger from 'src/logger'
import BaseWatcher from 'src/watchers/BaseWatcher'
//import eventPoller from 'src/utils/eventPoller'

export interface Config {
  L2BridgeContract: any
  label: string
}

class BondTransferRootWatcher extends BaseWatcher {
  L2BridgeContract: any
  label: string

  constructor (config: Config) {
    super({
      label: 'bondTransferRootWatcher',
      logColor: 'cyan'
    })
    this.L2BridgeContract = config.L2BridgeContract
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
    this.L2BridgeContract.on(
      TransfersCommittedEvent,
      this.handleTransferCommittedEvent
    )
    //eventPoller(this.L2BridgeContract, this.L2Provider, TransfersCommittedEvent, this.handleTransferCommittedEvent)
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

      await wait(2 * 1000)
      const tx = await this.sendL1TransferRootTx(
        transferRootHash,
        chainIds,
        chainAmounts
      )
      this.logger.log('L1 bondTransferRoot tx', chalk.yellow(tx.hash))
    } catch (err) {
      this.logger.error('bondTransferRoot tx error:', err.message)
    }
  }
}

export default BondTransferRootWatcher
