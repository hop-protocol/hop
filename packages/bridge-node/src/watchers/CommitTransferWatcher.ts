import '../moduleAlias'
import assert from 'assert'
import chalk from 'chalk'
import { wait } from 'src/utils'
import { TransferSentEvent } from 'src/constants'
import { throttle } from 'src/utils'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  l2BridgeContract: any
  label: string
}

class CommitTransfersWatcher extends BaseWatcher {
  l2BridgeContract: any
  label: string

  constructor (config: Config) {
    super({
      label: 'commitTransferWatcher',
      logColor: 'yellow'
    })
    this.l2BridgeContract = config.l2BridgeContract
    this.label = config.label
  }

  async start () {
    this.logger.log(`starting L2 ${this.label} commitTransfers scheduler`)
    try {
      await this.watch()
    } catch (err) {
      this.logger.error('watcher error:', err)
    }
  }

  sendTx = async () => {
    return this.l2BridgeContract.commitTransfers()
  }

  check = throttle(async () => {
    try {
      const pendingTransfer = await this.l2BridgeContract.pendingTransfers(0)
      // check if pending transfers exist
      if (!pendingTransfer) {
        return
      }
    } catch (err) {
      // noop
      return
    }

    const tx = await this.sendTx()
    this.logger.log(
      `L2 ${this.label} commitTransfers tx:`,
      chalk.yellow(tx.hash)
    )
    const receipt = await tx.wait()
    assert(receipt.status === 1)
  }, 15 * 1000)

  handleTransferSentEvent = async (
    transferHash: string,
    recipient: string,
    amount: string,
    transferNonce: string,
    relayerFee: string,
    meta: any
  ) => {
    try {
      await this.check()
    } catch (err) {
      this.logger.error('commitTransfers tx error:', err.message)
    }
  }

  async watch () {
    this.l2BridgeContract
      .on(TransferSentEvent, this.handleTransferSentEvent)
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })

    while (true) {
      try {
        await this.check()
        await wait(10 * 1000)
      } catch (err) {
        this.logger.error('commitTransfers tx error:', err.message)
        await wait(20 * 1000)
      }
    }
  }
}

export default CommitTransfersWatcher
