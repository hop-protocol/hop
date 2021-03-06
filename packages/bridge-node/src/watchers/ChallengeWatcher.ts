import '../moduleAlias'
import { Contract } from 'ethers'
import BaseWatcher from 'src/watchers/BaseWatcher'

// notes:
// - challenge watcher
// - looks for invalid transfer root
// - listens for BondTransferRoot event on L1
// - if TransferCommitted event not exist then mark as fraud
// - TransferCommitted should be emitted on L2 after BondTransferRoot on L1

export interface Config {
  l1BridgeContract: Contract
  l2BridgeContract: Contract
  label: string
}

// TODO: fix
class ChallengeWatcher extends BaseWatcher {
  l1BridgeContract: Contract
  l2BridgeContract: Contract

  constructor (config: Config) {
    super({
      tag: 'challengeWatcher',
      prefix: config.label,
      logColor: 'red'
    })
    this.l1BridgeContract = config.l1BridgeContract
    this.l2BridgeContract = config.l2BridgeContract
  }

  async start () {
    this.started = true
    this.logger.log('starting L1 BondTransferRoot event watcher')
    try {
      await this.watch()
    } catch (err) {
      this.emit('error', err)
      this.logger.error('watcher error:', err.message)
    }
  }

  async stop () {
    this.l1BridgeContract.off(
      this.l2BridgeContract.filters.TransferRootBonded(),
      this.handleBondTransferEvent
    )
    this.started = false
  }

  handleBondTransferEvent = async (
    transferRootHash: string,
    totalAmount: string,
    meta: any
  ) => {
    const { transactionHash } = meta
    this.logger.log('received L1 BondTransferRoot event')
    this.logger.log('transferRootHash:', transferRootHash)
    this.logger.log('totalAmount:', totalAmount.toString())
    this.logger.log('event tx hash:', transactionHash)

    const l2BlockNumber = await this.l2BridgeContract.provider.getBlockNumber()
    const recentTransferCommitEvents = await this.l2BridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransfersCommitted(),
      l2BlockNumber - 100
    )
    this.logger.log('recent events:', recentTransferCommitEvents)

    let found = false
    for (let i = 0; i < recentTransferCommitEvents.length; i++) {
      const { args } = recentTransferCommitEvents[i]
      const root = args[0]
      const amount = args[1]

      if (
        root == transferRootHash &&
        totalAmount.toString() === amount.toString()
      ) {
        found = true
      }

      break
    }

    if (!found) {
      this.logger.warn('Transfer root not committed!')
    }
  }

  async watch () {
    this.l1BridgeContract
      .on(
        this.l2BridgeContract.filters.TransferRootBonded(),
        this.handleBondTransferEvent
      )
      .on('error', err => {
        this.emit('error', err)
        this.logger.error('event watcher error:', err.message)
      })
  }
}

export default ChallengeWatcher
