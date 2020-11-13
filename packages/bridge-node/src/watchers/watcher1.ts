import '../moduleAlias'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import L2BridgeContract from 'src/contracts/L2BridgeContract'
import { L2Provider } from 'src/wallets/L2Wallet'
import { TransfersCommittedEvent } from 'src/constants'

// notes:
// - verify roots
// - watch contract on L2 bridge
// - listen to TransfersCommitted event
// - get block and check event log on L2 to verify
// - send L1 tx to bond transfer root post event

export default async function watcher1 () {
  console.log(
    'starting L2 TransfersCommitted event watcher for L1 bondTransferRoot tx'
  )
  const L2BlockNumber = await L2Provider.getBlockNumber()
  console.log('L2 head block number', L2BlockNumber)

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
      console.log('received L2 TransfersCommittedEvent event')
      console.log('root', root)

      const tx = await sendL1TransferRootTx(root, amount)
      console.log('L1 bondTransferRoot tx', tx.hash)
    } catch (err) {
      console.error('bondTransferRoot error', err)
    }
  }

  L2BridgeContract.on(TransfersCommittedEvent, handleTransferCommittedEvent)
}
