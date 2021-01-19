import '../moduleAlias'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import { BondTransferRootEvent, TransfersCommittedEvent } from 'src/constants'
import { L2ArbitrumProvider } from 'src/wallets/L2ArbitrumWallet'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'
import { store } from 'src/store'

class BondedWithdrawalWatcher {
  async start () {
    console.log('starting L1 BondTransferRoot event watcher')
    try {
      await this.watch()
    } catch (err) {
      console.error(err)
    }
  }

  sendTx = async (
    chainId: string,
    transferHash: string,
    rootHash: string,
    proof: string[]
  ) => {
    console.log('settleBondedWithdrawal params:')
    console.log('chainId', chainId)
    console.log('transferHash', transferHash)
    console.log('rootHash', rootHash)
    console.log('proof', proof)
    if (chainId === '1' || chainId === '42') {
      return L1BridgeContract.settleBondedWithdrawal(
        transferHash,
        rootHash,
        proof
      )
    } else {
      return L2ArbitrumBridgeContract.settleBondedWithdrawal(
        transferHash,
        rootHash,
        proof
      )
    }
  }

  handleBondTransferEvent = async (
    bondRoot: string,
    bondAmount: string,
    meta: any
  ) => {
    const { transactionHash } = meta
    console.log(
      'received L1 BondTransferRoot event',
      bondRoot,
      bondAmount.toString(),
      transactionHash
    )

    const proof = []
    const transfers: any[] = Object.values(store.transferHashes)
    for (let item of transfers) {
      try {
        const { transferHash, chainId } = item
        const tx = await this.sendTx(chainId, transferHash, bondRoot, proof)
        console.log(`settleBondedWithdrawal on chain ${chainId} tx: ${tx.hash}`)
        delete store.transferHashes[transferHash]
      } catch (err) {
        console.error('settleBondedWithdrawal error', err)
      }
    }
  }

  async watch () {
    L1BridgeContract.on(BondTransferRootEvent, this.handleBondTransferEvent)
  }
}

export default new BondedWithdrawalWatcher()
