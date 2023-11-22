import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L2Bridge from './classes/L2Bridge'
import Logger from 'src/logger'
import contracts from 'src/contracts'
import getRedundantRpcUrls from 'src/utils/getRedundantRpcUrls'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import getTransferId from 'src/utils/getTransferId'
import isL1ChainId from 'src/utils/isL1ChainId'
import isNativeToken from 'src/utils/isNativeToken'
import { BigNumber, providers } from 'ethers'
import {
  BlockHashValidationError,
  BonderFeeTooLowError,
  BonderTooEarlyError,
  NonceTooLowError,
  PossibleReorgDetected,
  RedundantProviderOutOfSync,
  UnfinalizedTransferBondError
} from 'src/types/error'
import {
  BondThreshold,
  bondWithdrawalBatchSize,
  enableEmergencyMode,
  getBonderTotalStake,
  getNetworkCustomSyncType,
  config as globalConfig
} from 'src/config'
import {
  GasCostTransactionType,
  SyncType,
  TxError
} from 'src/constants'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { Transfer, UnbondedSentTransfer } from 'src/db/TransfersDb'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { isFetchExecutionError } from 'src/utils/isFetchExecutionError'
import { isFetchRpcServerError } from 'src/utils/isFetchRpcServerError'
import { promiseQueue } from 'src/utils/promiseQueue'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

export type SendBondWithdrawalTxParams = {
  transferId: string
  recipient: string
  amount: BigNumber
  transferNonce: string
  bonderFee: BigNumber
  attemptSwap: boolean
  destinationChainId: number
  amountOutMin: BigNumber
  deadline: BigNumber
  transferSentIndex: number
  isFinalized?: boolean
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
    let dbTransfers = await this.db.transfers.getUnbondedSentTransfers(await this.getFilterRoute())
    if (!dbTransfers.length) {
      this.logger.debug('no unbonded transfer db items to check')
      return
    }

    const numUnbondedSentTransfers = dbTransfers.length
    this.logger.info(`total unbonded transfers db items: ${numUnbondedSentTransfers}`)

    // Do this outside of parallelization since this relies on all transfers being processed
    const syncType = getNetworkCustomSyncType(this.chainSlug)
    dbTransfers = await this.filterTransfersBySyncType(dbTransfers, syncType)
    this.logger.info(`${numUnbondedSentTransfers - dbTransfers.length} out of ${numUnbondedSentTransfers} unbonded transfers db items filtered out by syncType ${syncType}`)

    const listSize = 100
    const batchedDbTransfers = dbTransfers.slice(0, listSize)

    this.logger.info(`checking unbonded transfers db items ${batchedDbTransfers.length} (out of ${dbTransfers.length})`)

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
          `withdrawalBondTxErr: ${withdrawalBondTxError}`
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
      transferSentIndex,
      isFinalized
    } = dbTransfer
    const logger: Logger = this.logger.create({ id: transferId })
    logger.debug('processing bondWithdrawal')
    logger.debug('amount:', amount && this.bridge.formatUnits(amount))
    logger.debug('recipient:', recipient)
    logger.debug('transferNonce:', transferNonce)
    logger.debug('bonderFee:', bonderFee && this.bridge.formatUnits(bonderFee))
    logger.debug('isFinalized:', isFinalized)

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

    logger.debug('checkTransferId sourceL2Bridge.getTransaction')
    const sourceTx = await sourceL2Bridge.getTransaction(
      transferSentTxHash
    )
    if (!sourceTx) {
      logger.warn(`source tx data for tx hash "${transferSentTxHash}" not found. marking item not found.`)
      await this.db.transfers.update(transferId, { isNotFound: true })
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
        recipient,
        amount,
        transferNonce,
        bonderFee,
        attemptSwap: attemptSwapDuringBondWithdrawal,
        destinationChainId,
        amountOutMin,
        deadline,
        transferSentIndex,
        isFinalized
      })

      const sentChain = attemptSwapDuringBondWithdrawal ? `destination chain ${destinationChainId}` : 'L1'
      const msg = `sent bondWithdrawal on ${sentChain} (source chain ${sourceChainId}) tx: ${tx.hash} transferId: ${transferId}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err: any) {
      logger.debug('sendBondWithdrawalTx err:', err.message)
      const isUnbondableError = /Blacklistable: account is blacklisted/i.test(err.message)
      if (isUnbondableError) {
        logger.debug(`marking as unbondable due to error: ${err.message}`)
        await this.db.transfers.update(transferId, {
          isBondable: false
        })
      }

      if (err instanceof BlockHashValidationError) {
        logger.debug('blockHash validation failed. marking item not found')
        await this.db.transfers.update(transferId, { isNotFound: true })
        return
      }

      const isCallExceptionError = isFetchExecutionError(err.message)
      if (isCallExceptionError) {
        await this.db.transfers.update(transferId, {
          withdrawalBondTxError: TxError.CallException
        })
        return
      }

      let withdrawalBondBackoffIndex = await this.db.transfers.getWithdrawalBondBackoffIndexForTransferId(transferId)
      if (err instanceof BonderFeeTooLowError) {
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
        return
      }
      if (err instanceof RedundantProviderOutOfSync) {
        logger.error('redundant provider out of sync. trying again.')
        withdrawalBondBackoffIndex++
        await this.db.transfers.update(transferId, {
          withdrawalBondTxError: TxError.RedundantRpcOutOfSync,
          withdrawalBondBackoffIndex
        })
        return
      }
      const isRpcError = isFetchRpcServerError(err.message)
      if (isRpcError) {
        logger.error('rpc server error. trying again.')
        withdrawalBondBackoffIndex++
        await this.db.transfers.update(transferId, {
          withdrawalBondTxError: TxError.RpcServerError,
          withdrawalBondBackoffIndex
        })
        return
      }
      if (err instanceof BonderTooEarlyError) {
        logger.debug('bond attempted too early. trying again.')
        // This error implies that an inclusion tx has not yet been executed. We want to try again
        // quickly since inclusion txs are on the order of seconds.
        await this.db.transfers.update(transferId, {
          bondWithdrawalAttemptedAt: 0
        })
        return
      }
      if (err instanceof UnfinalizedTransferBondError) {
        logger.error('unfinalized transfer bond error. trying again.')
        withdrawalBondBackoffIndex++
        await this.db.transfers.update(transferId, {
          withdrawalBondTxError: TxError.UnfinalizedTransferBondError,
          withdrawalBondBackoffIndex
        })
        return
      }
      if (err instanceof PossibleReorgDetected) {
        logger.error('possible reorg detected. turning off writes.')
        enableEmergencyMode()
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
      deadline,
      isFinalized
    } = params
    const logger = this.logger.create({ id: transferId })

    logger.debug('attempting to bond unfinalized transfer')
    await this.preTransactionValidation(params, isFinalized)

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

  private async filterTransfersBySyncType (dbTransfers: UnbondedSentTransfer[], syncType?: SyncType): Promise<UnbondedSentTransfer[]> {
    if (syncType === SyncType.Bonder) {
      return this.filterTransfersBySyncTypeBonder(dbTransfers)
    } else if (syncType === SyncType.Threshold) {
      return this.filterTransfersBySyncTypeThreshold(dbTransfers)
    } else {
      throw new Error(`Invalid syncType: ${syncType}`)
    }
  }

  private async filterTransfersBySyncTypeBonder (dbTransfers: UnbondedSentTransfer[]): Promise<UnbondedSentTransfer[]> {
    // Bonder sync type returns all finalized transfers
    return dbTransfers.filter(dbTransfer => dbTransfer.isFinalized)
  }

  private async filterTransfersBySyncTypeThreshold (dbTransfers: UnbondedSentTransfer[]): Promise<UnbondedSentTransfer[]> {
    // Threshold sync type returns all unfinalized transfers within the threshold plus all finalized transfers
    const finalizedTransfers: UnbondedSentTransfer[] = await this.filterTransfersBySyncTypeBonder(dbTransfers)

    const decimals = getTokenDecimals(this.tokenSymbol)
    const inFlightAmount: BigNumber = await this.getInFlightAmount()
    const bonderRiskAmount: BigNumber = this.getBonderRiskAmount()
    const amountWithinThreshold: BigNumber = bonderRiskAmount.sub(inFlightAmount)
    if (amountWithinThreshold.lt(0)) {
      this.logger.debug(`filterTransfersBySyncTypeThreshold: bonderRiskAmount (${formatUnits(bonderRiskAmount, decimals)}) is less than inFlightAmount (${formatUnits(inFlightAmount, decimals)})`)
      return finalizedTransfers
    }

    const unfinalizedTransfers: UnbondedSentTransfer[] = dbTransfers.filter(dbTransfer => !dbTransfer.isFinalized)
    if (!unfinalizedTransfers.length) {
      this.logger.debug('filterTransfersBySyncTypeThreshold: no unfinalized transfers')
      return finalizedTransfers
    }

    const availableLiquidityPerChain: Record<string, BigNumber> = {}
    let remainingAmountWithinThreshold: BigNumber = amountWithinThreshold
    const transfersWithinThreshold: UnbondedSentTransfer[] = []
    for (const unfinalizedTransfer of unfinalizedTransfers) {
      const { transferId, destinationChainId, amount, withdrawalBondTxError } = unfinalizedTransfer
      const logger = this.logger.create({ id: transferId })

      if (!destinationChainId || !amount) {
        logger.warn(`filterTransfersBySyncTypeThreshold: destinationChainId: ${destinationChainId}, amount: ${amount}`)
        continue
      }

      if (!availableLiquidityPerChain?.[destinationChainId]) {
        availableLiquidityPerChain[destinationChainId] = this.getAvailableCreditForTransfer(destinationChainId)
      }

      // Is there enough overall credit to bond
      const enoughCredit = availableLiquidityPerChain[destinationChainId].gte(amount)
      if (!enoughCredit) {
        logger.warn(`filterTransfersBySyncTypeThreshold: invalid credit or liquidity. availableCredit: ${availableLiquidityPerChain[destinationChainId].toString()}, amount: ${formatUnits(amount, decimals)}`)
        continue
      }

      // Is the bonder unable to bond it because the transfer amount is too high
      const isBondableAmount = withdrawalBondTxError !== TxError.NotEnoughLiquidity
      if (!isBondableAmount) {
        logger.warn(`filterTransfersBySyncTypeThreshold: isBondableAmount false, withdrawalBondTxError: ${withdrawalBondTxError}`)
        continue
      }

      // If the transfer has not been finalized, is it within the bond threshold
      const isWithinBondThreshold = amount.lte(remainingAmountWithinThreshold)
      if (!isWithinBondThreshold) {
        logger.warn(`filterTransfersBySyncTypeThreshold: amount is not within bond threshold, amount:, ${formatUnits(amount, decimals)}, remainingAmountWithinThreshold:, ${formatUnits(remainingAmountWithinThreshold, decimals)}`)
        continue
      } else {
        remainingAmountWithinThreshold = remainingAmountWithinThreshold.sub(amount)
      }

      availableLiquidityPerChain[destinationChainId] = availableLiquidityPerChain[destinationChainId].sub(amount)
      transfersWithinThreshold.push(unfinalizedTransfer)
    }

    return [
      ...finalizedTransfers,
      ...transfersWithinThreshold
    ]
  }

  private async getInFlightAmount (): Promise<BigNumber> {
    const inFlightTransfers: Transfer[] = await this.db.transfers.getInFlightTransfers()
    let inFlightAmount = BigNumber.from(0)
    for (const inFlightTransfer of inFlightTransfers) {
      if (!inFlightTransfer.amount) continue
      inFlightAmount = inFlightAmount.add(inFlightTransfer.amount)
    }
    return inFlightAmount
  }

  private getBonderRiskAmount (): BigNumber {
    const bonderTotalStake: number | undefined = getBonderTotalStake(this.tokenSymbol)
    if (!bonderTotalStake) {
      return BigNumber.from(0)
    }

    const bonderTotalStakeWei = parseUnits(bonderTotalStake.toString(), getTokenDecimals(this.tokenSymbol))
    return bonderTotalStakeWei.mul(BondThreshold).div(100)
  }

  async preTransactionValidation (txParams: SendBondWithdrawalTxParams, isFinalized?: boolean): Promise<void> {
    const logger = this.logger.create({ id: txParams.transferId })

    try {
      // Perform this check as late as possible before the transaction is sent
      logger.debug('validating db existence')
      await this.validateDbExistence(txParams)
      logger.debug('validating transferSent index')
      await this.validateTransferSentIndex(txParams)
      logger.debug('validating uniqueness')
      await this.validateUniqueness(txParams)
      logger.debug('validating logs with redundant rpcs')
      await this.validateLogsWithRedundantRpcs(txParams)
      logger.debug('validated transaction')
    } catch (err) {
      // Unfinalized transfers are not necessarily a reorg. Try again
      if (!isFinalized && err instanceof PossibleReorgDetected) {
        throw new UnfinalizedTransferBondError(err.message)
      }
      throw err
    }
  }

  async validateDbExistence (txParams: SendBondWithdrawalTxParams): Promise<void> {
    // Validate DB existence with calculated transferId
    const calculatedDbTransfer = await this.getCalculatedDbTransfer(txParams)
    if (!calculatedDbTransfer?.transferId || !txParams?.transferId) {
      throw new PossibleReorgDetected(`Calculated transferId (${calculatedDbTransfer?.transferId}) or transferId in txParams (${txParams?.transferId}) is falsy`)
    }
    if (calculatedDbTransfer.transferId !== txParams.transferId) {
      throw new PossibleReorgDetected(`Calculated transferId (${calculatedDbTransfer.transferId}) does not match transferId in db`)
    }
  }

  async validateTransferSentIndex (txParams: SendBondWithdrawalTxParams): Promise<void> {
    // Validate transferSentIndex is expected since it is not part of the transferId
    const calculatedDbTransfer = await this.getCalculatedDbTransfer(txParams)
    // Check for undefined since these values can be 0
    if (!calculatedDbTransfer?.transferSentIndex === undefined || !txParams?.transferSentIndex === undefined) {
      throw new PossibleReorgDetected(`Calculated transferSentIndex (${calculatedDbTransfer?.transferSentIndex}) or transferSentIndex in txParams (${txParams?.transferSentIndex}) is falsy`)
    }
    if (calculatedDbTransfer.transferSentIndex !== txParams.transferSentIndex) {
      throw new PossibleReorgDetected(`transferSentIndex (${txParams.transferSentIndex}) does not match transferSentIndex in db (${calculatedDbTransfer.transferSentIndex})`)
    }
  }

  async validateUniqueness (txParams: SendBondWithdrawalTxParams): Promise<void> {
    // Validate uniqueness for redundant reorg protection. A transferNonce should be seen exactly one time in the DB per source chain
    console.log('debugging0', txParams.transferId)
    const txTransferNonce = txParams.transferNonce
    console.log('debugging1', txParams.transferId)
    const dbTransfers: Transfer[] = await this.db.transfers.getTransfersFromDay()
    console.log('debugging2', txParams.transferId)
    const dbTransfersFromSource: Transfer[] = dbTransfers.filter(dbTransfer => dbTransfer.sourceChainId === this.bridge.chainId)
    console.log('debugging3', txParams.transferId)
    const transfersWithExpectedTransferNonce: Transfer[] = dbTransfersFromSource.filter(dbTransfer => dbTransfer.transferNonce === txTransferNonce)
    console.log('debugging4', txParams.transferId)
    if (transfersWithExpectedTransferNonce.length > 1) {
      console.log('debugging5', txParams.transferId)
      throw new PossibleReorgDetected(`transferNonce (${txTransferNonce}) exists in multiple transfers in db. Other transferIds: ${transfersWithExpectedTransferNonce.map(dbTransfer => dbTransfer.transferId)}`)
    }
    console.log('debugging6', txParams.transferId)
    if (transfersWithExpectedTransferNonce.length === 0) {
      console.log('debugging7', txParams.transferId)
      // If a transfer is marked as notFound because the event is missed, it will never get a transferSent timestamp. In
      // this case, there will be no subDbTimestamps for the item since that relies on the transferSentTimestamp and
      // therefore the item will not exist in getTransfersFromDay(). In this case, check the item exists in the DB
      // and validate that the transferNonce exists.
      const calculatedDbTransfer = await this.getCalculatedDbTransfer(txParams)
      console.log('debugging8', txParams.transferId)
      if (!calculatedDbTransfer?.transferNonce || calculatedDbTransfer.transferNonce !== txTransferNonce) {
        console.log('debugging9', txParams.transferId)
        throw new PossibleReorgDetected(`transferNonce (${txTransferNonce}) does not exist in db`)
      }
    }
  }

  async validateLogsWithRedundantRpcs (txParams: SendBondWithdrawalTxParams): Promise<void> {
    const logger = this.logger.create({ id: txParams.transferId })

    // Validate logs with redundant RPC endpoint, if it exists
    const calculatedDbTransfer = await this.getCalculatedDbTransfer(txParams)
    const blockNumber = calculatedDbTransfer?.transferSentBlockNumber
    if (!blockNumber) {
      // This might occur if an event is simply missed or not written to the DB. In this case, this is not necessarily a reorg, so throw a normal error
      throw new Error(`Calculated transferSentBlockNumber (${blockNumber}) is missing`)
    }

    const redundantRpcUrls = getRedundantRpcUrls(this.chainSlug) ?? []
    for (const redundantRpcUrl of redundantRpcUrls) {
      const l2Bridge = contracts.get(this.tokenSymbol, this.chainSlug)?.l2Bridge
      const filter = l2Bridge.filters.TransferSent(
        txParams.transferId,
        txParams.destinationChainId,
        txParams.recipient
      )
      const eventParams = await this.getRedundantRpcEventParams(
        logger,
        blockNumber,
        redundantRpcUrl,
        txParams.transferId,
        l2Bridge,
        filter,
        calculatedDbTransfer?.withdrawalBondBackoffIndex
      )
      if (!eventParams) {
        continue
      }
      if (
        (eventParams.args.transferId !== txParams.transferId) ||
        (Number(eventParams.args.chainId) !== txParams.destinationChainId) ||
        (eventParams.args.recipient.toLowerCase() !== txParams.recipient.toLowerCase()) ||
        (eventParams.args.amount.toString() !== txParams.amount.toString()) ||
        (eventParams.args.transferNonce.toString() !== txParams.transferNonce.toString()) ||
        (eventParams.args.bonderFee.toString() !== txParams.bonderFee.toString()) ||
        (eventParams.args.amountOutMin.toString() !== txParams.amountOutMin.toString()) ||
        (eventParams.args.deadline.toString() !== txParams.deadline.toString()) ||
        (eventParams.args.index.toString() !== txParams.transferSentIndex.toString())
      ) {
        throw new PossibleReorgDetected(`TransferSent event does not match db. eventParams: ${JSON.stringify(eventParams)}, calculatedDbTransfer: ${JSON.stringify(calculatedDbTransfer)}, redundantRpcUrl: ${redundantRpcUrl}, query filter: ${JSON.stringify(filter)}, calculatedDbTransfer.withdrawalBondBackoffIndex: ${calculatedDbTransfer?.withdrawalBondBackoffIndex}`)
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
    const dbTransfer = await this.db.transfers.getByTransferId(calculatedTransferId)
    if (!dbTransfer) {
      // This might occur if an event is simply missed or not written to the DB. In this case, this is not necessarily a reorg, so throw a normal error
      throw new Error(`dbTransfer not found for transferId ${calculatedTransferId}`)
    }
    return dbTransfer
  }
}

export default BondWithdrawalWatcher
