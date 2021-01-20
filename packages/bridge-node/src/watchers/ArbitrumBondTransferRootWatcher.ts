import '../moduleAlias'
import wait from '@authereum/utils/core/wait'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'
import { L2ArbitrumProvider } from 'src/wallets/L2ArbitrumWallet'
import { TransfersCommittedEvent } from 'src/constants'
import { store } from 'src/store'
import chalk from 'chalk'
import Logger from 'src/logger'

const logger = new Logger('[bondTransferRootWatcher]', { color: 'cyan' })

class BondTransferRootWatcher {
  async start () {
    logger.log(
      'starting L2 Arbitrum TransfersCommitted event watcher for L1 bondTransferRoot tx'
    )

    try {
      await this.watch()
    } catch (err) {
      logger.error('watcher error:', err)
    }
  }

  async watch () {
    L2ArbitrumBridgeContract.on(
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
      logger.log('received L2 Arbitrum TransfersCommittedEvent event')
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

export default new BondTransferRootWatcher()
