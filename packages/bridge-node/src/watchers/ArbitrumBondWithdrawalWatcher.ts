import '../moduleAlias'
import wait from '@authereum/utils/core/wait'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'
import { L1Provider } from 'src/wallets/L1Wallet'
import { L2ArbitrumProvider } from 'src/wallets/L2ArbitrumWallet'
import { TransferSentEvent } from 'src/constants'
import { store } from 'src/store'

class BondWithdrawalWatcher {
  async start () {
    console.log(
      'starting L2 Arbitrum TransferSent event watcher for L1 bondWithdrawal tx'
    )

    try {
      await this.watch()
    } catch (err) {
      console.error('BondWithdrawalWatcher error', err)
    }
  }

  async watch () {
    const credit = (await L1BridgeContract.getCredit()).toString()
    const debit = (await L1BridgeContract.getDebit()).toString()
    console.log('L1 credit:', formatUnits(credit, 18))
    console.log('L1 debit:', formatUnits(debit, 18))

    if (credit === '0') {
      const amount = parseUnits('1000', 18)
      const tx = await L1BridgeContract.stake(amount)
      console.log('stake tx:', tx?.hash)
    }

    L2ArbitrumBridgeContract.on(TransferSentEvent, this.handleTransferSentEvent)
  }

  sendL1BondWithdrawalTx = (params: any) => {
    const {
      sender,
      recipient,
      amount,
      transferNonce,
      relayerFee,
      attemptSwap
    } = params

    if (attemptSwap) {
      const amountOutMin = '0'
      const deadline = (Date.now() / 1000 + 300) | 0
      return L2ArbitrumBridgeContract.functions.bondWithdrawalAndAttemptSwap(
        sender,
        recipient,
        amount,
        transferNonce,
        relayerFee,
        amountOutMin,
        deadline,
        {
          //gasLimit: 100000
        }
      )
    } else {
      return L1BridgeContract.bondWithdrawal(
        sender,
        recipient,
        amount,
        transferNonce,
        relayerFee,
        {
          //gasLimit: 100000
        }
      )
    }
  }

  handleTransferSentEvent = async (
    transferHash: string,
    recipient: string,
    amount: string,
    transferNonce: string,
    relayerFee: string,
    meta: any
  ) => {
    try {
      const { transactionHash } = meta
      console.log('received L2 Arbitrum TransferSentEvent event')
      console.log('transferHash', transferHash)

      await wait(2 * 1000)
      const { from: sender, data } = await L2ArbitrumProvider.getTransaction(
        transactionHash
      )

      let chainId = ''
      try {
        const decoded = await L2ArbitrumBridgeContract.interface.decodeFunctionData(
          'swapAndSend',
          data
        )
        chainId = decoded._chainId.toString()
      } catch (err) {
        const decoded = await L2ArbitrumBridgeContract.interface.decodeFunctionData(
          'send',
          data
        )
        chainId = decoded._chainId.toString()
      }

      store.transferHashes[transferHash] = {
        transferHash,
        chainId
      }

      await wait(2 * 1000)
      const tx = await this.sendL1BondWithdrawalTx({
        sender,
        recipient,
        amount,
        transferNonce,
        relayerFee,
        attemptSwap: false // TODO: set to true if it's L2 -> L2 transfer
      })
      console.log('L1 bondWithdrawal tx', tx.hash)
    } catch (err) {
      console.error('bondWithdrawal error', err)
    }
  }
}

export default new BondWithdrawalWatcher()
