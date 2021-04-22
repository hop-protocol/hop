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

const BONDER_ORDER_DELAY_MS = 60 * 1000

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
    try {
      await Promise.all([this.syncUp(), this.watch()])
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

  async syncUp () {
    this.logger.debug('syncing up events')
    let l1BlockNumber = await this.l1Bridge.getBlockNumber()
    let l1StartBlockNumber = l1BlockNumber - 1000
    const l1WithdrawalBondedEvents = await this.l1Bridge.getWithdrawalBondedEvents(
      l1StartBlockNumber,
      l1BlockNumber
    )

    for (let event of l1WithdrawalBondedEvents) {
      const {
        transferId,
        recipient,
        amount,
        transferNonce,
        bonderFee
      } = event.args
      await this.handleWithdrawalBondedEvent(
        transferId,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        BigNumber.from(0),
        event
      )
    }

    const l2BlockNumber = await this.l2Bridge.getBlockNumber()
    const l2StartBlockNumber = l2BlockNumber - 1000

    const l2WithdrawalBondedEvents = await this.l2Bridge.getWithdrawalBondedEvents(
      l2StartBlockNumber,
      l2BlockNumber
    )

    for (let event of l2WithdrawalBondedEvents) {
      const {
        transferId,
        recipient,
        amount,
        transferNonce,
        bonderFee
      } = event.args
      await this.handleWithdrawalBondedEvent(
        transferId,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        BigNumber.from(0),
        event
      )
    }

    const transferSentEvents = await this.l2Bridge.getTransferSentEvents(
      l2StartBlockNumber,
      l2BlockNumber
    )

    // TODO: check for withdrawal bonded event on L2 and mark as bonded
    if (false) {
      for (let event of transferSentEvents) {
        const {
          transferId,
          recipient,
          amount,
          transferNonce,
          bonderFee,
          index
        } = event.args
        await this.handleTransferSentEvent(
          transferId,
          recipient,
          amount,
          transferNonce,
          bonderFee,
          index,
          event
        )
      }
    }
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
      bonderFee,
      attemptSwap,
      amountOutMin,
      deadline
    } = params

    this.logger.debug(`amount:`, amount.toString())
    this.logger.debug(`recipient:`, recipient)
    this.logger.debug(`transferNonce:`, transferNonce)
    this.logger.debug(`bonderFee:`, bonderFee?.toString())
    const formattedAmount = Number(formatUnits(amount, 18))
    if (attemptSwap) {
      this.logger.debug(`bondWithdrawalAndAttemptSwap chainId: ${chainId}`)
      const l2Bridge = new L2Bridge(this.contracts[chainId])
      const hasPositiveBalance = await l2Bridge.hasPositiveBalance()
      if (!hasPositiveBalance) {
        throw new Error('bonder requires positive balance to bond withdrawal')
      }
      const credit = await l2Bridge.getCredit()
      if (credit < formattedAmount) {
        throw new Error(
          `not enough credit to bond withdrawal. Have ${credit}, need ${formattedAmount}`
        )
      }
      return l2Bridge.bondWithdrawalAndAttemptSwap(
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        deadline
      )
    } else {
      this.logger.debug(`bondWithdrawal chain: ${chainId}`)
      const bridge = new Bridge(this.contracts[chainId])
      const hasPositiveBalance = await bridge.hasPositiveBalance()
      if (!hasPositiveBalance) {
        throw new Error('bonder requires positive balance to bond withdrawal')
      }
      const credit = await bridge.getCredit()
      if (credit < formattedAmount) {
        throw new Error(
          `not enough credit to bond withdrawal. Have ${credit}, need ${formattedAmount}`
        )
      }
      return bridge.bondWithdrawal(recipient, amount, transferNonce, bonderFee)
    }
  }

  handleTransferSentEvent = async (
    transferHash: string,
    recipient: string,
    amount: string,
    transferNonce: string,
    bonderFee: string,
    index: BigNumber,
    meta: any
  ) => {
    const isBonder = await this.l1Bridge.isBonder()
    if (!isBonder) {
      return
    }

    try {
      const dbTransferHash = await db.transfers.getByTransferHash(transferHash)
      if (dbTransferHash?.withdrawalBonded) {
        return
      }

      const { transactionHash } = meta
      this.logger.debug('transfer event amount:', amount.toString())
      this.logger.debug(`received L2 TransferSentEvent event`)
      this.logger.debug('transferHash:', chalk.bgCyan.black(transferHash))

      await wait(2 * 1000)
      const { from: sender, data } = await this.l2Bridge.getTransaction(
        transactionHash
      )

      const sourceChainId = await this.l2Bridge.getChainId()
      const { chainId, attemptSwap } = await this.l2Bridge.decodeSendData(data)

      const destL2Bridge = new L2Bridge(this.contracts[chainId])
      const bondedAmount = await destL2Bridge.getTotalBondedWithdrawalAmount(
        transferHash
      )
      if (bondedAmount > 0) {
        this.logger.debug(
          `transferHash ${transferHash} withdrawal already bonded withdrawal`
        )
        await db.transfers.update(transferHash, {
          withdrawalBonded: true
        })
        return
      }

      const isSpent = await destL2Bridge.isTransferHashSpent(transferHash)
      if (isSpent) {
        this.logger.debug(
          `transferHash ${transferHash} bonded withdrawal already spent`
        )
        await db.transfers.update(transferHash, {
          withdrawalBonded: true
        })
        return
      }

      this.logger.debug('transferNonce:', transferNonce)
      this.logger.debug('chainId:', chainId)
      this.logger.debug('attemptSwap:', attemptSwap)

      const amountOutMin = '0'
      const deadline = BigNumber.from(UINT256)
      await db.transfers.update(transferHash, {
        transferHash,
        chainId,
        sourceChainId
      })

      await this.waitTimeout(transferHash, chainId)
      this.logger.debug('sending bondWithdrawal tx')

      const dbTransfer = await db.transfers.getByTransferHash(transferHash)
      if (dbTransfer?.sentBondWithdrawalTx || dbTransfer?.withdrawalBonded) {
        this.logger.debug(
          'sent?:',
          !!dbTransfer.sentBondWithdrawalTx,
          'withdrawalBonded?:',
          !!dbTransfer.withdrawalBonded
        )
        return
      }

      await db.transfers.update(transferHash, {
        sentBondWithdrawalTx: true
      })

      const tx = await this.sendBondWithdrawalTx({
        sender,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        attemptSwap,
        chainId,
        amountOutMin,
        deadline
      })

      tx?.wait()
        .then(async (receipt: any) => {
          if (receipt.status !== 1) {
            await db.transfers.update(transferHash, {
              sentBondWithdrawalTx: false
            })
            throw new Error('status=0')
          }

          this.emit('bondWithdrawal', {
            recipient,
            destNetworkName: networkIdToSlug(chainId),
            destNetworkId: chainId,
            transferHash
          })

          const bondedAmount = await destL2Bridge.getBondedWithdrawalAmount(
            transferHash
          )
          this.logger.debug(
            `chainId: ${chainId} bondWithdrawal amount:`,
            bondedAmount
          )

          await db.transfers.update(transferHash, {
            withdrawalBonded: true
          })
        })
        .catch(async (err: Error) => {
          await db.transfers.update(transferHash, {
            sentBondWithdrawalTx: false
          })

          throw err
        })
      this.logger.info(
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
    bonderFee: BigNumber,
    index: BigNumber,
    meta: any
  ) => {
    this.logger.debug(`received WithdrawalBonded event`)
    this.logger.debug('transferHash:', transferHash)
    this.logger.debug(`recipient:`, recipient)
    this.logger.debug('amount:', amount.toString())
    this.logger.debug('transferNonce:', transferNonce)
    this.logger.debug('bonderFee:', bonderFee?.toString())
    this.logger.debug('index:', index?.toString())

    await db.transfers.update(transferHash, {
      withdrawalBonded: true
    })
  }

  async waitTimeout (transferHash: string, chainId: string) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for bondWithdrawal event. transferHash: ${transferHash} chainId: ${chainId}`
    )
    const bridge = new Bridge(this.contracts[chainId])
    let timeout = this.order() * BONDER_ORDER_DELAY_MS
    while (timeout > 0) {
      if (!this.started) {
        return
      }
      const bondedAmount = await bridge.getTotalBondedWithdrawalAmount(
        transferHash
      )
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
