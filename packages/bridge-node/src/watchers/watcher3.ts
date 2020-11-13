import L1BridgeContract from 'src/contracts/L1BridgeContract'
import { BondTransferRootEvent, TransfersCommittedEvent } from 'src/constants'
import { L2Provider } from 'src/wallets/L2Wallet'
import L2BridgeContract from 'src/contracts/L2BridgeContract'

// notes:
// - challenge watcher
// - looks for invalid transfer root
// - listens for BondTransferRoot event on L1
// - if TransferCommitted event not exist then mark as fraud
// - TransferCommitted should be emitted on L2 after BondTransferRoot on L1

export default async function watcher3 () {
  const handleBondTransferEvent = async (bondRoot: string, bondAmount: string, meta: any) => {
    const { transactionHash } = meta
    console.log('recieved event', bondRoot, bondAmount, transactionHash)

    const L2BlockNumber = await L2Provider.getBlockNumber()
    const recentTransferCommitEvents = await L2BridgeContract.queryFilter(
      TransfersCommittedEvent as any,
      L2BlockNumber - 10
    )
    console.log('recent events', recentTransferCommitEvents)

    let found = false
    for (let i = 0; i < recentTransferCommitEvents.length; i++) {
      const { args } = recentTransferCommitEvents[i]
      const root = args[0]
      const amount = args[1]

      if (root == bondRoot && bondAmount.toString() === amount.toString()) {
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
