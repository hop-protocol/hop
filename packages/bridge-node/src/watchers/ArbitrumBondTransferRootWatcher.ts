import '../moduleAlias'
import wait from '@authereum/utils/core/wait'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'
import { L2ArbitrumProvider } from 'src/wallets/L2ArbitrumWallet'
import { TransfersCommittedEvent } from 'src/constants'

// notes:
// - verify roots
// - watch contract on L2 bridge
// - listen to TransfersCommitted event
// - get block and check event log on L2 to verify
// - send L1 tx to bond transfer root post event

async function watcher () {
  console.log(
    'starting L2 Arbitrum TransfersCommitted event watcher for L1 bondTransferRoot tx'
  )
  const L2BlockNumber = await L2ArbitrumProvider.getBlockNumber()
  console.log('L2 Arbitrum head block number', L2BlockNumber)

  const sendL1TransferRootTx = (root: string, amount: string) => {
    return L1BridgeContract.functions.bondTransferRoot(root, amount, {
      //gasLimit: 100000
    })
  }

  const handleTransferCommittedEvent = async (
    root: string,
    amount: string,
    meta: any
  ) => {
    try {
      const { transactionHash } = meta
      console.log('received L2 Arbitrum TransfersCommittedEvent event')
      console.log('root', root)

      await wait(2 * 1000)
      const tx = await sendL1TransferRootTx(root, amount)
      console.log('L1 bondTransferRoot tx', tx.hash)
    } catch (err) {
      console.error('bondTransferRoot error', err)
    }
  }

  L2ArbitrumBridgeContract.on(
    TransfersCommittedEvent,
    handleTransferCommittedEvent
  )
}

export default watcher
