import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L2Bridge from './classes/L2Bridge'
import chalk from 'chalk'
import isL1 from 'src/utils/isL1'
import wait from 'src/utils/wait'
import { BigNumber, Contract, providers } from 'ethers'
import { BonderFeeTooLowError } from 'src/types/error'
import { Chain, TxError } from 'src/constants'
import { Transfer } from 'src/db/TransfersDb'
import { bondableChains } from 'src/config'

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
  lastAvailableCredit: { [sourceChainId: string]: { [destinationChainId: string]: BigNumber }} = {}

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
        sourceChainId,
        destinationChainId,
        amount,
        withdrawalBondTxError
      } = dbTransfer

      const lastAvailableCredit = this.lastAvailableCredit[sourceChainId][destinationChainId]
      if (
        (withdrawalBondTxError && withdrawalBondTxError === TxError.NotEnoughLiquidity) &&
        (lastAvailableCredit && lastAvailableCredit.lt(amount))
      ) {
        continue
      }

      promises.push(this.checkTransferId(transferId).catch(err => {
        this.logger.error(`checkTransferId error: ${err.message}`)
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
    const sourceChain = this.bridge.chainSlug
    const destinationChain = this.chainIdToSlug(destinationChainId)
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
      }
      return
    }

    let availableCredit = await destBridge.getAvailableCredit()
    const includePendingAmount = destinationChain === Chain.Ethereum && bondableChains.includes(sourceChain)
    if (includePendingAmount) {
      let pendingAmounts = BigNumber.from(0)
      for (const chain of bondableChains) {
        const watcher = this.getSiblingWatcherByChainSlug(chain)
        if (!watcher) {
          continue
        }
        const bridge = watcher.bridge as L2Bridge
        const pendingAmount = await bridge.getPendingAmountForChainId(destinationChainId)
        pendingAmounts = pendingAmounts.add(pendingAmount)
      }
      availableCredit = availableCredit.sub(pendingAmounts).sub(amount)
    }
    this.lastAvailableCredit[sourceChainId][destinationChainId] = availableCredit
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
    const attemptSwap = this.shouldAttemptSwap(dbTransfer)

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
      }
      throw err
    }
  }

  shouldAttemptSwap = (dbTransfer: Transfer): boolean => {
    return dbTransfer.deadline > 0 || dbTransfer.amountOutMin?.gt(0)
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
    if (attemptSwap && !isL1(this.chainIdToSlug(destinationChainId))) {
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
        deadline
      )
    } else {
      logger.debug(`bondWithdrawal chain: ${destinationChainId}`)
      const bridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
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
}

export default BondWithdrawalWatcher
