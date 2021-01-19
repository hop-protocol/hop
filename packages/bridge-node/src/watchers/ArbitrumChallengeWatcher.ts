import '../moduleAlias'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import { BondTransferRootEvent, TransfersCommittedEvent } from 'src/constants'
import { L2ArbitrumProvider } from 'src/wallets/L2ArbitrumWallet'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'

// notes:
// - challenge watcher
// - looks for invalid transfer root
// - listens for BondTransferRoot event on L1
// - if TransferCommitted event not exist then mark as fraud
// - TransferCommitted should be emitted on L2 after BondTransferRoot on L1

// TODO: fix
class ChallengeWatcher {
  async start () {
    console.log('starting L1 BondTransferRoot event watcher')
    try {
      await this.watch()
    } catch (err) {
      console.error(err)
    }
  }

  async watch () {
    const handleBondTransferEvent = async (
      bondRoot: string,
      bondAmount: string,
      meta: any
    ) => {
      const { transactionHash } = meta
      console.log(
        'received L1 BondTransferRoot event',
        bondRoot,
        bondAmount.toString(),
        transactionHash
      )

      const L2BlockNumber = await L2ArbitrumProvider.getBlockNumber()
      const recentTransferCommitEvents = await L2ArbitrumBridgeContract.queryFilter(
        TransfersCommittedEvent as any,
        L2BlockNumber - 100
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

    //const L2BlockNumber = await L2ArbitrumProvider.getBlockNumber()
    //const recentTransferCommitEvents = await L2ArbitrumBridgeContract.queryFilter(
    //L2ArbitrumBridgeContract.filters.TransfersCommitted(),
    //L2BlockNumber - 100
    //)
    //console.log('recent events', recentTransferCommitEvents)
  }
}

export default new ChallengeWatcher()
