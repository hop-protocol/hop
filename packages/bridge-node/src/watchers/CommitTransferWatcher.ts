import '../moduleAlias'
import assert from 'assert'
import { wait } from 'src/utils'
import { TransferSentEvent } from 'src/constants'
import chalk from 'chalk'
import { throttle } from 'src/utils'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  L2BridgeContract: any
  label: string
}

class CommitTransfersWatcher extends BaseWatcher {
  L2BridgeContract: any
  label: string

  constructor (config: Config) {
    super({
      label: 'commitTransferWatcher',
      logColor: 'yellow'
    })
    this.L2BridgeContract = config.L2BridgeContract
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
    return this.L2BridgeContract.commitTransfers()
  }

  check = throttle(async () => {
    try {
      const pendingTransfer = await this.L2BridgeContract.pendingTransfers(0)
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
    this.L2BridgeContract.on(TransferSentEvent, this.handleTransferSentEvent)

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
