import L1BridgeContract from '../contracts/L1BridgeContract'
import { BondTransferRootEvent, TransfersCommittedEvent } from '../constants'
import { L2Provider } from '../wallets/L2Wallet'

// notes:
// - challenge watcher
// - looks for invalid transfer root
// - listens for BondTransferRoot event on L1
// - if TransferCommitted event not exist then mark as fraud
// - TransferCommitted should be emitted on L2 after BondTransferRoot on L1

async function main () {
  const handleBondTransferEvent = async (bondRoot, bondAmount, meta) => {
    const { transactionHash } = meta
    console.log('recieved event', bondRoot, bondAmount, transactionHash)

    const L2BlockNumber = await L2Provider.getBlockNumber()
    const recentTransferCommitEvents = await L2BridgeContract.queryFilter(
      TransfersCommittedEvent,
      L2BlockNumber - 10
    )
    console.log('recent events', recentTransferCommitEvents)

    let found = false
    for (let i = 0; i < recentTransferCommitEvents.length; i++) {
      const event = recentTransferCommitEvents[i]
      const root = args[0]
      const amount = args[1]

      if (root == bondRoot) {
        found = true
      }

      break
    }

    if (!found) {
      console.warn('Transfer root not committed!')
    }
  }

  L1BridgeContract.on(BondTransferRootEvent, handleBondTransferEvent)
}

main()
