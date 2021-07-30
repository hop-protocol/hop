import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import chalk from 'chalk'
import { Chain, TxError } from 'src/constants'
import { Contract, providers } from 'ethers'
import { wait } from 'src/utils'

export interface Config {
  chainSlug: string
  tokenSymbol: string
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
      dryMode: config.dryMode
    })
  }

  async start () {
    this.logger.debug(
      `min bondWithdrawal amount: ${this.bridge.minAmount}`
    )
    this.logger.debug(
      `max bondWithdrawal amount: ${this.bridge.maxAmount}`
    )
    await super.start()
  }

  async pollHandler () {
    const initialSyncCompleted = this.isAllSiblingWatchersInitialSyncCompleted()
    if (!initialSyncCompleted) {
      return
    }
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
      const { transferId } = dbTransfer
      promises.push(this.checkTransferSent(transferId))
    }

    await Promise.all(promises)
  }

  checkTransferSent = async (transferId: string) => {
    const logger = this.logger.create({ id: transferId })

    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
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

    if (dbTransfer.transferRootId) {
      const l1Bridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum)
        .bridge as L1Bridge
      const transferRootConfirmed = await l1Bridge.isTransferRootIdConfirmed(
        destinationChainId,
        dbTransfer.transferRootId
      )
      if (transferRootConfirmed) {
        logger.warn('transfer root already confirmed. Cannot bond withdrawal')
        return
      }
    }

    await this.waitTimeout(transferId, destinationChainId)

    const bondedAmount = await destBridge.getBondedWithdrawalAmount(transferId)
    if (bondedAmount.gt(0)) {
      logger.warn('transfer already bonded. Adding to db and skipping')
      const event = await destBridge.getBondedWithdrawalEvent(transferId)
      const { transactionHash } = event
      const { from: sender } = await destBridge.getTransaction(
        event.transactionHash
      )
      await this.db.transfers.update(transferId, {
        withdrawalBonded: true,
        withdrawalBonder: sender,
        withdrawalBondedTxHash: transactionHash
      })
      return
    }

    if (this.dryMode) {
      logger.warn('dry mode: skipping bondWithdrawalWatcher transaction')
      return
    }

    logger.debug('sending bondWithdrawal tx')

    const { from: sender, data } = await sourceL2Bridge.getTransaction(
      transferSentTxHash
    )
    const { attemptSwap } = await sourceL2Bridge.decodeSendData(data)

    await this.db.transfers.update(transferId, {
      sentBondWithdrawalTxAt: Date.now()
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
          if (receipt.status !== 1) {
            await this.db.transfers.update(transferId, {
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

          await this.db.transfers.update(transferId, {
            withdrawalBonded: true,
            withdrawalBondedTxHash: receipt.transactionHash
          })
        })
        .catch(async (err: Error) => {
          await this.db.transfers.update(transferId, {
            sentBondWithdrawalTxAt: 0
          })

          throw err
        })
    } catch (err) {
      const isCallExceptionError = /The execution failed due to an exception/gi.test(err.message)
      if (isCallExceptionError) {
        await this.db.transfers.update(transferId, {
          withdrawalBondTxError: TxError.CallException
        })
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
    if (attemptSwap) {
      logger.debug(
        `bondWithdrawalAndAttemptSwap destinationChainId: ${destinationChainId}`
      )
      const l2Bridge = this.getSiblingWatcherByChainId(destinationChainId)
        .bridge as L2Bridge
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
