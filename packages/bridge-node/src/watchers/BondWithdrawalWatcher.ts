import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { UINT256 } from 'src/constants'
import db from 'src/db'
import chalk from 'chalk'
import { wait, networkIdToSlug } from 'src/utils'
import BaseWatcher from './helpers/BaseWatcher'
import Bridge from './helpers/Bridge'
import L1Bridge from './helpers/L1Bridge'
import L2Bridge from './helpers/L2Bridge'

export interface Config {
  l1BridgeContract: Contract
  l2BridgeContract: Contract
  contracts: { [networkId: string]: Contract }
  label: string
  order?: () => number
}

class BondWithdrawalWatcher extends BaseWatcher {
  l1Bridge: L1Bridge
  l2Bridge: L2Bridge
  contracts: { [networkId: string]: Contract }

  constructor (config: Config) {
    super({
      tag: 'bondWithdrawalWatcher',
      prefix: config.label,
      logColor: 'green',
      order: config.order
    })
    this.l1Bridge = new L1Bridge(config.l1BridgeContract)
    this.l2Bridge = new L2Bridge(config.l2BridgeContract)
    this.contracts = config.contracts
  }

  async start () {
    this.started = true
    this.logger.log(
      `starting L2 TransferSent event watcher for L1 bondWithdrawal tx`
    )

    try {
      await this.watch()
    } catch (err) {
      this.logger.error(`BondWithdrawalWatcher error:`, err.message)
    }
  }

  async stop () {
    this.l1Bridge.removeAllListeners()
    this.l2Bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async watch () {
    this.l2Bridge
      .on(this.l2Bridge.TransferSent, this.handleTransferSentEvent)
      .on(this.l2Bridge.WithdrawalBonded, this.handleWithdrawalBondedEvent)
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })
  }

  sendBondWithdrawalTx = async (params: any) => {
    const {
      chainId,
      recipient,
      amount,
      transferNonce,
      relayerFee,
      attemptSwap,
      amountOutMin,
      deadline
    } = params

    this.logger.log(`amount:`, amount.toString())
    this.logger.log(`recipient:`, recipient)
    this.logger.log(`transferNonce:`, transferNonce)
    this.logger.log(`relayerFee:`, relayerFee.toString())
    if (attemptSwap) {
      this.logger.log(`chain ${chainId} bondWithdrawalAndAttemptSwap`)
      const l2Bridge = new L2Bridge(this.contracts[chainId])
      return l2Bridge.bondWithdrawalAndAttemptSwap(
        recipient,
        amount,
        transferNonce,
        relayerFee,
        amountOutMin,
        deadline
      )
    } else {
      const bridge = new Bridge(this.contracts[chainId])
      this.logger.log(`chain ${chainId} bondWithdrawal`)
      return bridge.bondWithdrawal(recipient, amount, transferNonce, relayerFee)
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
      this.logger.log(`received L2 TransferSentEvent event`)
      this.logger.log('transferHash:', chalk.bgCyan.black(transferHash))

      await wait(2 * 1000)
      const { from: sender, data } = await this.l2Bridge.getTransaction(
        transactionHash
      )

      const sourceChainId = await this.l2Bridge.getChainId()
      const { chainId, attemptSwap } = await this.l2Bridge.decodeSendData(data)

      this.logger.log('transferNonce:', transferNonce)
      this.logger.log('chainId:', chainId)
      this.logger.log('attemptSwap:', attemptSwap)

      const amountOutMin = '0'
      const deadline = BigNumber.from(UINT256)
      await db.transfers.update(transferHash, {
        transferHash,
        chainId,
        sourceChainId
      })

      await this.waitTimeout(transferHash, chainId)
      this.logger.log('sending bondWithdrawal tx')
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

      tx?.wait().then(async () => {
        this.emit('bondWithdrawal', {
          recipient,
          destNetworkName: networkIdToSlug(chainId),
          destNetworkId: chainId,
          transferHash
        })

        const bondedAmount = await this.getBondedAmount(transferHash, chainId)
        this.logger.debug(
          `chain ${chainId} bondWithdrawal amount:`,
          bondedAmount
        )
      })
      this.logger.log(
        `${attemptSwap ? `chainId ${chainId}` : 'L1'} bondWithdrawal tx:`,
        chalk.bgYellow.black.bold(tx.hash)
      )
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.logger.error(`bondWithdrawal tx error:`, err.message)
      }
    }
  }

  handleWithdrawalBondedEvent = async (
    transferHash: string,
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    relayerFee: BigNumber,
    meta: any
  ) => {
    this.logger.log(`received WithdrawalBonded event`)
    this.logger.log('transferHash:', transferHash)
    this.logger.log(`recipient:`, recipient)
    this.logger.log('amount:', amount.toString())
    this.logger.log('transferNonce:', transferNonce)
    this.logger.log('relayerFee:', relayerFee.toString())

    await db.transfers.update(transferHash, {
      withdrawalBonded: true
    })
  }

  getBondedAmount = async (transferHash: string, chainId: string) => {
    const bridge = new Bridge(this.contracts[chainId])
    return bridge.getBondedAmount(transferHash)
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
}

export default BondWithdrawalWatcher
