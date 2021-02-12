import '../moduleAlias'
import { BondTransferRootEvent, TransfersCommittedEvent } from 'src/constants'
import BaseWatcher from 'src/watchers/BaseWatcher'

// notes:
// - challenge watcher
// - looks for invalid transfer root
// - listens for BondTransferRoot event on L1
// - if TransferCommitted event not exist then mark as fraud
// - TransferCommitted should be emitted on L2 after BondTransferRoot on L1

export interface Config {
  L1BridgeContract: any
  L2BridgeContract: any
  L2Provider: any
  label: string
}

// TODO: fix
class ChallengeWatcher extends BaseWatcher {
  L1BridgeContract: any
  L2BridgeContract: any
  L2Provider: any
  label: string

  constructor (config: Config) {
    super({
      label: 'challengeWatcher',
      logColor: 'red'
    })
    this.L1BridgeContract = config.L1BridgeContract
    this.L2BridgeContract = config.L2BridgeContract
    this.L2Provider = config.L2Provider
    this.label = config.label
  }

  async start () {
    this.logger.log('starting L1 BondTransferRoot event watcher')
    try {
      await this.watch()
    } catch (err) {
      this.logger.error('watcher error:', err.message)
    }
  }

  async watch () {
    const handleBondTransferEvent = async (
      bondRoot: string,
      bondAmount: string,
      meta: any
    ) => {
      const { transactionHash } = meta
      this.logger.log(
        'received L1 BondTransferRoot event',
        bondRoot,
        bondAmount.toString(),
        transactionHash
      )

      const L2BlockNumber = await this.L2Provider.getBlockNumber()
      const recentTransferCommitEvents = await this.L2BridgeContract.queryFilter(
        TransfersCommittedEvent as any,
        L2BlockNumber - 100
      )
      this.logger.log('recent events:', recentTransferCommitEvents)

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
        this.logger.warn('Transfer root not committed!')
      }
    }

    this.L1BridgeContract.on(BondTransferRootEvent, handleBondTransferEvent).on(
      'error',
      err => {
        this.logger.error('event watcher error:', err.message)
      }
    )

    //const L2BlockNumber = await this.L2Provider.getBlockNumber()
    //const recentTransferCommitEvents = await this.L2BridgeContract.queryFilter(
    //L2BridgeContract.filters.TransfersCommitted(),
    //L2BlockNumber - 100
    //)
    //this.logger.log('recent events:', recentTransferCommitEvents)
  }
}

export default ChallengeWatcher
