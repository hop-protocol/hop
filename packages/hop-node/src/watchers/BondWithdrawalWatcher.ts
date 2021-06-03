import '../moduleAlias'
import { ethers, Contract, BigNumber } from 'ethers'
import db from 'src/db'
import chalk from 'chalk'
import {
  wait,
  networkSlugToId,
  networkIdToSlug,
  isL1NetworkId
} from 'src/utils'
import BaseWatcher from './classes/BaseWatcher'
import Bridge from './classes/Bridge'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import Token from './classes/Token'
import { Chain } from 'src/constants'

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

    const promises: Promise<any>[] = []
    promises.push(
      this.eventsBatch(async (start: number, end: number) => {
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
      }, { key: this.bridge.WithdrawalBonded })
    )

    // L1 bridge doesn't contain transfer sent events so return here.
    if (!this.isL1) {
      const l2Bridge = this.bridge as L2Bridge
      promises.push(
        this.eventsBatch(async (start: number, end: number) => {
          const transferSentEvents = await l2Bridge.getTransferSentEvents(
            start,
            end
          )
          for (let event of transferSentEvents) {
            const {
              transferId,
              recipient,
              amount,
              transferNonce,
              bonderFee,
              index,
              amountOutMin,
              deadline
            } = event.args
            await this.handleTransferSentEvent(
              transferId,
              recipient,
              amount,
              transferNonce,
              bonderFee,
              index,
              amountOutMin,
              deadline,
              event
            )
          }
        }, { key: l2Bridge.TransferSent })
      )
    }

    await Promise.all(promises)
    this.logger.debug('done syncing')
  }

  async watch () {
    if (!this.isL1) {
      const l2Bridge = this.bridge as L2Bridge
      this.bridge
        .on(l2Bridge.TransferSent, this.handleTransferSentEvent)
        .on('error', err => {
          this.logger.error('event watcher error:', err.message)
          this.notifier.error(`event watcher error: ${err.message}`)
          this.quit()
        })
    }
    this.bridge
      .on(this.bridge.WithdrawalBonded, this.handleWithdrawalBondedEvent)
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
        this.notifier.error(`event watcher error: ${err.message}`)
        this.quit()
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
      const credit = await l2Bridge.getAvailableCredit()
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
      const credit = await bridge.getAvailableCredit()
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
    transferId: string,
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    index: BigNumber,
    amountOutMin: BigNumber,
    deadlineBn: BigNumber,
    meta: any
  ) => {
    if (this.isL1) {
      return
    }
    try {
      let dbTransfer = await db.transfers.getByTransferId(transferId)
      if (dbTransfer?.withdrawalBonded) {
        return
      }
      if (dbTransfer?.sentBondWithdrawalTx) {
        //return
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
      this.logger.debug('transferId:', chalk.bgCyan.black(transferId))

      await wait(2 * 1000)
      const { from: sender, data } = await this.bridge.getTransaction(
        transactionHash
      )

      const deadline = Number(deadlineBn.toString())
      const l2Bridge = this.bridge as L2Bridge
      const sourceChainId = await l2Bridge.getChainId()
      const { chainId, attemptSwap } = await l2Bridge.decodeSendData(data)
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
        transferId
      )
      if (bondedAmount.gt(0)) {
        this.logger.debug(
          `transferId ${transferId} withdrawal already bonded withdrawal`
        )
        await db.transfers.update(transferId, {
          withdrawalBonded: true
        })
        return
      }

      const isSpent = await destL2Bridge.isTransferIdSpent(transferId)
      if (isSpent) {
        this.logger.debug(
          `transferId ${transferId} bonded withdrawal already spent`
        )
        await db.transfers.update(transferId, {
          withdrawalBonded: true
        })
        return
      }

      this.logger.debug('transferNonce:', transferNonce)
      this.logger.debug('chainId:', chainId)
      this.logger.debug('attemptSwap:', attemptSwap)
      this.logger.debug('deadline:', deadline)

      await db.transfers.update(transferId, {
        transferId,
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

      await this.waitTimeout(transferId, chainId)

      dbTransfer = await db.transfers.getByTransferId(transferId)
      if (
        (dbTransfer?.sentBondWithdrawalTx || dbTransfer?.withdrawalBonded) &&
        dbTransfer?.sentBondWithdrawalTxAt
      ) {
        const tenMinutes = 60 * 10 * 1000
        // skip if a transaction was sent in the last 10 minutes
        if (dbTransfer.sentBondWithdrawalTxAt + tenMinutes > Date.now()) {
          this.logger.debug(
            'sent?:',
            !!dbTransfer.sentBondWithdrawalTx,
            'withdrawalBonded?:',
            !!dbTransfer.withdrawalBonded
          )
          return
        }
      }

      this.logger.debug('sending bondWithdrawal tx')
      if (this.dryMode) {
        this.logger.warn('dry mode: skipping bondWithdrawalWatcher transaction')
        return
      }

      if (dbTransfer.transferRootId) {
        const l1Bridge = this.siblingWatchers[networkSlugToId(Chain.Ethereum)]
          .bridge as L1Bridge
        const transferRootConfirmed = await l1Bridge.isTransferRootIdConfirmed(
          dbTransfer.transferRootId
        )
        if (transferRootConfirmed) {
          this.logger.warn(
            'transfer root already confirmed. Cannot bond withdrawal'
          )
          return
        }
      }

      await db.transfers.update(transferId, {
        sentBondWithdrawalTx: true,
        sentBondWithdrawalTxAt: Date.now()
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

      this.logger.info(
        `${attemptSwap ? `chainId ${chainId}` : 'L1'} bondWithdrawal tx:`,
        chalk.bgYellow.black.bold(tx.hash)
      )
      this.notifier.info(
        `${attemptSwap ? `chainId ${chainId}` : 'L1'} bondWithdrawal tx: ${
          tx.hash
        }`
      )

      await tx
        ?.wait()
        .then(async (receipt: any) => {
          if (receipt.status !== 1) {
            await db.transfers.update(transferId, {
              sentBondWithdrawalTx: false,
              sentBondWithdrawalTxAt: 0
            })
            throw new Error('status=0')
          }

          this.emit('bondWithdrawal', {
            recipient,
            destNetworkName: networkIdToSlug(chainId),
            destNetworkId: chainId,
            transferId
          })

          const bondedAmount = await destL2Bridge.getBondedWithdrawalAmount(
            transferId
          )
          this.logger.debug(
            `chainId: ${chainId} bondWithdrawal amount:`,
            this.bridge.formatUnits(bondedAmount)
          )

          await db.transfers.update(transferId, {
            withdrawalBonded: true
          })
        })
        .catch(async (err: Error) => {
          await db.transfers.update(transferId, {
            sentBondWithdrawalTx: false,
            sentBondWithdrawalTxAt: 0
          })

          throw err
        })
    } catch (err) {
      if (err instanceof BondError) {
        await db.transfers.update(transferId, {
          sentBondWithdrawalTx: false,
          sentBondWithdrawalTxAt: 0
        })
      }
      if (err.message !== 'cancelled') {
        this.logger.error(`bondWithdrawal error:`, err.message)
        this.notifier.error(`bondWithdrawal error: ${err.message}`)
      }
    }
  }

  handleWithdrawalBondedEvent = async (
    transferId: string,
    //recipient: string,
    amount: BigNumber,
    //transferNonce: string,
    //bonderFee: BigNumber,
    //index: BigNumber,
    meta: any
  ) => {
    const dbTransfer = await db.transfers.getByTransferId(transferId)
    if (dbTransfer?.withdrawalBonder) {
      return
    }

    const tx = await meta.getTransaction()
    const { from: withdrawalBonder } = tx
    this.logger.debug(`received WithdrawalBonded event`)
    this.logger.debug('transferId:', transferId)
    //this.logger.debug(`recipient:`, recipient)
    this.logger.debug('amount:', this.bridge.formatUnits(amount))
    //this.logger.debug('transferNonce:', transferNonce)
    //this.logger.debug('bonderFee:', bonderFee?.toString())
    //this.logger.debug('index:', index?.toString())

    await db.transfers.update(transferId, {
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

  async waitTimeout (transferId: string, chainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for bondWithdrawal event. transferId: ${transferId} chainId: ${chainId}`
    )
    const bridge = this.siblingWatchers[chainId].bridge
    let timeout = this.order() * BONDER_ORDER_DELAY_MS
    while (timeout > 0) {
      if (!this.started) {
        return
      }
      const bondedAmount = await bridge.getTotalBondedWithdrawalAmount(
        transferId
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
    this.logger.debug(`transfer id already bonded ${transferId}`)
    throw new Error('cancelled')
  }
}

export default BondWithdrawalWatcher
