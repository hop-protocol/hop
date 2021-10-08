import '../moduleAlias'
import BaseWatcher from './classes/BaseWatcher'
import L2Bridge from './classes/L2Bridge'
import { BigNumber, Contract } from 'ethers'
import { TxRetryDelayMs } from 'src/constants'
import { getEnabledNetworks } from 'src/config'

export interface Config {
  chainSlug: string
  tokenSymbol: string
  label: string
  order?: () => number
  minThresholdAmounts?: {[chain: string]: number}

  isL1?: boolean
  bridgeContract?: Contract
  dryMode?: boolean
  stateUpdateAddress?: string
}

const BONDER_ORDER_DELAY_MS = 60 * 1000

class CommitTransfersWatcher extends BaseWatcher {
  siblingWatchers: { [chainId: string]: CommitTransfersWatcher }
  minThresholdAmounts: {[chain: string]: BigNumber} = {}
  commitTxSentAt: { [chainId: number]: number } = {}

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'CommitTransfersWatcher',
      prefix: config.label,
      logColor: 'yellow',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode,
      stateUpdateAddress: config.stateUpdateAddress
    })

    if (config.minThresholdAmounts) {
      for (const destinationChain in config.minThresholdAmounts) {
        this.minThresholdAmounts[destinationChain] = this.bridge.parseUnits(
          config.minThresholdAmounts[destinationChain]
        )
      }
    }

    // Commit watcher is less time sensitive than others
    this.pollIntervalMs = 6 * 10 * 1000
  }

  getMinThresholdAmount (destinationChainId: number) {
    return this.minThresholdAmounts[this.chainIdToSlug(destinationChainId)] || BigNumber.from(0)
  }

  async start () {
    const chains = getEnabledNetworks()
    for (const destinationChain of chains) {
      if (this.isL1 || this.chainSlug === destinationChain) {
        continue
      }
      const minThresholdAmount = this.getMinThresholdAmount(this.chainSlugToId(destinationChain))
      this.logger.debug(
        `destination chain ${destinationChain} min threshold amount: ${this.bridge.formatUnits(minThresholdAmount)}`
      )
    }
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
    if (!destinationChainId) {
      throw new Error('destination chain id is required')
    }

    // Define new object on first run after server restart
    if (!this.commitTxSentAt[destinationChainId]) {
      this.commitTxSentAt[destinationChainId] = 0
    }
    const timestampOk = this.commitTxSentAt[destinationChainId] + TxRetryDelayMs < Date.now()
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

    const minThresholdAmount = this.getMinThresholdAmount(destinationChainId)
    if (totalPendingAmount.lte(minThresholdAmount)) {
      const formattedThreshold = this.bridge.formatUnits(
        minThresholdAmount
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

    this.logger.debug(
      `sending commitTransfers (destination chain ${destinationChainId}) tx`
    )
    this.commitTxSentAt[destinationChainId] = Date.now()

    try {
      const tx = await l2Bridge.commitTransfers(destinationChainId)
      const sourceChainId = await l2Bridge.getChainId()
      const msg = `L2 (${sourceChainId}) commitTransfers (destination chain ${destinationChainId}) tx: ${tx.hash}`
      this.logger.info(msg)
      this.notifier.info(msg)
    } catch (err) {
      this.logger.log(err.message)
      throw err
    }
  }
}

export default CommitTransfersWatcher
