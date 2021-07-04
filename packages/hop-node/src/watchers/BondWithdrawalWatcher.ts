import '../moduleAlias'
import { ethers, Contract, BigNumber, Event, providers } from 'ethers'
import db from 'src/db'
import chalk from 'chalk'
import { wait, isL1ChainId } from 'src/utils'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
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

class BondWithdrawalWatcher extends BaseWatcherWithEventHandlers {
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
    this.logger.debug(
      `min bondWithdrawal amount: ${
        this.minAmount ? this.bridge.formatUnits(this.minAmount) : 0
      }`
    )
    this.logger.debug(
      `max bondWithdrawal amount: ${
        this.maxAmount ? this.bridge.formatUnits(this.maxAmount) : 'all'
      }`
    )
    await super.start()
  }

  async syncUp (): Promise<any> {
    this.logger.debug('syncing up events')

    const promises: Promise<any>[] = []
    promises.push(
      this.bridge.mapWithdrawalBondedEvents(
        async (event: Event) => {
          return this.handleRawWithdrawalBondedEvent(event)
        },
        { cacheKey: this.cacheKey(this.bridge.WithdrawalBonded) }
      )
    )

    // L1 bridge doesn't contain transfer sent events so don't check here.
    if (!this.isL1) {
      const l2Bridge = this.bridge as L2Bridge
      promises.push(
        l2Bridge.mapTransferSentEvents(
          async (event: Event) => {
            return this.handleRawTransferSentEvent(event)
          },
          { cacheKey: this.cacheKey(l2Bridge.TransferSent) }
        )
      )
    }

    await Promise.all(promises)
    this.logger.debug('done syncing')

    await wait(this.resyncIntervalSec)
    return this.syncUp()
  }

  async watch () {
    if (!this.isL1) {
      const l2Bridge = this.bridge as L2Bridge
      this.bridge
        .on(l2Bridge.TransferSent, this.handleTransferSentEvent)
        .on('error', err => {
          this.logger.error(`event watcher error: ${err.message}`)
          this.notifier.error(`event watcher error: ${err.message}`)
          this.quit()
        })
    }
    this.bridge
      .on(this.bridge.WithdrawalBonded, this.handleWithdrawalBondedEvent)
      .on('error', err => {
        this.logger.error(`event watcher error: ${err.message}`)
        this.notifier.error(`event watcher error: ${err.message}`)
        this.quit()
      })
  }

  async pollCheck () {
    if (this.isL1) {
      return
    }
    while (true) {
      if (!this.started) {
        return
      }
      try {
        await this.checkTransferSentFromDb()
      } catch (err) {
        console.error(err)
        this.logger.error(`poll check error: ${err.message}`)
        this.notifier.error(`poll check error: ${err.message}`)
      }
      await wait(this.pollIntervalSec)
    }
  }

  async handleRawWithdrawalBondedEvent (event: Event) {
    const { transferId, amount } = event.args
    await this.handleWithdrawalBondedEvent(transferId, amount, event)
  }

  async handleRawTransferSentEvent (event: Event) {
    const {
      transferId,
      chainId: destinationChainId,
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
      destinationChainId,
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

  async checkTransferSentFromDb () {
    const dbTransfers = await db.transfers.getUnbondedSentTransfers({
      sourceChainId: await this.bridge.getChainId()
    })
    if (dbTransfers.length) {
      this.logger.debug(
        `checking ${dbTransfers.length} unbonded transfers db items`
      )
    }
    const promises: Promise<any>[] = []
    for (let dbTransfer of dbTransfers) {
      const { transferId } = dbTransfer
      promises.push(this.checkTransferSent(transferId))
    }

    await Promise.all(promises)
  }

  checkTransferSent = async (transferId: string) => {
    const logger = this.logger.create({ id: transferId })

    let dbTransfer = await db.transfers.getByTransferId(transferId)
    const {
      destinationChainId,
      sourceChainId,
      recipient,
      amount,
      amountOutMin,
      bonderFee,
      transferNonce,
      deadline,
      transferSentTxHash
    } = dbTransfer
    const sourceL2Bridge = this.bridge as L2Bridge
    const destBridge = this.getSiblingWatcherByChainId(destinationChainId)
      .bridge

    await sourceL2Bridge.waitSafeConfirmationsAndCheckBlockNumber(
      transferSentTxHash,
      async () => {
        return sourceL2Bridge.getTransferSentTxHash(transferId)
      }
    )

    const isBonder = await destBridge.isBonder()
    if (!isBonder) {
      logger.warn(
        `not a bonder on destination chain id ${destinationChainId}. Cannot bond withdrawal`
      )
      return
    }

    // TODO: Handle this in DB getter
    if (this.minAmount && amount.lt(this.minAmount)) {
      logger.debug(
        `transfer amount ${this.bridge.formatUnits(
          amount
        )} is less than configured min amount allowed ${this.bridge.formatUnits(
          this.minAmount
        )}. Skipping bond withdrawal.`
      )
      return
    }
    if (this.maxAmount && amount.gt(this.maxAmount)) {
      logger.debug(
        `transfer amount ${this.bridge.formatUnits(
          amount
        )} is greater than configured max amount allowed ${this.bridge.formatUnits(
          this.maxAmount
        )}. Skipping bond withdrawal.`
      )
      return
    }

    // TODO: Handle this in DB getter?
    const bondedAmount = await destBridge.getBondedWithdrawalAmount(transferId)
    const isTransferIdSpent = await destBridge.isTransferIdSpent(transferId)
    const isWithdrawalBonded = bondedAmount.gt(0) || isTransferIdSpent
    if (isWithdrawalBonded) {
      logger.debug(
        `transferId ${transferId} already bonded. isSpent: ${isTransferIdSpent}`
      )
      await db.transfers.update(transferId, {
        withdrawalBonded: true
      })
      const event = await destBridge.getBondedWithdrawalEvent(transferId)
      if (event?.transactionHash) {
        await db.transfers.update(transferId, {
          withdrawalBondedTxHash: event?.transactionHash
        })
      }
      return
    }

    logger.debug('sending bondWithdrawal tx')
    if (this.dryMode) {
      logger.warn('dry mode: skipping bondWithdrawalWatcher transaction')
      return
    }

    if (dbTransfer.transferRootId) {
      const l1Bridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum)
        .bridge as L1Bridge
      const transferRootConfirmed = await l1Bridge.isTransferRootIdConfirmed(
        dbTransfer.transferRootId
      )
      if (transferRootConfirmed) {
        logger.warn('transfer root already confirmed. Cannot bond withdrawal')
        return
      }
    }

    await this.waitTimeout(transferId, destinationChainId)

    const { from: sender, data } = await sourceL2Bridge.getTransaction(
      transferSentTxHash
    )
    const { attemptSwap } = await sourceL2Bridge.decodeSendData(data)

    await db.transfers.update(transferId, {
      sentBondWithdrawalTxAt: Date.now()
    })

    const tx = await this.sendBondWithdrawalTx({
      transferId,
      sender,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      attemptSwap,
      destinationChainId,
      amountOutMin,
      deadline
    })

    logger.info(
      `sent bondWithdrawal on ${
        attemptSwap ? `destination chain ${destinationChainId}` : 'L1'
      } (source chain ${sourceChainId}) tx:`,
      chalk.bgYellow.black.bold(tx.hash)
    )
    this.notifier.info(
      `sent ${
        attemptSwap ? `destination chain ${destinationChainId}` : 'L1'
      } bondWithdrawal tx: ${tx.hash}`
    )

    await tx
      ?.wait()
      .then(async (receipt: providers.TransactionReceipt) => {
        if (receipt.status !== 1) {
          await db.transfers.update(transferId, {
            sentBondWithdrawalTxAt: 0
          })
          throw new Error('status=0')
        }

        this.emit('bondWithdrawal', {
          recipient,
          destNetworkName: this.chainIdToSlug(destinationChainId),
          destNetworkId: destinationChainId,
          transferId
        })

        const bondedAmount = await destBridge.getBondedWithdrawalAmount(
          transferId
        )
        logger.debug(
          `destination chain id: ${destinationChainId} bondWithdrawal amount:`,
          this.bridge.formatUnits(bondedAmount)
        )

        await db.transfers.update(transferId, {
          withdrawalBonded: true,
          withdrawalBondedTxHash: receipt.transactionHash
        })
      })
      .catch(async (err: Error) => {
        await db.transfers.update(transferId, {
          sentBondWithdrawalTxAt: 0
        })

        throw err
      })
  }

  sendBondWithdrawalTx = async (params: any) => {
    const {
      transferId,
      destinationChainId,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      attemptSwap,
      amountOutMin,
      deadline
    } = params
    const logger = this.logger.create({ id: transferId })

    logger.debug(`amount:`, this.bridge.formatUnits(amount))
    logger.debug(`recipient:`, recipient)
    logger.debug(`transferNonce:`, transferNonce)
    logger.debug(`bonderFee:`, this.bridge.formatUnits(bonderFee))
    if (attemptSwap) {
      logger.debug(
        `bondWithdrawalAndAttemptSwap destinationChainId: ${destinationChainId}`
      )
      const l2Bridge = this.getSiblingWatcherByChainId(destinationChainId)
        .bridge as L2Bridge
      const hasPositiveBalance = await l2Bridge.hasPositiveBalance()
      if (!hasPositiveBalance) {
        throw new BondError(
          `bonder requires positive balance on destinationChainId ${destinationChainId} to bond withdrawal`
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
      logger.debug(`bondWithdrawal chain: ${destinationChainId}`)
      const bridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
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

  async waitTimeout (transferId: string, destinationChainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for bondWithdrawal event. transferId: ${transferId} destinationChainId: ${destinationChainId}`
    )
    const bridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
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
