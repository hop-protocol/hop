import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L2Bridge from './classes/L2Bridge'
import chalk from 'chalk'
import { Contract, providers } from 'ethers'
import { TxError } from 'src/constants'
import { wait } from 'src/utils'

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

  async start () {
    this.logger.debug(
      `min bondWithdrawal amount: ${this.bridge.formatUnits(this.bridge.minBondWithdrawalAmount)}`
    )
    this.logger.debug(
      `max bondWithdrawal amount: ${this.bridge.formatUnits(this.bridge.maxBondWithdrawalAmount)}`
    )
    await super.start()
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
    for (const { transferId } of dbTransfers) {
      promises.push(this.checkTransferId(transferId))
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

    const bondedAmount = await destBridge.getBondedWithdrawalAmount(transferId)
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

    const availableCredit = await destBridge.getAvailableCredit()
    if (availableCredit.lt(amount)) {
      logger.warn(
        `not enough credit to bond withdrawal. Have ${this.bridge.formatUnits(
          availableCredit
        )}, need ${this.bridge.formatUnits(amount)}`
      )
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
