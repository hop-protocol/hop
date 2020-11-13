import L1BridgeContract from '../contracts/L1BridgeContract'
import L2BridgeContract from '../contracts/L2BridgeContract'
import { L2Provider } from '../wallets/L2Wallet'
import { TransfersCommittedEvent } from '../constants'

// notes:
// - verify roots
// - watch contract on L2 bridge
// - listen to TransfersCommitted event
// - get block and check event log on L2 to verify
// - send L1 tx to bond transfer root post event

async function main () {
  const L2BlockNumber = await L2Provider.getBlockNumber()
  console.log('head block number', L2BlockNumber)

  const sendL1TransferRootTx = (root, amount) => {
    return L1BridgeContract.functions.bondTransferRoot(root, amount)
  }

  const recentTransferCommitEvents = await L2BridgeContract.queryFilter(
    TransfersCommittedEvent,
    L2BlockNumber - 10
  )
  console.log('recent events', recentTransferCommitEvents)

  const handleTransferCommittedEvent = (root, amount, meta) => {
    const { transactionHash } = meta
    console.log('recieved event', root, amount, transactionHash)

    sendL1TransferRootTx(root, amount)
  }

  L2BridgeContract.on(TransfersCommittedEvent, handleTransferCommittedEvent)
}

main()
