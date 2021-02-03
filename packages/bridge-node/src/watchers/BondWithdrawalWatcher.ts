import '../moduleAlias'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import L2OptimismBridgeContract from 'src/contracts/L2OptimismBridgeContract'
import L2ArbitrumBridgeContract from 'src/contracts/L2ArbitrumBridgeContract'
import { TransferSentEvent } from 'src/constants'
import { store } from 'src/store'
import chalk from 'chalk'
//import eventPoller from 'src/utils/eventPoller'
import { wait } from 'src/utils'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  L2BridgeContract: any
  L2Provider: any
  label: string
}

class BondWithdrawalWatcher extends BaseWatcher {
  L2BridgeContract: any
  L2Provider: any
  label: string

  constructor (config: Config) {
    super({
      label: 'bondWithdrawalWatcher',
      logColor: 'green'
    })
    this.L2BridgeContract = config.L2BridgeContract
    this.L2Provider = config.L2Provider
    this.label = config.label
  }

  async start () {
    this.logger.log(
      `starting L2 ${this.label} TransferSent event watcher for L1 bondWithdrawal tx`
    )

    try {
      await this.watch()
    } catch (err) {
      this.logger.error(
        `BondWithdrawalWatcher ${this.label} error:`,
        err.message
      )
    }
  }

  async watch () {
    this.L2BridgeContract.on(
      TransferSentEvent,
      this.handleTransferSentEvent
    ).on('error', err => {
      this.logger.error('event watcher error:', err.message)
    })
    /*
    eventPoller(
      this.L2BridgeContract,
      this.L2Provider,
      TransferSentEvent,
      this.handleTransferSentEvent
    )
		*/
  }

  sendBondWithdrawalTx = (params: any) => {
    const {
      sender,
      recipient,
      amount,
      transferNonce,
      relayerFee,
      attemptSwap,
      chainId
    } = params

    if (attemptSwap) {
      const amountOutMin = '0'
      const deadline = (Date.now() / 1000 + 300) | 0
      const contract =
        chainId === '69' ? L2OptimismBridgeContract : L2ArbitrumBridgeContract
      this.logger.log('amount:', amount.toString())
      this.logger.log('recipient:', recipient)
      return contract.bondWithdrawalAndAttemptSwap(
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
      this.logger.log('transfer event amount:', amount.toString())
      this.logger.log(`received L2 ${this.label} TransferSentEvent event`)
      this.logger.log('transferHash:', transferHash)

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

        if (!(chainId === '42' || chainId === '1')) {
          // L2 to L2 transfers have uniswap parameters set
          if (Number(decoded._destinationDeadline.toString()) > 0) {
            attemptSwap = true
          }
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
      this.logger.log('chainId:', chainId)
      this.logger.log('attemptSwap:', attemptSwap)

      await wait(2 * 1000)
      const tx = await this.sendBondWithdrawalTx({
        sender,
        recipient,
        amount,
        transferNonce,
        relayerFee,
        attemptSwap,
        chainId
      })
      this.logger.log(
        `${attemptSwap ? `chainId ${chainId}` : 'L1'} bondWithdrawal tx:`,
        chalk.yellow(tx.hash)
      )
    } catch (err) {
      this.logger.error('bondWithdrawal tx error:', err.message)
    }
  }
}

export default BondWithdrawalWatcher
