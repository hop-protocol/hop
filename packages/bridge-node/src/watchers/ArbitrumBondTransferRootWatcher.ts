import '../moduleAlias'
import wait from '@authereum/utils/core/wait'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'
import { L2ArbitrumProvider } from 'src/wallets/L2ArbitrumWallet'
import { TransfersCommittedEvent } from 'src/constants'
import { store } from 'src/store'

class BondTransferRootWatcher {
  async start () {
    console.log(
      'starting L2 Arbitrum TransfersCommitted event watcher for L1 bondTransferRoot tx'
    )

    try {
      await this.watch()
    } catch (err) {
      console.error('bondTransferRootWatcher error', err)
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
      console.log('received L2 Arbitrum TransfersCommittedEvent event')
      console.log('transferRootHash', transferRootHash)
      console.log(
        'chainIds',
        chainIds.map(x => x.toString())
      )
      console.log(
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
      console.log('L1 bondTransferRoot tx', tx.hash)
    } catch (err) {
      console.error('bondTransferRoot error', err)
    }
  }
}

export default new BondTransferRootWatcher()
