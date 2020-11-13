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
  const L2BlockNumber = await L2Provider.getBlockNumber()
  console.log('head block number', L2BlockNumber)

  const sendL1TransferRootTx = (root: string, amount: string) => {
    return L1BridgeContract.functions.bondTransferRoot(root, amount)
  }

  const recentTransferCommitEvents = await L2BridgeContract.queryFilter(
    TransfersCommittedEvent as any,
    L2BlockNumber - 10
  )
  console.log('recent events', recentTransferCommitEvents)

  const handleTransferCommittedEvent = async (root: string, amount:string, meta: any) => {
    const { transactionHash } = meta
    console.log('recieved event', root, amount, transactionHash)

    const tx = await sendL1TransferRootTx(root, amount)
    console.log('tx', tx)
  }

  L2BridgeContract.on(TransfersCommittedEvent, handleTransferCommittedEvent)
}
