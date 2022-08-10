import '../moduleAlias'
import ArbitrumBridgeWatcher from './ArbitrumBridgeWatcher'
import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import getTransferSentToL2TransferId from 'src/utils/getTransferSentToL2TransferId'
import isNativeToken from 'src/utils/isNativeToken'
import { GasCostTransactionType, TxError } from 'src/constants'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { NonceTooLowError, RelayerFeeTooLowError } from 'src/types/error'
import { RelayableTransferRoots } from 'src/db/TransferRootsDb'
import { Transfer, UnrelayedSentTransfer } from 'src/db/TransfersDb'
import { isExecutionError } from 'src/utils/isExecutionError'
import { promiseQueue } from 'src/utils/promiseQueue'
import { providers } from 'ethers'
import { relayTransactionBatchSize } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class RelayWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: RelayWatcher }
  relayWatcher: ArbitrumBridgeWatcher

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'redBright',
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
    const promises: Array<Promise<any>> = []

    promises.push(
      this.checkTransferSentToL2FromDb(),
      this.checkRelayableTransferRootsFromDb()
    )
    await Promise.all(promises)
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

  async checkRelayableTransferRootsFromDb () {
    const dbTransferRoots = await this.db.transferRoots.getRelayableTransferRoots(await this.getFilterRoute())
    if (!dbTransferRoots.length) {
      this.logger.debug('no relayable transfer root db items to check')
      return
    }

    this.logger.info(
        `checking ${dbTransferRoots.length} unrelayed transfer roots db items`
    )

    const promises: Array<Promise<any>> = []
    for (const dbTransferRoot of dbTransferRoots) {
      const { transferRootId } = dbTransferRoot
      promises.push(this.checkRelayableTransferRoots(transferRootId))
    }

    await Promise.all(promises)
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
      transferSentTimestamp,
      transferSentTxHash
    } = dbTransfer
    const logger: Logger = this.logger.create({ id: transferId })
    logger.debug('processing transfer relay')
    logger.debug('amount:', amount && this.bridge.formatUnits(amount))
    logger.debug('recipient:', recipient)
    logger.debug('relayer:', relayer)
    logger.debug('relayerFee:', relayerFee && this.bridge.formatUnits(relayerFee))

    const destBridge = this.getSiblingWatcherByChainId(destinationChainId)
      .bridge

    const l1ToL2Messages = await this.relayWatcher.getL1ToL2Messages(transferSentTxHash)
    let messageIndex = 0
    if (l1ToL2Messages.length > 1) {
      messageIndex = await this.getMessageIndex(transferId, transferSentTxHash, transferSentTimestamp)
    }

    logger.debug('processing transfer relay. checking isRelayComplete')
    const isRelayComplete = await destBridge.isTransactionRedeemed(transferSentTxHash)
    logger.debug(`processing bondWithdrawal. isRelayComplete: ${isRelayComplete?.toString()}`)
    if (isRelayComplete) {
      logger.warn('checkTransferSentToL2 already complete. marking item not found')
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }

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
      const tx = await this.sendTransferRelayTx({
        transferId,
        destinationChainId,
        recipient,
        amount,
        amountOutMin,
        deadline,
        relayer,
        relayerFee,
        transferSentTxHash,
        messageIndex
      })

      // This will not work as intended if the process restarts after the tx is sent but before this is executed.
      // This is expected because we cannot watch for the event because it does not emit enough info for a unique DB entry
      // since the L1 to L2 transferId relies on the L1 transaction hash. If the server does restart, we will be alerted
      // that a tx has not been relayed and we can investigate the status.
      await this.db.transfers.update(transferId, {
        transferFromL1Complete: true,
        transferFromL1CompleteTxHash: tx.hash
      })

      const msg = `sent redemption on ${destinationChainId} (source chain ${sourceChainId}) tx: ${tx.hash} transferId: ${transferId}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err: any) {
      // For this watcher, we will always mark the transfer as incomplete if the process gets here
      await this.db.transfers.update(transferId, {
        transferFromL1Complete: false,
        transferFromL1CompleteTxHash: undefined
      })

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

  async checkRelayableTransferRoots (transferRootId: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId) as RelayableTransferRoots
    if (!dbTransferRoot) {
      this.logger.warn(`transferRoot id "${transferRootId}" not found in db`)
      return
    }
    const {
      transferRootHash,
      totalAmount,
      destinationChainId
    } = dbTransferRoot

    const logger = this.logger.create({ root: transferRootId })

    // bondedTxHash should be checked first because a root can have both but it should be bonded prior to being confirmed
    const l1TxHash = dbTransferRoot?.bondTxHash ?? dbTransferRoot?.confirmTxHash

    logger.debug('processing transfer root relay')
    logger.debug('transferRootHash:', transferRootHash)
    logger.debug('totalAmount:', totalAmount)
    logger.debug('destinationChainId:', destinationChainId)
    logger.debug('l1txHash:', l1TxHash)

    const isSet = await this.bridge.isTransferRootSet(transferRootHash, totalAmount)
    if (isSet) {
      logger.warn('checkRelayableTransferRoots already set. marking item not found.')
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    if (this.dryMode) {
      logger.warn(`dry: ${this.dryMode}, skipping bondTransferRoot`)
      return
    }

    logger.debug(
      `attempting to relay root id ${transferRootId} with destination chain ${destinationChainId} and l1TxHash ${l1TxHash}`
    )

    await this.db.transferRoots.update(transferRootId, {
      sentRelayTxAt: Date.now()
    })

    try {
      const tx = await this.sendTransferRootRelayTx(
        transferRootId,
        l1TxHash!
      )
      const msg = `transferRootSet dest ${destinationChainId}, tx ${tx.hash} transferRootHash: ${transferRootHash}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err) {
      logger.error('transferRootSet error:', err.message)
      throw err
    }
  }

  async sendTransferRelayTx (params: any): Promise<providers.TransactionResponse> {
    const {
      transferId,
      destinationChainId,
      recipient,
      amount,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      transferSentTxHash,
      logIndex,
      messageIndex
    } = params
    const logger = this.logger.create({ id: transferId })
    const calculatedTransferId = getTransferSentToL2TransferId(destinationChainId, recipient, amount, amountOutMin, deadline, relayer, relayerFee, transferSentTxHash, logIndex)
    const doesExistInDb = !!(await this.db.transfers.getByTransferId(calculatedTransferId))
    if (!doesExistInDb) {
      throw new Error(`Calculated transferId (${calculatedTransferId}) does not match transferId in db`)
    }

    logger.debug(
      `relay transfer destinationChainId: ${destinationChainId} with messageIndex ${messageIndex}`
    )
    logger.debug('checkTransferSentToL2 l2Bridge.distribute')
    return await this.sendRelayTx(transferSentTxHash, messageIndex)
  }

  async sendTransferRootRelayTx (transferRootId: string, txHash: string): Promise<providers.TransactionResponse> {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug(
      'relay root destinationChainId'
    )
    logger.debug('checkRelayableTransferRoots l2Bridge.distribute')
    return await this.sendRelayTx(txHash)
  }

  async sendRelayTx (txHash: string, messageIndex: number = 0): Promise<providers.TransactionResponse> {
    return await this.relayWatcher.redeemArbitrumTransaction(txHash, messageIndex)
  }

  async getMessageIndex (transferId: string, transferSentTxHash: string, transferSentTimestamp: number): Promise<number> {
    // We need to deterministically order all the messages in an L1 tx, even if they have already been relayed
    const dateFilter = {
      fromUnix: transferSentTimestamp,
      toUnix: transferSentTimestamp
    }
    const transfers: Transfer[] = await this.db.transfers.getTransfers(dateFilter)

    const logIndicesPerTransferId: Record<string, number> = {}
    for (const transfer of transfers) {
      if (transfer.transferSentTxHash !== transferSentTxHash) continue
      logIndicesPerTransferId[transfer.transferId] = transfer.transferSentLogIndex!
    }

    const entries = Object.entries(logIndicesPerTransferId)
    const sortedTransferIdsAndIndices = entries.sort((a, b) => a[1] - b[1])

    let count = 0
    for (const sortedTransferIdAndIndex of sortedTransferIdsAndIndices) {
      if (sortedTransferIdAndIndex[0] === transferId) break
      count++
    }

    return count
  }
}

export default RelayWatcher
