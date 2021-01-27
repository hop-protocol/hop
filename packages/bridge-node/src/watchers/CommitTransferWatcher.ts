import '../moduleAlias'
import assert from 'assert'
import * as ethers from 'ethers'
import wait from '@authereum/utils/core/wait'
import { TransferSentEvent } from 'src/constants'
import chalk from 'chalk'
import Logger from 'src/logger'
import { throttle } from 'src/utils'

const logger = new Logger('[commitTransferWatcher]', { color: 'yellow' })

export interface Config {
  L2BridgeContract: any
  label: string
}

class CommitTransfersWatcher {
  L2BridgeContract: any
  label: string

  constructor(config: Config) {
    this.L2BridgeContract = config.L2BridgeContract
    this.label = config.label
  }

  async start () {
    logger.log(`starting L2 ${this.label} commitTransfers scheduler`)
    try {
      await this.watch()
    } catch (err) {
      logger.error('watcher error:', err)
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
    logger.log(`L2 ${this.label} commitTransfers tx:`, chalk.yellow(tx.hash))
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
      logger.error('commitTransfers tx error:', err.message)
    }
  }

  async watch () {
    this.L2BridgeContract.on(TransferSentEvent, this.handleTransferSentEvent)

    while (true) {
      try {
        await this.check()
        await wait(10 * 1000)
      } catch (err) {
        logger.error('commitTransfers tx error:', err.message)
        await wait(20 * 1000)
      }
    }
  }
}

export default CommitTransfersWatcher
