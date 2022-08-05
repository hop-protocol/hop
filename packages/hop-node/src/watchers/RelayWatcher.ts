import '../moduleAlias'
import ArbitrumBridgeWatcher from './ArbitrumBridgeWatcher'
import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import getTransferSentToL2TransferId from 'src/utils/getTransferSentToL2TransferId'
import isNativeToken from 'src/utils/isNativeToken'
import { providers } from 'ethers'
import { RelayerFeeTooLowError, NonceTooLowError } from 'src/types/error'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Transfer, UnrelayedSentTransfer } from 'src/db/TransfersDb'
import { GasCostTransactionType, TxError } from 'src/constants'
import { relayTransactionBatchSize } from 'src/config'
import { isExecutionError } from 'src/utils/isExecutionError'
import { promiseQueue } from 'src/utils/promiseQueue'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class RelayWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: RelayWatcher }
  relayWatcher : ArbitrumBridgeWatcher

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'green',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
    this.relayWatcher = new ArbitrumBridgeWatcher({
      chainSlug: config.chainSlug,
      tokenSymbol: this.tokenSymbol,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })
  }

  async pollHandler () {
    if (this.isL1) {
      return
    }
    await this.checkTransferSentToL2FromDb()
  }

  async checkTransferSentToL2FromDb () {
    const dbTransfers = await this.db.transfers.getUnrelayedSentTransfers(await this.getFilterRoute())
    if (!dbTransfers.length) {
      this.logger.debug('no unrelayed transfer db items to check')
      return
    }

    this.logger.info(
      `total unrelayed transfers db items: ${dbTransfers.length}`
    )

    const listSize = 100
    const batchedDbTransfers = dbTransfers.slice(0, listSize)

    this.logger.info(
      `checking unrelayed transfers db items ${batchedDbTransfers.length} (out of ${dbTransfers.length})`
    )

    await promiseQueue(batchedDbTransfers, async (dbTransfer: Transfer, i: number) => {
      const {
        transferId
      } = dbTransfer
      const logger = this.logger.create({ id: transferId })
      logger.debug(`processing item ${i + 1}/${batchedDbTransfers.length} start`)
      logger.debug('checking db poll')

      try {
        logger.debug('checkTransferSentToL2 start')
        await this.checkTransferSentToL2(transferId)
      } catch (err: any) {
        logger.error('checkTransferSentToL2 error:', err)
      }

      logger.debug(`processing item ${i + 1}/${batchedDbTransfers.length} complete`)
      logger.debug('db poll completed')
    }, { concurrency: relayTransactionBatchSize, timeoutMs: 10 * 60 * 1000 })

    this.logger.debug('checkTransferSentFromDb completed')
  }

  async checkTransferSentToL2 (transferId: string) {
    const dbTransfer = await this.db.transfers.getByTransferId(transferId) as UnrelayedSentTransfer
    if (!dbTransfer) {
      this.logger.warn(`transfer id "${transferId}" not found in db`)
      return
    }
    const {
      sourceChainId,
      destinationChainId,
      recipient,
      amount,
      relayer,
      relayerFee,
      amountOutMin,
      deadline,
      transferSentTxHash
    } = dbTransfer
    const logger: Logger = this.logger.create({ id: transferId })
    logger.debug('processing relay')
    logger.debug('amount:', amount && this.bridge.formatUnits(amount))
    logger.debug('recipient:', recipient)
    logger.debug('relayer:', relayer)
    logger.debug('relayerFee:', relayerFee && this.bridge.formatUnits(relayerFee))

    const destBridge = this.getSiblingWatcherByChainId(destinationChainId)
      .bridge

    const bonderAddress = await destBridge.getBonderAddress()
    const isCorrectRelayer = bonderAddress.toLowerCase() === relayer.toLowerCase()
    if (!isCorrectRelayer) {
      logger.warn('relayer is not correct. marking item not relayable')
      await this.db.transfers.update(transferId, { isRelayable: false })
      return
    }

    const isReceivingNativeToken = isNativeToken(destBridge.chainSlug, this.tokenSymbol)
    if (isReceivingNativeToken) {
      logger.debug('checkTransferSentToL2 getIsRecipientReceivable')
      const isRecipientReceivable = await this.getIsRecipientReceivable(recipient, destBridge, logger)
      logger.debug(`processing redemption. isRecipientReceivable: ${isRecipientReceivable}`)
      if (!isRecipientReceivable) {
        logger.warn('recipient cannot receive transfer. marking item not relayable')
        await this.db.transfers.update(transferId, { isRelayable: false })
        return
      }
    }

    if (this.dryMode) {
      logger.warn(`dry: ${this.dryMode}, skipping relayWatcher`)
      return
    }

    logger.debug('attempting to send redemption tx')

    await this.db.transfers.update(transferId, {
      relayAttemptedAt: Date.now()
    })

    try {
      logger.debug('checkTransferSentToL2 getIsRelayerFeeOk')
      const isRelayerFeeOk = await this.getIsFeeOk(transferId, GasCostTransactionType.Relay)
      if (!isRelayerFeeOk) {
        const msg = 'Relayer fee is too low. Cannot relay.'
        logger.debug(msg)
        throw new RelayerFeeTooLowError(msg)
      }

      logger.debug('checkTransferSentToL2 sentRedemptionTx')
      const tx = await this.sendRedemptionTx({
        transferId,
        destinationChainId,
        recipient,
        amount,
        amountOutMin,
        deadline,
        relayer,
        relayerFee,
        transferSentTxHash
      })

      const msg = `sent redemption on ${destinationChainId} (source chain ${sourceChainId}) tx: ${tx.hash} transferId: ${transferId}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err: any) {
      logger.error('redemptionTx error:', err.message)
      const isUnrelayableError = /Blacklistable: account is blacklisted/i.test(err.message)
      if (isUnrelayableError) {
        logger.debug(`marking as unrelayable due to error: ${err.message}`)
        await this.db.transfers.update(transferId, {
          isRelayable: false
        })
      }

      const isCallExceptionError = isExecutionError(err.message)
      if (isCallExceptionError) {
        await this.db.transfers.update(transferId, {
          relayTxError: TxError.CallException
        })
      }
      if (err instanceof RelayerFeeTooLowError) {
        let { relayBackoffIndex } = await this.db.transfers.getByTransferId(transferId)
        if (!relayBackoffIndex) {
          relayBackoffIndex = 0
        }
        relayBackoffIndex++
        await this.db.transfers.update(transferId, {
          relayTxError: TxError.RelayerFeeTooLow,
          relayBackoffIndex
        })
        return
      }
      if (err instanceof NonceTooLowError) {
        logger.error('nonce too low. trying again.')
        await this.db.transfers.update(transferId, {
          relayAttemptedAt: 0
        })
      }
      throw err
    }
  }

  async sendRedemptionTx (params: any): Promise<providers.TransactionResponse> {
    const {
      transferId,
      destinationChainId,
      recipient,
      amount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      transferSentTxHash
    } = params
    const logger = this.logger.create({ id: transferId })
    const calculatedTransferId = getTransferSentToL2TransferId(destinationChainId, recipient, amount, amountOutMin, deadline, relayer, relayerFee, transferSentTxHash)
    const doesExistInDb = !!(await this.db.transfers.getByTransferId(calculatedTransferId))
    if (!doesExistInDb) {
      throw new Error(`Calculated transferId (${calculatedTransferId}) does not match transferId in db`)
    }

    logger.debug(
      `relay destinationChainId: ${destinationChainId}`
    )
    logger.debug('checkTransferSentToL2 l2Bridge.distribute')
    return await this.relayWatcher.redeemArbitrumTransaction(transferSentTxHash)
  }
}

export default RelayWatcher
