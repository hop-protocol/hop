import '../moduleAlias'
import { TransferSentEvent } from 'src/constants'
import { store } from 'src/store'
import chalk from 'chalk'
import { wait } from 'src/utils'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  l1BridgeContract: any
  l2BridgeContract: any
  l2Provider: any
  contracts: any
  label: string
}

class BondWithdrawalWatcher extends BaseWatcher {
  l1BridgeContract: any
  l2BridgeContract: any
  l2Provider: any
  contracts: any
  label: string

  constructor (config: Config) {
    super({
      label: 'bondWithdrawalWatcher',
      logColor: 'green'
    })
    this.l1BridgeContract = config.l1BridgeContract
    this.l2BridgeContract = config.l2BridgeContract
    this.l2Provider = config.l2Provider
    this.contracts = config.contracts
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
    this.l2BridgeContract
      .on(TransferSentEvent, this.handleTransferSentEvent)
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })
  }

  sendBondWithdrawalTx = async (params: any) => {
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
      // TODO
      const contract = this.contracts[chainId] || this.l2BridgeContract
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
          //gasLimit: 1000000
        }
      )
    } else {
      return this.l1BridgeContract.bondWithdrawal(
        sender,
        recipient,
        amount,
        transferNonce,
        relayerFee,
        {
          gasLimit: 1000000
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
      const { from: sender, data } = await this.l2Provider.getTransaction(
        transactionHash
      )

      let chainId = ''
      let attemptSwap = false
      try {
        const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
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
        const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
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
      this.logger.error(`${this.label} bondWithdrawal tx error:`, err.message)
    }
  }
}

export default BondWithdrawalWatcher
