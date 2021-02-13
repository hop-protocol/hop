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
  l1BridgeContract: any
  l2BridgeContract: any
  l2Provider: any
  label: string
}

// TODO: fix
class ChallengeWatcher extends BaseWatcher {
  l1BridgeContract: any
  l2BridgeContract: any
  l2Provider: any
  label: string

  constructor (config: Config) {
    super({
      label: 'challengeWatcher',
      logColor: 'red'
    })
    this.l1BridgeContract = config.l1BridgeContract
    this.l2BridgeContract = config.l2BridgeContract
    this.l2Provider = config.l2Provider
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

      const l2BlockNumber = await this.l2Provider.getBlockNumber()
      const recentTransferCommitEvents = await this.l2BridgeContract.queryFilter(
        TransfersCommittedEvent as any,
        l2BlockNumber - 100
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

    this.l1BridgeContract
      .on(BondTransferRootEvent, handleBondTransferEvent)
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })

    //const l2BlockNumber = await this.l2Provider.getBlockNumber()
    //const recentTransferCommitEvents = await this.l2BridgeContract.queryFilter(
    //l2BridgeContract.filters.TransfersCommitted(),
    //l2BlockNumber - 100
    //)
    //this.logger.log('recent events:', recentTransferCommitEvents)
  }
}

export default ChallengeWatcher
