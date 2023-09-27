import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L2Bridge from './classes/L2Bridge'
import Logger from 'src/logger'
import contracts from 'src/contracts'
import getChainBridge from 'src/chains/getChainBridge'
import getDecodedValidationData from 'src/utils/getDecodedValidationData'
import getEncodedValidationData from 'src/utils/getEncodedValidationData'
import getRedundantRpcUrls from 'src/utils/getRedundantRpcUrls'
import getTransferId from 'src/utils/getTransferId'
import isL1ChainId from 'src/utils/isL1ChainId'
import isNativeToken from 'src/utils/isNativeToken'
import {
  AvgBlockTimeSeconds,
  BlockHashExpireBufferSec,
  Chain,
  GasCostTransactionType,
  NumStoredBlockHashes,
  TimeToIncludeOnL1Sec,
  TimeToIncludeOnL2Sec,
  TxError
} from 'src/constants'
import { BigNumber, Contract, providers } from 'ethers'
import {
  BonderFeeTooLowError,
  BonderTooEarlyError,
  NonceTooLowError,
  PossibleReorgDetected,
  RedundantProviderOutOfSync
} from 'src/types/error'
import { IChainBridge } from '../chains/IChainBridge'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { Transfer, UnbondedSentTransfer } from 'src/db/TransfersDb'
import {
  bondWithdrawalBatchSize,
  doesProxyAndValidatorExistForChain,
  enableEmergencyMode,
  getValidatorAddressForChain,
  config as globalConfig,
  zeroAvailableCreditTest
} from 'src/config'
import { getRpcProvider } from 'src/utils/getRpcProvider'
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
  transferSentTxHash?: string
  transferSentBlockNumber?: number
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
      transferSentBlockNumber,
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
        transferSentIndex,
        transferSentTxHash,
        transferSentBlockNumber
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

      const isCallExceptionError = isFetchExecutionError(err.message)
      if (isCallExceptionError) {
        await this.db.transfers.update(transferId, {
          withdrawalBondTxError: TxError.CallException
        })
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
        logger.error('bond attempted too early. trying again.')
        withdrawalBondBackoffIndex++
        await this.db.transfers.update(transferId, {
          withdrawalBondTxError: TxError.BondTooEarly,
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
      transferSentTxHash,
      transferSentBlockNumber
    } = params
    const logger = this.logger.create({ id: transferId })

    logger.debug('performing preTransactionValidation')
    await this.preTransactionValidation(params)

    let hiddenCalldata: string | undefined
    const destinationChainSlug = this.chainIdToSlug(destinationChainId)
    if (
      doesProxyAndValidatorExistForChain(this.tokenSymbol, destinationChainSlug) &&
      this.isProxyValidationImplementedForRoute(this.chainSlug, destinationChainSlug) &&
      transferSentTxHash &&
      transferSentBlockNumber
    ) {
      hiddenCalldata = await this.getHiddenCalldataForDestinationChain(destinationChainSlug, transferSentTxHash, transferSentBlockNumber)
      logger.debug(`hiddenCalldata: ${hiddenCalldata}`)
    }

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
        deadline,
        hiddenCalldata
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
        bonderFee,
        hiddenCalldata
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
    const logger = this.logger.create({ id: txParams.transferId })

    // Perform this check as late as possible before the transaction is sent
    logger.debug('validating db existence')
    await this.validateDbExistence(txParams)
    logger.debug('validating transferSent index')
    await this.validateTransferSentIndex(txParams)
    logger.debug('validating uniqueness')
    await this.validateUniqueness(txParams)
    logger.debug('validating logs with redundant rpcs')
    await this.validateLogsWithRedundantRpcs(txParams)
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
    const txTransferNonce = txParams.transferNonce
    const dbTransfers: Transfer[] = await this.db.transfers.getTransfersFromWeek()
    const dbTransfersFromSource: Transfer[] = dbTransfers.filter(dbTransfer => dbTransfer.sourceChainId === this.bridge.chainId)
    const transfersWithExpectedTransferNonce: Transfer[] = dbTransfersFromSource.filter(dbTransfer => dbTransfer.transferNonce === txTransferNonce)
    if (transfersWithExpectedTransferNonce.length > 1) {
      throw new PossibleReorgDetected(`transferNonce (${txTransferNonce}) exists in multiple transfers in db. Other transferIds: ${transfersWithExpectedTransferNonce.map(dbTransfer => dbTransfer.transferId)}`)
    }
    if (transfersWithExpectedTransferNonce.length === 0) {
      // If a transfer is marked as notFound because the event is missed, it will never get a transferSent timestamp. In
      // this case, there will be no subDbTimestamps for the item since that relies on the transferSentTimestamp and
      // therefore the item will not exist in getTransfersFromWeek(). In this case, check the item exists in the DB
      // and validate that the transferNonce exists.
      const calculatedDbTransfer = await this.getCalculatedDbTransfer(txParams)
      if (!calculatedDbTransfer?.transferNonce || calculatedDbTransfer.transferNonce !== txTransferNonce) {
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

  // Returns packed(address,data) without the leading 0x
  // The calldata will be undefined if the blockHash is no longer stored at the destination
  async getHiddenCalldataForDestinationChain (destinationChainSlug: string, l2TxHash: string, l2BlockNumber: number): Promise<string | undefined> {
    const sourceChainBridge: IChainBridge = getChainBridge(this.chainSlug)
    if (typeof sourceChainBridge.getL1InclusionTx !== 'function') {
      throw new Error(`sourceChainBridge getL1InclusionTx not implemented for chain ${this.chainSlug}`)
    }

    // If we know the blockhash is no longer stored, return
    const isHashStoredAppx = await this.isBlockHashStoredAtBlockNumberAppx(l2BlockNumber, destinationChainSlug)
    if (!isHashStoredAppx) {
      this.logger.debug('BlockHash no longer stored appx')
      return
    }

    this.logger.debug('getHiddenCalldataForDestinationChain: retrieving l1InclusionBlock')
    const l1InclusionTx: providers.TransactionReceipt | undefined = await sourceChainBridge.getL1InclusionTx(l2TxHash)
    if (!l1InclusionTx) {
      throw new BonderTooEarlyError(`l1InclusionTx not found for l2TxHash ${l2TxHash}, l2BlockNumber ${l2BlockNumber}`)
    }

    this.logger.debug(`getHiddenCalldataForDestinationChain: l1InclusionTx found ${l1InclusionTx.transactionHash}`)
    let inclusionTxInfo: providers.TransactionReceipt| undefined
    if (destinationChainSlug === Chain.Ethereum) {
      inclusionTxInfo = l1InclusionTx
    } else {
      this.logger.debug(`getHiddenCalldataForDestinationChain: getting blockInfo for l1InclusionTx ${l1InclusionTx.transactionHash} on destination chain ${destinationChainSlug}`)
      const destinationChainBridge: IChainBridge = getChainBridge(destinationChainSlug)
      if (typeof destinationChainBridge.getL2InclusionTx !== 'function') {
        throw new Error(`destinationChainBridge getL2InclusionTx not implemented for chain ${destinationChainSlug}`)
      }
      inclusionTxInfo = await destinationChainBridge.getL2InclusionTx(l1InclusionTx.transactionHash)
    }

    if (!inclusionTxInfo) {
      throw new BonderTooEarlyError(`inclusionTxInfo not found for l2TxHash ${l2TxHash}, l2BlockNumber ${l2BlockNumber}`)
    }
    this.logger.debug(`getHiddenCalldataForDestinationChain: inclusionTxInfo on destination chain ${destinationChainSlug}`)

    // TODO: Once inclusion watcher is implemented, move this to the top of this function so that the prior calls don't throw
    // Return if the blockHash is no longer stored at the destination
    const isHashStored = await this.isBlockHashStoredAtBlockNumber(inclusionTxInfo.blockNumber, destinationChainSlug)
    if (!isHashStored) {
      this.logger.debug(`block hash for block number ${inclusionTxInfo.blockNumber} is no longer stored at destination`)
      return
    }

    const validatorAddress = getValidatorAddressForChain(this.tokenSymbol, destinationChainSlug)
    const hiddenCalldata: string = getEncodedValidationData(
      validatorAddress,
      inclusionTxInfo.blockHash,
      inclusionTxInfo.blockNumber
    )

    await this.validateHiddenCalldata(hiddenCalldata, destinationChainSlug)
    return hiddenCalldata.slice(2)
  }

  async isBlockHashStoredAtBlockNumber (blockNumber: number, chainSlug: string): Promise<boolean> {
    // The current block should be within (256 - buffer) blocks of the decoded blockNumber
    const provider: providers.Provider = getRpcProvider(chainSlug)!
    const currentBlockNumber = await provider.getBlockNumber()
    const numBlocksToBuffer = AvgBlockTimeSeconds[chainSlug] * BlockHashExpireBufferSec
    const earliestBlockWithBlockHash = currentBlockNumber - (NumStoredBlockHashes + numBlocksToBuffer)
    if (blockNumber < earliestBlockWithBlockHash) {
      return false
    }
    return true
  }

  async validateHiddenCalldata (data: string, chainSlug: string) {
    // Call the contract so the transaction fails, if needed, prior to making it onchain
    const { blockHash, blockNumber } = getDecodedValidationData(data)
    const validatorAddress = getValidatorAddressForChain(this.tokenSymbol, chainSlug)
    if (!validatorAddress) {
      throw new Error(`validator address not found for chain ${chainSlug}`)
    }

    const provider: providers.Provider = getRpcProvider(chainSlug)!
    const validatorAbi = ['function isBlockHashValid(bytes32,uint256) view returns (bool)']
    const validatorContract = new Contract(validatorAddress, validatorAbi, provider)
    const isValid = await validatorContract.isBlockHashValid(blockHash, blockNumber)
    if (!isValid) {
      throw new Error(`blockHash ${blockHash} is not valid for blockNumber ${blockNumber} with validator ${validatorAddress}`)
    }
  }

  async isBlockHashStoredAtBlockNumberAppx (blockNumber: number, chainSlug: string): Promise<boolean> {
    // Get chain-specific constants
    const hashStorageTime = AvgBlockTimeSeconds[chainSlug] * NumStoredBlockHashes
    const fullInclusionTime = TimeToIncludeOnL1Sec[this.chainSlug] + TimeToIncludeOnL2Sec[chainSlug]

    // Get the expected bond time
    const provider: providers.Provider = getRpcProvider(this.chainSlug)!
    const sourceTxTimestamp = (await provider.getBlock(blockNumber)).timestamp
    const expectedBondTime = sourceTxTimestamp + fullInclusionTime

    // Compare values
    const currentTimestamp = (await provider.getBlock('latest')).timestamp
    if (currentTimestamp > expectedBondTime + hashStorageTime) {
      return false
    }
    return true
  }

  isProxyValidationImplementedForRoute (sourceChainSlug: string, destinationChainSlug: string): boolean {
    // Both a source and dest chain must implement proxy validation
    // If the dest is L1, then only the source needs to implement proxy validation

    const sourceChainBridge: IChainBridge = getChainBridge(sourceChainSlug)
    if (typeof sourceChainBridge.getL1InclusionTx !== 'function') {
      return false
    }

    if (destinationChainSlug === Chain.Ethereum) {
      return true
    }

    const destinationChainBridge: IChainBridge = getChainBridge(destinationChainSlug)
    if (typeof destinationChainBridge.getL2InclusionTx !== 'function') {
      return false
    }

    return true
  }
}

export default BondWithdrawalWatcher
