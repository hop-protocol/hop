import wait from '@authereum/utils/core/wait'
import L2BridgeContract from '../contracts/L2BridgeContract'

// notes:
// - invoke commitTransfers at every interval

async function main () {
  const sendTx = async () => {
    return L2BridgeContract.functions.commitTransfers()
  }

  while (true) {
    try {
      const tx = await sendTx()
      console.log('commitTransfers tx', tx)
    } catch (err) {
      console.error('commitTransfers error', err)
    }

    await wait(10e3)
  }
}

main()
