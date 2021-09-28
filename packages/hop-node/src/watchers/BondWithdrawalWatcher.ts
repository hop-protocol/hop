import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L2Bridge from './classes/L2Bridge'
import chalk from 'chalk'
import isL1ChainId from 'src/utils/isL1ChainId'
import wait from 'src/utils/wait'
import { BigNumber, Contract, providers } from 'ethers'
import { BonderFeeTooLowError } from 'src/types/error'
import { Transfer } from 'src/db/TransfersDb'
import { TxError } from 'src/constants'

export interface Config {
  chainSlug: string
  tokenSymbol: string
  isL1: boolean
  bridgeContract: Contract
  label: string
  order?: () => number
  dryMode?: boolean
  stateUpdateAddress?: string
}

const BONDER_ORDER_DELAY_MS = 60 * 1000

class BondError extends Error {}

class BondWithdrawalWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: BondWithdrawalWatcher }

  constructor (config: Config) {
    super({
      tag: 'BondWithdrawalWatcher',
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      prefix: config.label,
      logColor: 'green',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode,
      stateUpdateAddress: config.stateUpdateAddress
    })
  }

  async pollHandler () {
    if (this.isL1) {
      return
    }
    await this.checkTransferSentFromDb()
  }

  async checkTransferSentFromDb () {
    const dbTransfers = await this.db.transfers.getUnbondedSentTransfers({
      sourceChainId: await this.bridge.getChainId()
    })
    if (dbTransfers.length) {
      this.logger.debug(
        `checking ${dbTransfers.length} unbonded transfers db items`
      )
    }

    const promises: Promise<any>[] = []
    for (const dbTransfer of dbTransfers) {
      const {
        transferId,
        destinationChainId,
        amount,
        withdrawalBondTxError
      } = dbTransfer

      const availableCredit = await this.getAvailableCreditForTransfer(destinationChainId, amount)
      if (
        availableCredit?.lt(amount) &&
        withdrawalBondTxError === TxError.NotEnoughLiquidity
      ) {
        continue
      }

      promises.push(this.checkTransferId(transferId).catch(err => {
        this.logger.error('checkTransferId error:', err)
      }))
    }

    await Promise.all(promises)
  }

  checkTransferId = async (transferId: string) => {
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      this.logger.warn(`transfer id "${transferId}" not found in db`)
      return
    }
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
    const logger = this.logger.create({ id: transferId })
    const sourceL2Bridge = this.bridge as L2Bridge
    const destBridge = this.getSiblingWatcherByChainId(destinationChainId)
      .bridge

    await this.waitTimeout(transferId, destinationChainId)

    const bondedAmount = await destBridge.getTotalBondedWithdrawalAmountForTransferId(transferId)
    if (bondedAmount.gt(0)) {
      logger.warn('transfer already bonded. Adding to db and skipping')
      const event = await destBridge.getBondedWithdrawalEvent(transferId)
      if (event) {
        const { transactionHash } = event
        const { from: sender } = await destBridge.getTransaction(
          event.transactionHash
        )
        await this.db.transfers.update(transferId, {
          withdrawalBonded: true,
          withdrawalBonder: sender,
          withdrawalBondedTxHash: transactionHash
        })
      } else {
        logger.warn(`event not found. transferId: ${transferId}`)
      }
      return
    }

    const availableCredit = await this.getAvailableCreditForTransfer(destinationChainId, amount)
    if (availableCredit.lt(amount)) {
      logger.warn(
        `not enough credit to bond withdrawal. Have ${this.bridge.formatUnits(
          availableCredit
        )}, need ${this.bridge.formatUnits(amount)}`
      )
      await this.db.transfers.update(transferId, {
        withdrawalBondTxError: TxError.NotEnoughLiquidity
      })
      return
    }

    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping bondWithdrawalWatcher`)
      return
    }

    logger.debug('sending bondWithdrawal tx')

    const sourceTx = await sourceL2Bridge.getTransaction(
      transferSentTxHash
    )
    if (!sourceTx) {
      this.logger.warn(`source tx data for tx hash "${transferSentTxHash}" not found. Cannot proceed`)
      return
    }
    const { from: sender, data } = sourceTx
    const attemptSwap = this.bridge.shouldAttemptSwap(amountOutMin, deadline)
    if (attemptSwap && isL1ChainId(destinationChainId)) {
      await this.db.transfers.update(transferId, {
        isBondable: false
      })
      return
    }

    await this.db.transfers.update(transferId, {
      bondWithdrawalAttemptedAt: Date.now()
    })

    try {
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
        })
        .catch(async (err: Error) => {
          throw err
        })
    } catch (err) {
      logger.log(err.message)
      const isCallExceptionError = /The execution failed due to an exception/gi.test(err.message)
      if (isCallExceptionError) {
        await this.db.transfers.update(transferId, {
          withdrawalBondTxError: TxError.CallException
        })
      }
      if (err instanceof BonderFeeTooLowError) {
        let { withdrawalBondBackoffIndex } = await this.db.transfers.getByTransferId(transferId)
        if (!withdrawalBondBackoffIndex) {
          withdrawalBondBackoffIndex = 0
        }
        withdrawalBondBackoffIndex++
        await this.db.transfers.update(transferId, {
          withdrawalBondTxError: TxError.BonderFeeTooLow,
          withdrawalBondBackoffIndex
        })
        return
      }
      throw err
    }
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

    logger.debug('amount:', this.bridge.formatUnits(amount))
    logger.debug('recipient:', recipient)
    logger.debug('transferNonce:', transferNonce)
    logger.debug('bonderFee:', this.bridge.formatUnits(bonderFee))

    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    const {
      gasPrice,
      tokenUsdPrice,
      chainNativeTokenUsdPrice
    } = await this.getPricesNearTransferEvent(dbTransfer)
    logger.debug('gasPrice:', gasPrice.toString())
    logger.debug('tokenUsdPrice:', tokenUsdPrice)
    logger.debug('chainNativeTokenUsdPrice:', chainNativeTokenUsdPrice)

    if (attemptSwap) {
      logger.debug(
        `bondWithdrawalAndAttemptSwap destinationChainId: ${destinationChainId}`
      )
      const l2Bridge = this.getSiblingWatcherByChainId(destinationChainId)
        .bridge as L2Bridge
      return l2Bridge.bondWithdrawalAndAttemptSwap(
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        deadline,
        gasPrice,
        tokenUsdPrice,
        chainNativeTokenUsdPrice
      )
    } else {
      logger.debug(`bondWithdrawal chain: ${destinationChainId}`)
      const bridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
      return bridge.bondWithdrawal(
        recipient,
        amount,
        transferNonce,
        bonderFee,
        gasPrice,
        tokenUsdPrice,
        chainNativeTokenUsdPrice
      )
    }
  }

  async getPricesNearTransferEvent (dbTransfer: Transfer): Promise<any> {
    const { destinationChainId } = dbTransfer
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const tokenSymbol = this.tokenSymbol
    const chainNativeTokenSymbol = this.bridge.getChainNativeTokenSymbol(this.chainSlug)
    const transferSentTimestamp = dbTransfer?.transferSentTimestamp
    let gasPrice : BigNumber
    let tokenUsdPrice : number
    let chainNativeTokenUsdPrice : number
    if (transferSentTimestamp) {
      const gasPriceItem = await this.db.gasPrices.getNearest(destinationChain, transferSentTimestamp)
      if (gasPriceItem) {
        gasPrice = gasPriceItem.gasPrice
      }
      let tokenPriceItem = await this.db.tokenPrices.getNearest(tokenSymbol, transferSentTimestamp)
      if (tokenPriceItem) {
        tokenUsdPrice = tokenPriceItem.price
      }
      if (tokenSymbol === chainNativeTokenSymbol) {
        chainNativeTokenUsdPrice = tokenUsdPrice
      } else {
        tokenPriceItem = await this.db.tokenPrices.getNearest(chainNativeTokenSymbol, transferSentTimestamp)
        if (tokenPriceItem) {
          chainNativeTokenUsdPrice = tokenPriceItem.price
        }
      }
    }

    return {
      gasPrice,
      tokenUsdPrice,
      chainNativeTokenUsdPrice
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
      const bondedAmount = await bridge.getTotalBondedWithdrawalAmountForTransferId(
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

  // ORU -> L1: (credit - debit - OruToL1PendingAmount - OruToAllUnbondedTransferRoots) / 2
  //    - divide by 2 because `amount` gets added to OruToL1PendingAmount
  // nonORU -> L1: (credit - debit - OruToL1PendingAmount - OruToAllUnbondedTransferRoots)
  // L2 -> L2: (credit - debit)
  async getAvailableCreditForTransfer (destinationChainId: number, amount: BigNumber) {
    const availableCredit = await this.syncWatcher.getEffectiveAvailableCredit(destinationChainId)
    if (this.syncWatcher.isOruToL1(destinationChainId)) {
      return availableCredit.div(2)
    }

    return availableCredit
  }
}

export default BondWithdrawalWatcher
