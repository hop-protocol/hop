import '../moduleAlias'
import assert from 'assert'
import * as ethers from 'ethers'
import wait from '@authereum/utils/core/wait'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'
import chalk from 'chalk'
import Logger from 'src/logger'

const logger = new Logger('[commitTransferWatcher]', { color: 'yellow' })

class CommitTransfersWatcher {
  async start () {
    logger.log('starting L2 Arbitrum commitTransfers scheduler')
    try {
      await this.watch()
    } catch (err) {
      logger.error('watcher error:', err)
    }
  }

  sendTx = async () => {
    return L2ArbitrumBridgeContract.commitTransfers()
  }

  async check () {
    try {
      const pendingTransfer = await L2ArbitrumBridgeContract.pendingTransfers(0)
      // check if pending transfers exist
      if (!pendingTransfer) {
        return
      }
    } catch (err) {
      // noop
      return
    }

    const tx = await this.sendTx()
    logger.log('L2 Arbitrum commitTransfers tx:', chalk.yellow(tx.hash))
    const receipt = await tx.wait()
    assert(receipt.status === 1)
  }

  async watch () {
    while (true) {
      await wait(5 * 1000)
      try {
        await this.check()
      } catch (err) {
        logger.error('commitTransfers tx error:', err.message)
        await wait(20 * 1000)
      }
    }
  }
}

export default new CommitTransfersWatcher()
