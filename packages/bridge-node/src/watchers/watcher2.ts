import '../moduleAlias'
import assert from 'assert'
import * as ethers from 'ethers'
import wait from '@authereum/utils/core/wait'
import L2BridgeContract from 'src/contracts/L2BridgeContract'

// notes:
// - invoke commitTransfers at every interval

export default async function watcher2 () {
  console.log('starting L2 commitTransfers scheduler')
  const sendTx = async () => {
    return L2BridgeContract.functions.commitTransfers()
  }

  while (true) {
    try {
      const pendingAmount = await L2BridgeContract.functions.pendingAmount()
      const parsedPendingAmount = Number(
        ethers.utils.formatUnits(pendingAmount.toString(), 18)
      )

      if (parsedPendingAmount > 0) {
        console.log('L1 pending transfers amount', parsedPendingAmount)
        const tx = await sendTx()
        console.log('L2 commitTransfers tx', tx.hash)
        const receipt = await tx.wait()
        assert(receipt.status === 1)
      }
    } catch (err) {
      console.error('commitTransfers error', err)
    }

    await wait(5 * 1000)
  }
}
