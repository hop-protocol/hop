import '../moduleAlias'
import BNMin from 'src/utils/BNMin'
import BaseWatcher from './classes/BaseWatcher'
import Bridge from './classes/Bridge'
import L2Bridge from './classes/L2Bridge'
import Logger from 'src/logger'
import isL1ChainId from 'src/utils/isL1ChainId'
import isNativeToken from 'src/utils/isNativeToken'
import { BigNumber, constants } from 'ethers'
import { BonderFeeTooLowError, NonceTooLowError } from 'src/types/error'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Transfer, UnbondedSentTransfer } from 'src/db/TransfersDb'
import { TxError } from 'src/constants'
import { bondWithdrawalBatchSize, config as globalConfig } from 'src/config'
import { isExecutionError } from 'src/utils/isExecutionError'
import { promiseQueue } from 'src/utils/promiseQueue'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
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
      transferSentTxHash
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

    if (this.dryMode) {
      logger.warn(`dry: ${this.dryMode}, skipping bondWithdrawalWatcher`)
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
    const { from: sender, data } = sourceTx
    const attemptSwap = this.bridge.shouldAttemptSwap(amountOutMin, deadline)
    if (attemptSwap && isL1ChainId(destinationChainId)) {
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
      logger.debug('checkTransferId getIsBonderFeeOk')
      const isBonderFeeOk = await this.getIsBonderFeeOk(transferId, attemptSwap)
      if (!isBonderFeeOk) {
        const msg = 'Total bonder fee is too low. Cannot bond withdrawal.'
        logger.debug(msg)

        // TODO: remove this after a week since it was added because it's handled in SyncWatcher
        const isTooLow = this.syncWatcher.isBonderFeeTooLow(bonderFee)
        if (isTooLow) {
          logger.debug('marking as unbondable because fee is too low')
          await this.db.transfers.update(transferId, {
            isBondable: false
          })
        }

        throw new BonderFeeTooLowError(msg)
      }

      logger.debug('checkTransferId sendBondWithdrawalTx')
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

      const sentChain = attemptSwap ? `destination chain ${destinationChainId}` : 'L1'
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
      throw err
    }
  }

  async sendBondWithdrawalTx (params: any) {
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

  async getIsBonderFeeOk (
    transferId: string,
    attemptSwap: boolean
  ): Promise<boolean> {
    const logger = this.logger.create({ id: transferId })
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      throw new Error('expected db transfer item')
    }

    const { amount, bonderFee, sourceChainId, destinationChainId } = dbTransfer
    if (!amount || !bonderFee || !sourceChainId || !destinationChainId) {
      throw new Error('expected complete dbTransfer data')
    }
    const sourceChain = this.chainIdToSlug(sourceChainId)
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const transferSentTimestamp = dbTransfer?.transferSentTimestamp
    if (!transferSentTimestamp) {
      throw new Error('expected transferSentTimestamp')
    }

    const now = Math.floor(Date.now() / 1000)
    const nearestItemToTransferSent = await this.db.gasCost.getNearest(destinationChain, this.tokenSymbol, attemptSwap, transferSentTimestamp)
    const nearestItemToNow = await this.db.gasCost.getNearest(destinationChain, this.tokenSymbol, attemptSwap, now)
    let gasCostInToken: BigNumber
    let minBonderFeeAbsolute: BigNumber

    const sourceL2Bridge = this.getSiblingWatcherByChainSlug(sourceChain).bridge as L2Bridge
    const onChainBonderFeeAbsolute = await sourceL2Bridge.getOnChainMinBonderFeeAbsolute()

    if (nearestItemToTransferSent && nearestItemToNow) {
      ({ gasCostInToken, minBonderFeeAbsolute } = nearestItemToTransferSent)
      const { gasCostInToken: currentGasCostInToken, minBonderFeeAbsolute: currentMinBonderFeeAbsolute } = nearestItemToNow
      gasCostInToken = BNMin(gasCostInToken, currentGasCostInToken)
      minBonderFeeAbsolute = BNMin(minBonderFeeAbsolute, currentMinBonderFeeAbsolute)
      this.logger.debug('using nearestItemToTransferSent')
    } else if (nearestItemToNow) {
      ({ gasCostInToken, minBonderFeeAbsolute } = nearestItemToNow)
      this.logger.warn('nearestItemToTransferSent not found, using only nearestItemToNow')
    } else {
      throw new Error('expected nearestItemToTransferSent or nearestItemToNow')
    }

    minBonderFeeAbsolute = onChainBonderFeeAbsolute.gt(minBonderFeeAbsolute) ? onChainBonderFeeAbsolute : minBonderFeeAbsolute

    logger.debug('gasCostInToken:', gasCostInToken?.toString())
    logger.debug('minBonderFeeAbsolute:', minBonderFeeAbsolute?.toString())

    const minBpsFee = await this.bridge.getBonderFeeBps(destinationChain, amount, minBonderFeeAbsolute)
    const minTxFee = gasCostInToken.div(2)
    const minBonderFeeTotal = minBpsFee.add(minTxFee)
    const isBonderFeeOk = bonderFee.gte(minBonderFeeTotal)
    logger.debug(`bonderFee: ${bonderFee}, minBonderFeeTotal: ${minBonderFeeTotal}, minBpsFee: ${minBpsFee}, isBonderFeeOk: ${isBonderFeeOk}`)

    this.logAdditionalBonderFeeData(bonderFee, minBonderFeeTotal, minBpsFee, gasCostInToken, destinationChain, transferId, logger)
    return isBonderFeeOk
  }

  logAdditionalBonderFeeData (
    bonderFee: BigNumber,
    minBonderFeeTotal: BigNumber,
    minBpsFee: BigNumber,
    gasCostInToken: BigNumber,
    destinationChain: string,
    transferId: string,
    logger: Logger
  ) {
    // Log how much additional % is being paid
    const precision = this.bridge.parseEth('1')
    const bonderFeeOverage = bonderFee.mul(precision).div(minBonderFeeTotal)
    logger.debug(`dest: ${destinationChain}, bonder fee overage: ${this.bridge.formatEth(bonderFeeOverage)}`)

    // Log how much additional % is being paid without destination tx fee buffer
    const minBonderFeeWithoutBuffer = minBpsFee.add(gasCostInToken)
    const bonderFeeOverageWithoutBuffer = bonderFee.mul(precision).div(minBonderFeeWithoutBuffer)
    logger.debug(`dest: ${destinationChain}, bonder fee overage (without buffer): ${this.bridge.formatEth(bonderFeeOverageWithoutBuffer)}`)

    const expectedMinBonderFeeOverage = precision
    if (bonderFeeOverage.lt(expectedMinBonderFeeOverage)) {
      const msg = `Bonder fee too low. bonder fee overage: ${this.bridge.formatEth(bonderFeeOverage)}, bonderFee: ${bonderFee}, minBonderFeeTotal: ${minBonderFeeTotal}, token: ${this.bridge.tokenSymbol}, sourceChain: ${this.bridge.chainSlug}, destinationChain: ${destinationChain}, transferId: ${transferId}`
      logger.warn(msg)
      this.notifier.warn(msg)
    }
  }

  // L2 -> L1: (credit - debit - OruToL1PendingAmount - OruToAllUnbondedTransferRoots)
  // L2 -> L2: (credit - debit)
  getAvailableCreditForTransfer (destinationChainId: number) {
    return this.availableLiquidityWatcher.getEffectiveAvailableCredit(destinationChainId)
  }

  async getIsRecipientReceivable (recipient: string, destinationBridge: Bridge, logger: Logger) {
    // It has been verified that all chains have at least 1 wei at 0x0.
    const tx = {
      from: constants.AddressZero,
      to: recipient,
      value: '1'
    }

    try {
      await destinationBridge.provider.call(tx)
      return true
    } catch (err) {
      const isRevertError = isExecutionError(err.message)
      if (isRevertError) {
        logger.error(`getIsRecipientReceivable err: ${err.message}`)
        return false
      }
      logger.error(`getIsRecipientReceivable non-revert err: ${err.message}`)
      return true
    }
  }

  async withdrawFromVaultIfNeeded (destinationChainId: number, amount: BigNumber) {
    if (!isL1ChainId(destinationChainId)) {
      return
    }

    return await this.mutex.runExclusive(async () => {
      const availableCredit = this.getAvailableCreditForTransfer(destinationChainId)
      const vaultBalance = this.availableLiquidityWatcher.getVaultBalance(destinationChainId)
      const shouldWithdraw = (availableCredit.sub(vaultBalance)).lt(amount)
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
}

export default BondWithdrawalWatcher
