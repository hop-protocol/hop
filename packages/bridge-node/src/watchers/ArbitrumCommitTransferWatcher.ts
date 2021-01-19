import '../moduleAlias'
import assert from 'assert'
import * as ethers from 'ethers'
import wait from '@authereum/utils/core/wait'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'

class CommitTransfersWatcher {
  async start () {
    console.log('starting L2 Arbitrum commitTransfers scheduler')
    try {
      await this.watch()
    } catch (err) {
      console.error(err)
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
    console.log('L2 Arbitrum commitTransfers tx:', tx.hash)
    const receipt = await tx.wait()
    assert(receipt.status === 1)
  }

  async watch () {
    while (true) {
      await wait(5 * 1000)
      try {
        await this.check()
      } catch (err) {
        console.error('commitTransfers error', err.message)
        await wait(20 * 1000)
      }
    }
  }
}

export default new CommitTransfersWatcher()
