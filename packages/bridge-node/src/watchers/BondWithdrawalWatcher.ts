import '../moduleAlias'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { UINT256 } from 'src/constants'
import { store } from 'src/store'
import chalk from 'chalk'
import { wait, networkIdToSlug } from 'src/utils'
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
    this.started = true
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

  async stop () {
    this.l2BridgeContract.off(
      this.l2BridgeContract.filters.TransferSent(),
      this.handleTransferSentEvent
    )
    this.started = false
  }

  async watch () {
    this.l2BridgeContract
      .on(
        this.l2BridgeContract.filters.TransferSent(),
        this.handleTransferSentEvent
      )
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

    const contract = this.contracts[chainId]
    this.logger.log(`${this.label} amount:`, amount.toString())
    this.logger.log(`${this.label} recipient:`, recipient)
    this.logger.log(`${this.label} transferNonce:`, transferNonce)
    this.logger.log(`${this.label} relayerFee:`, relayerFee.toString())
    if (attemptSwap) {
      this.logger.log(`${this.label} ${chainId} bondWithdrawalAndAttemptSwap`)
      return contract.bondWithdrawalAndAttemptSwap(
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
      this.logger.log(`${this.label} ${chainId} bondWithdrawal`)
      return contract.bondWithdrawal(
        recipient,
        amount,
        transferNonce,
        relayerFee,
        {
          //  gasLimit: 1000000
        }
      )
    }
  }

  handleTransferSentEvent = async (
    transferHash: string,
    recipient: string,
    amount: string,
    transferNonce: any,
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

      const sourceChainId = (
        await this.l2BridgeContract.getChainId()
      ).toString()
      let chainId = ''
      let attemptSwap = false
      try {
        const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
          'swapAndSend',
          data
        )
        chainId = decoded.chainId.toString()

        if (!(chainId === '42' || chainId === '1')) {
          // L2 to L2 transfers have uniswap parameters set
          if (Number(decoded.destinationDeadline.toString()) > 0) {
            attemptSwap = true
          }
        }
      } catch (err) {
        const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
          'send',
          data
        )
        chainId = decoded.chainId.toString()
      }

      this.logger.log('transferNonce:', transferNonce)
      this.logger.log('chainId:', chainId)
      this.logger.log('attemptSwap:', attemptSwap)

      const contract = this.contracts[chainId]
      const amountOutMin = '0'
      const deadline = BigNumber.from(UINT256)
      store.transferHashes[transferHash] = {
        transferHash,
        chainId,
        sourceChainId
      }

      await this.waitTimeout(transferHash, chainId)
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

      const cb = (...args: any[]) => {
        contract.off(contract.filters.WithdrawalBonded(), cb)
        this.handleWithdrawalBondedEvent(
          args[0],
          args[1],
          args[2],
          args[3],
          args[4],
          args[5]
        )
      }

      contract.on(contract.filters.WithdrawalBonded(), cb).on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })

      tx?.wait().then(async () => {
        this.emit('bondWithdrawal', {
          recipient,
          destNetworkName: networkIdToSlug(chainId),
          destNetworkId: chainId
        })

        const bondedAmount = await this.getBondedAmount(transferHash, chainId)
        this.logger.debug(
          `${this.label} ${chainId} bondWithdrawal amount:`,
          bondedAmount
        )
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

  handleWithdrawalBondedEvent = async (
    transferHash: string,
    recipient: string,
    amount: any,
    transferNonce: string,
    relayerFee: any,
    meta: any
  ) => {
    const { transactionHash } = meta
    this.logger.log(`${this.label} received WithdrawalBonded event`)
    this.logger.log('transferHash:', transferHash)
    this.logger.log(`recipient:`, recipient)
    this.logger.log('amount:', amount.toString())
    this.logger.log('transferNonce:', transferNonce)
    this.logger.log('relayerFee:', relayerFee.toString())
  }

  async waitTimeout (transferHash: string, chainId: string) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for bondWithdrawal event. transferHash: ${transferHash} chainId: ${chainId}`
    )
    const contract = this.contracts[chainId]
    let timeout = this.order() * 15 * 1000
    while (timeout > 0) {
      if (!this.started) {
        return
      }
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

  getBondedAmount = async (transferHash: string, chainId: string) => {
    const bridge = this.contracts[chainId]
    const bonder = await this.getBonderAddress()
    const bondedBn = await bridge.getBondedWithdrawalAmount(
      bonder,
      transferHash
    )
    const bondedAmount = Number(formatUnits(bondedBn.toString(), 18))
    return bondedAmount
  }

  async getBonderAddress () {
    return this.l1BridgeContract.signer.getAddress()
  }
}

export default BondWithdrawalWatcher
