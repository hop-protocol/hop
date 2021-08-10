import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L2Bridge from './classes/L2Bridge'
import chalk from 'chalk'
import { BigNumber, Contract, providers } from 'ethers'
import { TX_RETRY_DELAY_MS } from 'src/constants'
import { wait } from 'src/utils'

export interface Config {
  chainSlug: string
  tokenSymbol: string
  label: string
  order?: () => number
  minThresholdAmount?: number

  isL1?: boolean
  bridgeContract?: Contract
  dryMode?: boolean
  stateUpdateAddress?: string
}

const BONDER_ORDER_DELAY_MS = 60 * 1000

class CommitTransfersWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: CommitTransfersWatcher }
  minThresholdAmount: BigNumber = BigNumber.from(0)
  commitTxSentAt: { [chainId: number]: number } = {}

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'CommitTransferWatcher',
      prefix: config.label,
      logColor: 'yellow',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode,
      stateUpdateAddress: config.stateUpdateAddress
    })

    if (config.minThresholdAmount) {
      this.minThresholdAmount = this.bridge.parseUnits(
        config.minThresholdAmount
      )
    }

    // Commit watcher is less time sensitive than others
    this.pollIntervalMs = 6 * 10 * 1000
  }

  async start () {
    this.logger.debug(
      `minThresholdAmount: ${this.bridge.formatUnits(this.minThresholdAmount)}`
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
    const dbTransfers = await this.db.transfers.getUncommittedTransfers({
      sourceChainId: await this.bridge.getChainId()
    })
    if (dbTransfers.length) {
      this.logger.debug(
        `checking ${dbTransfers.length} uncommitted transfers db items`
      )
    }
    const destinationChainIds: number[] = []
    for (const dbTransfer of dbTransfers) {
      const { destinationChainId } = dbTransfer
      if (!destinationChainIds.includes(destinationChainId)) {
        destinationChainIds.push(destinationChainId)
      }
    }
    for (const destinationChainId of destinationChainIds) {
      await this.checkIfShouldCommit(destinationChainId)
    }
  }

  async checkIfShouldCommit (destinationChainId: number) {
    try {
      if (!destinationChainId) {
        throw new Error('destination chain id is required')
      }

      // Define new object on first run after server restart
      if (!this.commitTxSentAt[destinationChainId]) {
        this.commitTxSentAt[destinationChainId] = 0
      }
      const timestampOk = this.commitTxSentAt[destinationChainId] + TX_RETRY_DELAY_MS < Date.now()
      if (timestampOk) {
        // This may happen either in the happy path case or if the transaction
        // has been in the mempool for too long and we want to retry
        this.commitTxSentAt[destinationChainId] = 0
      } else {
        this.logger.info(
          `commit tx for chainId ${destinationChainId} is in mempool`
        )
        return
      }

      // We must check on chain because this may run when the DB is syncing and our DB state is incomplete
      const l2Bridge = this.bridge as L2Bridge
      const totalPendingAmount = await l2Bridge.getPendingAmountForChainId(
        destinationChainId
      )
      const formattedPendingAmount = this.bridge.formatUnits(totalPendingAmount)

      if (totalPendingAmount.lte(this.minThresholdAmount)) {
        const formattedThreshold = this.bridge.formatUnits(
          this.minThresholdAmount
        )
        this.logger.warn(
          `dest ${destinationChainId}: pending amt ${formattedPendingAmount} less than min of ${formattedThreshold}.`
        )
        return
      }

      this.logger.debug(
        `total pending amount for chainId ${destinationChainId}: ${formattedPendingAmount}`
      )

      await this.handleStateSwitch()
      if (this.isDryOrPauseMode) {
        this.logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping commitTransfers`)
        return
      }

      await this.waitTimeout(destinationChainId)
      this.logger.debug(
        `sending commitTransfers (destination chain ${destinationChainId}) tx`
      )

      this.commitTxSentAt[destinationChainId] = Date.now()
      const tx = await l2Bridge.commitTransfers(destinationChainId)
      tx?.wait()
        .then(async (receipt: providers.TransactionReceipt) => {
          if (receipt.status !== 1) {
            this.commitTxSentAt[destinationChainId] = 0
            throw new Error('status=0')
          }
          this.emit('commitTransfers', {
            destinationChainId
          })
          this.commitTxSentAt[destinationChainId] = 0
        })
        .catch(async (err: Error) => {
          this.commitTxSentAt[destinationChainId] = 0

          throw err
        })
      const sourceChainId = await l2Bridge.getChainId()
      this.logger.info(
        `L2 (${sourceChainId}) commitTransfers (destination chain ${destinationChainId}) tx:`,
        chalk.bgYellow.black.bold(tx.hash)
      )
      this.notifier.info(`L2 commitTransfers tx: ${tx.hash}`)
    } catch (err) {
      if (err.message !== 'cancelled') {
        throw err
      }
    }
  }

  async waitTimeout (destinationChainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(
      `waiting for commitTransfers event. destinationChainId: ${destinationChainId}`
    )
    let timeout = this.order() * BONDER_ORDER_DELAY_MS
    while (timeout > 0) {
      if (!this.started) {
        return
      }
      const l2Bridge = this.bridge as L2Bridge
      const doesPendingTransferExist: boolean = await l2Bridge.doPendingTransfersExist(
        destinationChainId
      )
      if (!doesPendingTransferExist) {
        break
      }
      const delay = 2 * 1000
      timeout -= delay
      await wait(delay)
    }
    if (timeout <= 0) {
      return
    }
    this.logger.debug('transfers already committed')
    throw new Error('cancelled')
  }
}

export default CommitTransfersWatcher
