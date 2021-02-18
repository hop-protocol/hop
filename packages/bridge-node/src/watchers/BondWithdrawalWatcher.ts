import '../moduleAlias'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { TransferSentEvent, UINT256 } from 'src/constants'
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
  order?: () => number
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
      logColor: 'green',
      order: config.order
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
      chainId,
      sender,
      recipient,
      amount,
      transferNonce,
      relayerFee,
      attemptSwap,
      amountOutMin,
      deadline
    } = params

    if (attemptSwap) {
      const contract = this.contracts[chainId]
      this.logger.log('amount:', amount.toString())
      this.logger.log('recipient:', recipient)
      this.logger.log(`${chainId} bondWithdrawalAndAttemptSwap`)
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
      this.logger.log('L1 bondWithdrawal')
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

      this.logger.log('chainId:', chainId)
      this.logger.log('attemptSwap:', attemptSwap)

      const contract = this.contracts[chainId]
      const amountOutMin = '0'
      const deadline = BigNumber.from(UINT256)
      const computedTransferHash = await contract.getTransferHash(
        chainId,
        sender,
        recipient,
        amount,
        transferNonce,
        relayerFee,
        attemptSwap ? amountOutMin : 0,
        attemptSwap ? deadline : 0
      )
      this.logger.log('computed transfer hash:', computedTransferHash)
      store.transferHashes[transferHash] = {
        transferHash,
        computedTransferHash,
        chainId
      }

      await this.waitTimeout(computedTransferHash, chainId)
      const tx = await this.sendBondWithdrawalTx({
        sender,
        recipient,
        amount,
        transferNonce,
        relayerFee,
        attemptSwap,
        chainId,
        amountOutMin,
        deadline
      })
      this.logger.log(
        `${attemptSwap ? `chainId ${chainId}` : 'L1'} bondWithdrawal tx:`,
        chalk.bgYellow.black.bold(tx.hash)
      )
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.logger.error(`${this.label} bondWithdrawal tx error:`, err.message)
      }
    }
  }

  async waitTimeout (transferHash: string, chainId: string) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for bondWithdrawal event. transfer hash: ${transferHash} chain id: ${chainId}`
    )
    const contract = this.contracts[chainId]
    let timeout = this.order() * 15 * 1000
    while (timeout > 0) {
      const bondedBn = await contract.getBondedWithdrawalAmount(transferHash)
      const bondedAmount = Number(formatUnits(bondedBn.toString(), 18))
      if (bondedAmount !== 0) {
        break
      }
      const delay = 2 * 1000
      timeout -= delay
      await wait(delay)
    }
    if (timeout <= 0) {
      return
    }
    this.logger.debug(`transfer hash already bonded ${transferHash}`)
    throw new Error('cancelled')
  }
}

export default BondWithdrawalWatcher
