import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L2Bridge from './classes/L2Bridge'
import Logger from 'src/logger'
import contracts from 'src/contracts'
import getRedundantRpcUrls from 'src/utils/getRedundantRpcUrls'
import getRpcProviderFromUrl from 'src/utils/getRpcProviderFromUrl'
import getTransferId from 'src/utils/getTransferId'
import isL1ChainId from 'src/utils/isL1ChainId'
import isNativeToken from 'src/utils/isNativeToken'
import { BigNumber, providers } from 'ethers'
import { BonderFeeTooLowError, NonceTooLowError, PreTransactionValidationError } from 'src/types/error'
import { GasCostTransactionType, TxError } from 'src/constants'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { Transfer, UnbondedSentTransfer } from 'src/db/TransfersDb'
import { bondWithdrawalBatchSize, config as globalConfig, zeroAvailableCreditTest } from 'src/config'
import { isExecutionError } from 'src/utils/isExecutionError'
import { promiseQueue } from 'src/utils/promiseQueue'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

export type SendBondWithdrawalTxParams = {
  transferId: string
  sender: string
  recipient: string
  amount: BigNumber
  transferNonce: string
  bonderFee: BigNumber
  attemptSwap: boolean
  destinationChainId: number
  amountOutMin: BigNumber
  deadline: BigNumber
  transferSentIndex: number
}

class BondWithdrawalWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: BondWithdrawalWatcher }

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'green',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    const fees = globalConfig?.fees?.[this.tokenSymbol]
    this.logger.log('bonder fees:', JSON.stringify(fees))
  }

  async pollHandler () {
    if (this.isL1) {
      return
    }
    await this.checkTransferSentFromDb()
  }

  async checkTransferSentFromDb () {
    const dbTransfers = await this.db.transfers.getUnbondedSentTransfers(await this.getFilterRoute())
    if (!dbTransfers.length) {
      this.logger.debug('no unbonded transfer db items to check')
      return
    }

    this.logger.info(
      `total unbonded transfers db items: ${dbTransfers.length}`
    )

    const listSize = 100
    const batchedDbTransfers = dbTransfers.slice(0, listSize)

    this.logger.info(
      `checking unbonded transfers db items ${batchedDbTransfers.length} (out of ${dbTransfers.length})`
    )

    await promiseQueue(batchedDbTransfers, async (dbTransfer: Transfer, i: number) => {
      const {
        transferId,
        destinationChainId,
        amount,
        withdrawalBondTxError
      } = dbTransfer
      const logger = this.logger.create({ id: transferId })
      logger.debug(`processing item ${i + 1}/${batchedDbTransfers.length} start`)
      logger.debug('checking db poll')
      const availableCredit = this.getAvailableCreditForTransfer(destinationChainId!)
      const notEnoughCredit = availableCredit.lt(amount!)
      const isUnbondable = notEnoughCredit && withdrawalBondTxError === TxError.NotEnoughLiquidity
      if (isUnbondable) {
        logger.warn(
          `invalid credit or liquidity. availableCredit: ${availableCredit.toString()}, amount: ${amount!.toString()}`,
          `withdrawalBondTxError: ${withdrawalBondTxError}`
        )
        logger.debug('db poll completed')
        return
      }

      try {
        logger.debug('checkTransferId start')
        await this.checkTransferId(transferId)
      } catch (err: any) {
        logger.error('checkTransferId error:', err)
      }

      logger.debug(`processing item ${i + 1}/${batchedDbTransfers.length} complete`)
      logger.debug('db poll completed')
    }, { concurrency: bondWithdrawalBatchSize, timeoutMs: 10 * 60 * 1000 })

    this.logger.debug('checkTransferSentFromDb completed')
  }

  async checkTransferId (transferId: string) {
    const dbTransfer = await this.db.transfers.getByTransferId(transferId) as UnbondedSentTransfer
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
      transferSentTxHash,
      transferSentIndex
    } = dbTransfer
    const logger: Logger = this.logger.create({ id: transferId })
    logger.debug('processing bondWithdrawal')
    logger.debug('amount:', amount && this.bridge.formatUnits(amount))
    logger.debug('recipient:', recipient)
    logger.debug('transferNonce:', transferNonce)
    logger.debug('bonderFee:', bonderFee && this.bridge.formatUnits(bonderFee))

    const sourceL2Bridge = this.bridge as L2Bridge
    const destBridge = this.getSiblingWatcherByChainId(destinationChainId)
      .bridge

    logger.debug('processing bondWithdrawal. checking isTransferIdSpent')
    const isTransferSpent = await destBridge.isTransferIdSpent(transferId)
    logger.debug(`processing bondWithdrawal. isTransferSpent: ${isTransferSpent?.toString()}`)
    if (isTransferSpent) {
      logger.warn('checkTransferId already bonded. marking item not found')
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }

    const isReceivingNativeToken = isNativeToken(destBridge.chainSlug, this.tokenSymbol)
    if (isReceivingNativeToken) {
      logger.debug('checkTransferId getIsRecipientReceivable')
      const isRecipientReceivable = await this.getIsRecipientReceivable(recipient, destBridge, logger)
      logger.debug(`processing bondWithdrawal. isRecipientReceivable: ${isRecipientReceivable}`)
      if (!isRecipientReceivable) {
        logger.warn('recipient cannot receive transfer. marking item not bondable')
        await this.db.transfers.update(transferId, { isBondable: false })
        return
      }
    }

    const availableCredit = this.getAvailableCreditForTransfer(destinationChainId)
    const notEnoughCredit = availableCredit.lt(amount)
    logger.debug(`processing bondWithdrawal. availableCredit: ${availableCredit.toString()}`)
    if (notEnoughCredit) {
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

    if (this.dryMode || globalConfig.emergencyDryMode) {
      logger.warn(`dry: ${this.dryMode}, emergencyDryMode: ${globalConfig.emergencyDryMode}, skipping bondWithdrawalWatcher`)
      return
    }

    await this.withdrawFromVaultIfNeeded(destinationChainId, amount)

    logger.debug('checkTransferId sourceL2Bridge.getTransaction')
    const sourceTx = await sourceL2Bridge.getTransaction(
      transferSentTxHash
    )
    if (!sourceTx) {
      logger.warn(`source tx data for tx hash "${transferSentTxHash}" not found. Cannot proceed`)
      return
    }
    if (!sourceTx.from) {
      logger.warn(`source tx data for tx hash "${transferSentTxHash}" does not have a from address. Cannot proceed`)
      return
    }
    const attemptSwapDuringBondWithdrawal = this.bridge.shouldAttemptSwapDuringBondWithdrawal(amountOutMin, deadline)
    if (attemptSwapDuringBondWithdrawal && isL1ChainId(destinationChainId)) {
      logger.debug('marking as unbondable. Destination is L1 and attemptSwap is true')
      await this.db.transfers.update(transferId, {
        isBondable: false
      })
      return
    }

    logger.debug('attempting to send bondWithdrawal tx')

    await this.db.transfers.update(transferId, {
      bondWithdrawalAttemptedAt: Date.now()
    })

    try {
      logger.debug('checkTransferId isBonderFeeOk')
      const transactionType = attemptSwapDuringBondWithdrawal ? GasCostTransactionType.BondWithdrawalAndAttemptSwap : GasCostTransactionType.BondWithdrawal
      const isBonderFeeOk = await this.getIsFeeOk(transferId, transactionType)
      if (!isBonderFeeOk) {
        const msg = 'Total bonder fee is too low. Cannot bond withdrawal.'
        logger.warn(msg)
        this.notifier.warn(msg)
        throw new BonderFeeTooLowError(msg)
      }

      logger.debug('checkTransferId sendBondWithdrawalTx')
      const tx = await this.sendBondWithdrawalTx({
        transferId,
        sender: sourceTx.from,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        attemptSwap: attemptSwapDuringBondWithdrawal,
        destinationChainId,
        amountOutMin,
        deadline,
        transferSentIndex
      })

      const sentChain = attemptSwapDuringBondWithdrawal ? `destination chain ${destinationChainId}` : 'L1'
      const msg = `sent bondWithdrawal on ${sentChain} (source chain ${sourceChainId}) tx: ${tx.hash} transferId: ${transferId}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err: any) {
      logger.error('sendBondWithdrawalTx error:', err.message)
      const isUnbondableError = /Blacklistable: account is blacklisted/i.test(err.message)
      if (isUnbondableError) {
        logger.debug(`marking as unbondable due to error: ${err.message}`)
        await this.db.transfers.update(transferId, {
          isBondable: false
        })
      }

      const isCallExceptionError = isExecutionError(err.message)
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
      if (err instanceof NonceTooLowError) {
        logger.error('nonce too low. trying again.')
        await this.db.transfers.update(transferId, {
          bondWithdrawalAttemptedAt: 0
        })
      }
      if (err instanceof PreTransactionValidationError) {
        logger.error('pre transaction validation error. turning off writes.')
        globalConfig.emergencyDryMode = true
      }
      throw err
    }
  }

  async sendBondWithdrawalTx (params: SendBondWithdrawalTxParams): Promise<providers.TransactionResponse> {
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

    await this.preTransactionValidation(params)

    if (attemptSwap) {
      logger.debug(
        `bondWithdrawalAndAttemptSwap destinationChainId: ${destinationChainId}`
      )
      const l2Bridge = this.getSiblingWatcherByChainId(destinationChainId)
        .bridge as L2Bridge
      logger.debug('checkTransferId l2Bridge.bondWithdrawalAndAttemptSwap')
      return await l2Bridge.bondWithdrawalAndAttemptSwap(
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        deadline
      )
    } else {
      // Redundantly verify that both amountOutMin and deadline are 0
      if (!(amountOutMin.eq(0) && deadline.eq(0))) {
        throw new Error('sendBondWithdrawalTx: amountOutMin and deadline must be 0 when calling bondWithdrawal')
      }
      logger.debug(`bondWithdrawal chain: ${destinationChainId}`)
      const bridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
      logger.debug('checkTransferId bridge.bondWithdrawal')
      return bridge.bondWithdrawal(
        recipient,
        amount,
        transferNonce,
        bonderFee
      )
    }
  }

  // L2 -> L1: (credit - debit - OruToL1PendingAmount - OruToAllUnbondedTransferRoots)
  // L2 -> L2: (credit - debit)
  getAvailableCreditForTransfer (destinationChainId: number) {
    return this.availableLiquidityWatcher.getEffectiveAvailableCredit(destinationChainId)
  }

  async withdrawFromVaultIfNeeded (destinationChainId: number, bondAmount: BigNumber) {
    if (!globalConfig.vault[this.tokenSymbol]?.[this.chainIdToSlug(destinationChainId)]?.autoWithdraw) {
      return
    }

    return await this.mutex.runExclusive(async () => {
      let availableCredit = this.getAvailableCreditForTransfer(destinationChainId)
      if (zeroAvailableCreditTest) {
        availableCredit = BigNumber.from(0)
      }
      const vaultBalance = this.availableLiquidityWatcher.getVaultBalance(destinationChainId)
      const shouldWithdraw = (availableCredit.sub(vaultBalance)).lt(bondAmount)
      this.logger.debug(`availableCredit: ${this.bridge.formatUnits(availableCredit)}, vaultBalance: ${this.bridge.formatUnits(vaultBalance)}, bondAmount: ${this.bridge.formatUnits(bondAmount)}, shouldWithdraw: ${shouldWithdraw}`)
      if (shouldWithdraw) {
        try {
          const msg = `attempting withdrawFromVaultAndStake. amount: ${this.bridge.formatUnits(vaultBalance)}`
          this.notifier.info(msg)
          this.logger.info(msg)
          const destinationWatcher = this.getSiblingWatcherByChainId(destinationChainId)
          await destinationWatcher.withdrawFromVaultAndStake(vaultBalance)
        } catch (err) {
          const errMsg = `withdrawFromVaultAndStake error: ${err.message}`
          this.notifier.error(errMsg)
          this.logger.error(errMsg)
          throw err
        }
      }
    })
  }

  async preTransactionValidation (txParams: SendBondWithdrawalTxParams): Promise<void> {
    // Perform this check as late as possible before the transaction is sent
    await this.validateDbExistence(txParams)
    await this.validateTransferSentIndex(txParams)
    await this.validateUniqueness(txParams)
    await this.validateLogsWithBackupRpc(txParams)
  }

  async validateDbExistence (txParams: SendBondWithdrawalTxParams): Promise<void> {
    // Validate DB existence with calculated transferId
    const calculatedDbTransfer = await this.getCalculatedDbTransfer(txParams)
    if (calculatedDbTransfer.transferId !== txParams.transferId) {
      throw new PreTransactionValidationError(`Calculated transferId (${calculatedDbTransfer?.transferId}) does not match transferId in db`)
    }
  }

  async validateTransferSentIndex (txParams: SendBondWithdrawalTxParams): Promise<void> {
    // Validate transferSentIndex is expected since it is not part of the transferId
    const calculatedDbTransfer = await this.getCalculatedDbTransfer(txParams)
    if (calculatedDbTransfer.transferSentIndex !== txParams.transferSentIndex) {
      throw new PreTransactionValidationError(`transferSentIndex (${txParams.transferSentIndex}) does not match transferSentIndex in db (${calculatedDbTransfer.transferSentIndex})`)
    }
  }

  async validateUniqueness (txParams: SendBondWithdrawalTxParams): Promise<void> {
    // Validate uniqueness for redundant reorg protection. A transferNonce should be seen exactly one time in the DB per source chain
    const txTransferNonce = txParams.transferNonce
    const dbTransfers: Transfer[] = await this.db.transfers.getTransfersFromWeek()
    const dbTransfersFromSource: Transfer[] = dbTransfers.filter(dbTransfer => dbTransfer.sourceChainId === this.bridge.chainId)
    const transfersWithExpectedTransferNonce: Transfer[] = dbTransfersFromSource.filter(dbTransfer => dbTransfer.transferNonce === txTransferNonce)
    if (transfersWithExpectedTransferNonce.length > 1) {
      throw new PreTransactionValidationError(`transferNonce (${txTransferNonce}) exists in multiple transfers in db`)
    }
    if (transfersWithExpectedTransferNonce.length === 0) {
      throw new PreTransactionValidationError(`transferNonce (${txTransferNonce}) does not exist in db`)
    }
  }

  async validateLogsWithBackupRpc (txParams: SendBondWithdrawalTxParams): Promise<void> {
    // Validate logs with backup RPC endpoint, if it exists
    const calculatedDbTransfer = await this.getCalculatedDbTransfer(txParams)
    const blockNumber = calculatedDbTransfer.transferSentBlockNumber

    const redundantRpcUrls = getRedundantRpcUrls(this.chainSlug) ?? []
    for (const redundantRpcUrl of redundantRpcUrls) {
      const redundantProvider = getRpcProviderFromUrl(redundantRpcUrl)

      // TODO: Better way to do this
      const l2Bridge = contracts.get(this.tokenSymbol, this.chainSlug)?.l2Bridge
      const events = await l2Bridge.connect(redundantProvider).queryFilter(
        l2Bridge.filters.TransferSent(),
        blockNumber,
        blockNumber
      )
      const eventParams = events.filter((x: any) => x.args.transferId === txParams.transferId)[0]
      if (!eventParams) {
        throw new PreTransactionValidationError(`TransferSent event not found for transferId ${txParams.transferId} at block ${blockNumber}`)
      }

      // TODO: better way to do this
      if (
        (eventParams.args.transferId !== txParams.transferId) ||
        (Number(eventParams.args.chainId) !== txParams.destinationChainId) ||
        (eventParams.args.recipient !== txParams.recipient) ||
        (eventParams.args.amount.toString() !== txParams.amount.toString()) ||
        (eventParams.args.transferNonce.toString() !== txParams.transferNonce.toString()) ||
        (eventParams.args.bonderFee.toString() !== txParams.bonderFee.toString()) ||
        (eventParams.args.amountOutMin.toString() !== txParams.amountOutMin.toString()) ||
        (eventParams.args.deadline.toString() !== txParams.deadline.toString()) ||
        (eventParams.args.index.toString() !== txParams.transferSentIndex.toString())
      ) {
        throw new PreTransactionValidationError(`TransferSent event does not match db. eventParams: ${JSON.stringify(eventParams)}, calculatedDbTransfer: ${JSON.stringify(calculatedDbTransfer)}`)
      }
    }
  }

  async getCalculatedDbTransfer (txParams: SendBondWithdrawalTxParams): Promise<Transfer> {
    const {
      destinationChainId,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline
    } = txParams

    const calculatedTransferId = getTransferId(destinationChainId, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline)
    return this.db.transfers.getByTransferId(calculatedTransferId)
  }
}

export default BondWithdrawalWatcher
