import '../moduleAlias'
import wait from '@authereum/utils/core/wait'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import { L1Provider } from 'src/wallets/L1Wallet'
import { TransferSentEvent } from 'src/constants'
import { store } from 'src/store'
import chalk from 'chalk'
import Logger from 'src/logger'
import eventPoller from 'src/utils/eventPoller'

const logger = new Logger('[bondWithdrawalWatcher]', { color: 'green' })

export interface Config {
  L2BridgeContract: any
  L2Provider: any
  label: string
}

class BondWithdrawalWatcher {
  L2BridgeContract: any
  L2Provider: any
  label: string

  constructor (config: Config) {
    this.L2BridgeContract = config.L2BridgeContract
    this.L2Provider = config.L2Provider
    this.label = config.label
  }

  async start () {
    logger.log(
      `starting L2 ${this.label} TransferSent event watcher for L1 bondWithdrawal tx`
    )

    try {
      await this.watch()
    } catch (err) {
      logger.error('BondWithdrawalWatcher error:', err.message)
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

    this.L2BridgeContract.on(TransferSentEvent, this.handleTransferSentEvent)
    /*
    eventPoller(
      this.L2BridgeContract,
      this.L2Provider,
      TransferSentEvent,
      this.handleTransferSentEvent
    )
		*/
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
      return this.L2BridgeContract.functions.bondWithdrawalAndAttemptSwap(
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
      logger.log(`received L2 ${this.label} TransferSentEvent event`)
      logger.log('transferHash:', transferHash)

      await wait(2 * 1000)
      const { from: sender, data } = await this.L2Provider.getTransaction(
        transactionHash
      )

      let chainId = ''
      let attemptSwap = false
      try {
        const decoded = await this.L2BridgeContract.interface.decodeFunctionData(
          'swapAndSend',
          data
        )
        chainId = decoded._chainId.toString()

        // L2 to L2 transfers have uniswap parameters set
        if (Number(decoded._destinationDeadline.toString()) > 0) {
          attemptSwap = true
        }
      } catch (err) {
        const decoded = await this.L2BridgeContract.interface.decodeFunctionData(
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
        attemptSwap
      })
      logger.log('L1 bondWithdrawal tx:', chalk.yellow(tx.hash))
    } catch (err) {
      logger.error('bondWithdrawal tx error:', err.message)
    }
  }
}

export default BondWithdrawalWatcher
