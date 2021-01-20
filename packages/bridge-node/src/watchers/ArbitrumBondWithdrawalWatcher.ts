import '../moduleAlias'
import wait from '@authereum/utils/core/wait'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'
import { L1Provider } from 'src/wallets/L1Wallet'
import { L2ArbitrumProvider } from 'src/wallets/L2ArbitrumWallet'
import { TransferSentEvent } from 'src/constants'
import { store } from 'src/store'
import chalk from 'chalk'
import Logger from 'src/logger'

const logger = new Logger('[bondWithdrawalWatcher]', { color: 'green' })

class BondWithdrawalWatcher {
  async start () {
    logger.log(
      'starting L2 Arbitrum TransferSent event watcher for L1 bondWithdrawal tx'
    )

    try {
      await this.watch()
    } catch (err) {
      logger.error('BondWithdrawalWatcher error:', err)
    }
  }

  async watch () {
    const credit = (await L1BridgeContract.getCredit()).toString()
    const debit = (await L1BridgeContract.getDebit()).toString()
    logger.log('L1 credit balance:', formatUnits(credit, 18))
    logger.log('L1 debit balance:', formatUnits(debit, 18))

    if (credit === '0') {
      const amount = parseUnits('1000', 18)
      const tx = await L1BridgeContract.stake(amount)
      logger.log('stake tx:', tx?.hash)
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
      logger.log('received L2 Arbitrum TransferSentEvent event')
      logger.log('transferHash:', transferHash)

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
      logger.log('L1 bondWithdrawal tx:', chalk.yellow(tx.hash))
    } catch (err) {
      logger.error('bondWithdrawal tx error:', err)
    }
  }
}

export default new BondWithdrawalWatcher()
