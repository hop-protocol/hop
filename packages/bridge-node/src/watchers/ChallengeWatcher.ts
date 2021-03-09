import '../moduleAlias'
import { Contract } from 'ethers'
import BaseWatcher from './base/BaseWatcher'
import L1Bridge from './base/L1Bridge'
import L2Bridge from './base/L2Bridge'

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
  l1Bridge: L1Bridge
  l2Bridge: L2Bridge

  constructor (config: Config) {
    super({
      tag: 'challengeWatcher',
      prefix: config.label,
      logColor: 'red'
    })
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    this.l2Bridge = new L2Bridge(config.l2BridgeContract)
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
    this.l1Bridge.removeAllListeners()
    this.l2Bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
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

    const blockNumber = await this.l2Bridge.getBlockNumber()
    const recentTransferCommitEvents = await this.l2Bridge.getTransfersCommitedEvents(
      blockNumber - 100,
      blockNumber
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
    this.l1Bridge
      .on(this.l1Bridge.TransferRootBonded, this.handleBondTransferEvent)
      .on('error', err => {
        this.emit('error', err)
        this.logger.error('event watcher error:', err.message)
      })
  }
}

export default ChallengeWatcher
