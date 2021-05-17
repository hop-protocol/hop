import '../moduleAlias'
import { ethers, Contract, BigNumber } from 'ethers'
import db from 'src/db'
import chalk from 'chalk'
import { wait, networkIdToSlug, isL1NetworkId } from 'src/utils'
import BaseWatcher from './helpers/BaseWatcher'
import Bridge from './helpers/Bridge'
import L1Bridge from './helpers/L1Bridge'
import L2Bridge from './helpers/L2Bridge'
import Token from './helpers/Token'

export interface Config {
  isL1: boolean
  bridgeContract: Contract
  label: string
  order?: () => number
  dryMode?: boolean
  minAmount?: number
  maxAmount?: number
}

const BONDER_ORDER_DELAY_MS = 60 * 1000

class BondError extends Error {}

class BondWithdrawalWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: BondWithdrawalWatcher }
  minAmount: BigNumber
  maxAmount: BigNumber

  constructor (config: Config) {
    super({
      tag: 'bondWithdrawalWatcher',
      prefix: config.label,
      logColor: 'green',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    if (typeof config.minAmount === 'number') {
      this.minAmount = this.bridge.parseUnits(config.minAmount)
    }
    if (typeof config.maxAmount === 'number') {
      this.maxAmount = this.bridge.parseUnits(config.maxAmount)
    }
  }

  async start () {
    this.started = true
    this.logger.debug(
      `min bondwithdrawal amount: ${
        this.minAmount ? this.bridge.formatUnits(this.minAmount) : 0
      }`
    )
    this.logger.debug(
      `max bondwithdrawal amount: ${
        this.maxAmount ? this.bridge.formatUnits(this.maxAmount) : 'all'
      }`
    )
    try {
      await Promise.all([this.syncUp(), this.watch()])
    } catch (err) {
      this.logger.error(`bondWithdrawalWatcher error:`, err.message)
      this.notifier.error(`bondWithdrawalWatcher error: ${err.message}`)
    }
  }

  async stop () {
    this.bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async syncUp () {
    this.logger.debug('syncing up events')

    await this.eventsBatch(async (start: number, end: number) => {
      const withdrawalBondedEvents = await this.bridge.getWithdrawalBondedEvents(
        start,
        end
      )

      for (let event of withdrawalBondedEvents) {
        const {
          transferId,
          //recipient,
          amount
          //transferNonce,
          //bonderFee,
          //index
        } = event.args

        await this.handleWithdrawalBondedEvent(
          transferId,
          //recipient,
          amount,
          //transferNonce,
          //bonderFee,
          //index,
          event
        )
      }
    })

    // L1 bridge doesn't contain transfer sent events so return here.
    if (this.isL1) {
      this.logger.debug('done syncing')
      return
    }

    await this.eventsBatch(async (start: number, end: number) => {
      const transferSentEvents = await (this
        .bridge as L2Bridge).getTransferSentEvents(start, end)
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
    })
    this.logger.debug('done syncing')
  }

  async watch () {
    if (!this.isL1) {
      this.bridge
        .on(
          (this.bridge as L2Bridge).TransferSent,
          this.handleTransferSentEvent
        )
        .on('error', err => {
          this.logger.error('event watcher error:', err.message)
          this.notifier.error(`event watcher error: ${err.message}`)
        })
    }
    this.bridge
      .on(this.bridge.WithdrawalBonded, this.handleWithdrawalBondedEvent)
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
        this.notifier.error(`event watcher error: ${err.message}`)
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

    this.logger.debug(`amount:`, this.bridge.formatUnits(amount))
    this.logger.debug(`recipient:`, recipient)
    this.logger.debug(`transferNonce:`, transferNonce)
    this.logger.debug(`bonderFee:`, this.bridge.formatUnits(bonderFee))
    const decimals = await this.getBridgeTokenDecimals(chainId)
    if (attemptSwap) {
      this.logger.debug(`bondWithdrawalAndAttemptSwap chainId: ${chainId}`)
      const l2Bridge = this.siblingWatchers[chainId].bridge as L2Bridge
      const hasPositiveBalance = await l2Bridge.hasPositiveBalance()
      if (!hasPositiveBalance) {
        throw new BondError(
          `bonder requires positive balance on chainId ${chainId} to bond withdrawal`
        )
      }
      const credit = await l2Bridge.getCredit()
      if (credit.lt(amount)) {
        throw new BondError(
          `not enough credit to bond withdrawal. Have ${this.bridge.formatUnits(
            credit
          )}, need ${this.bridge.formatUnits(amount)}`
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
      const bridge = this.siblingWatchers[chainId].bridge
      const hasPositiveBalance = await bridge.hasPositiveBalance()
      if (!hasPositiveBalance) {
        throw new BondError(
          'bonder requires positive balance to bond withdrawal'
        )
      }
      const credit = await bridge.getCredit()
      if (credit.lt(amount)) {
        throw new BondError(
          `not enough credit to bond withdrawal. Have ${this.bridge.formatUnits(
            credit
          )}, need ${this.bridge.formatUnits(amount)}`
        )
      }
      return bridge.bondWithdrawal(recipient, amount, transferNonce, bonderFee)
    }
  }

  handleTransferSentEvent = async (
    transferHash: string,
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    index: BigNumber,
    meta: any
  ) => {
    if (this.isL1) {
      return
    }
    try {
      const dbTransferHash = await db.transfers.getByTransferHash(transferHash)
      if (dbTransferHash?.withdrawalBonded) {
        return
      }

      const { transactionHash } = meta
      const now = (Date.now() / 1000) | 0
      const { timestamp } = await meta.getBlock()
      const oneDay = 60 * 60 * 24
      const shouldBond = now - timestamp < oneDay
      if (!shouldBond) {
        return
      }
      this.logger.debug(
        'transfer event amount:',
        this.bridge.formatUnits(amount)
      )
      this.logger.debug(`received L2 TransferSentEvent event`)
      this.logger.debug('transferHash:', chalk.bgCyan.black(transferHash))

      await wait(2 * 1000)
      const { from: sender, data } = await this.bridge.getTransaction(
        transactionHash
      )

      const sourceChainId = await (this.bridge as L2Bridge).getChainId()
      const { chainId, attemptSwap } = await (this
        .bridge as L2Bridge).decodeSendData(data)
      const isBonder = await this.siblingWatchers[chainId].bridge.isBonder()
      if (!isBonder) {
        this.logger.warn(
          `not a bonder on chainId ${chainId}. Cannot bond withdrawal`
        )
        return
      }

      await this.bridge.waitSafeConfirmations()

      const destL2Bridge = this.siblingWatchers[chainId].bridge as L2Bridge
      const bondedAmount = await destL2Bridge.getTotalBondedWithdrawalAmount(
        transferHash
      )
      if (bondedAmount.gt(0)) {
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

      const amountOutMin = BigNumber.from(0)
      const deadline = BigNumber.from(ethers.constants.MaxUint256)
      await db.transfers.update(transferHash, {
        transferHash,
        chainId,
        sourceChainId
      })

      if (this.minAmount && amount.lt(this.minAmount)) {
        this.logger.debug(
          `transfer amount ${this.bridge.formatUnits(
            amount
          )} is less than configured min amount allowed ${this.bridge.formatUnits(
            this.minAmount
          )}. Skipping bond withdrawal.`
        )
        return
      }
      if (this.maxAmount && amount.gt(this.maxAmount)) {
        this.logger.debug(
          `transfer amount ${this.bridge.formatUnits(
            amount
          )} is greater than configured max amount allowed ${this.bridge.formatUnits(
            this.maxAmount
          )}. Skipping bond withdrawal.`
        )
        return
      }

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

      if (this.dryMode) {
        this.logger.warn('dry mode: skipping bondWithdrawalWatcher transaction')
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
            this.bridge.formatUnits(bondedAmount)
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
      this.notifier.info(
        `${attemptSwap ? `chainId ${chainId}` : 'L1'} bondWithdrawal tx: ${
          tx.hash
        }`
      )
    } catch (err) {
      if (err instanceof BondError) {
        await db.transfers.update(transferHash, {
          sentBondWithdrawalTx: false
        })
      }
      if (err.message !== 'cancelled') {
        this.logger.error(`bondWithdrawal error:`, err.message)
        this.notifier.error(`bondWithdrawal error: ${err.message}`)
      }
    }
  }

  handleWithdrawalBondedEvent = async (
    transferHash: string,
    //recipient: string,
    amount: BigNumber,
    //transferNonce: string,
    //bonderFee: BigNumber,
    //index: BigNumber,
    meta: any
  ) => {
    const dbTransfer = await db.transfers.getByTransferHash(transferHash)
    if (dbTransfer?.withdrawalBonder) {
      return
    }

    const tx = await meta.getTransaction()
    const { from: withdrawalBonder } = tx
    this.logger.debug(`received WithdrawalBonded event`)
    this.logger.debug('transferHash:', transferHash)
    //this.logger.debug(`recipient:`, recipient)
    this.logger.debug('amount:', this.bridge.formatUnits(amount))
    //this.logger.debug('transferNonce:', transferNonce)
    //this.logger.debug('bonderFee:', bonderFee?.toString())
    //this.logger.debug('index:', index?.toString())

    await db.transfers.update(transferHash, {
      withdrawalBonded: true,
      withdrawalBonder
    })
  }

  async getBridgeTokenDecimals (chainId: number) {
    let bridge: any
    let token: Token
    if (isL1NetworkId(chainId)) {
      bridge = this.siblingWatchers[chainId].bridge as L2Bridge
      token = await bridge.l1CanonicalToken()
    } else {
      bridge = this.siblingWatchers[chainId].bridge
      token = await bridge.hToken()
    }
    return token.decimals()
  }

  async waitTimeout (transferHash: string, chainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for bondWithdrawal event. transferHash: ${transferHash} chainId: ${chainId}`
    )
    const bridge = this.siblingWatchers[chainId].bridge
    let timeout = this.order() * BONDER_ORDER_DELAY_MS
    while (timeout > 0) {
      if (!this.started) {
        return
      }
      const bondedAmount = await bridge.getTotalBondedWithdrawalAmount(
        transferHash
      )
      if (!bondedAmount.eq(0)) {
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
