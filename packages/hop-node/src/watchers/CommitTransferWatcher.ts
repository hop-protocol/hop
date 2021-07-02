import '../moduleAlias'
import { Contract, BigNumber, Event, providers } from 'ethers'
import chalk from 'chalk'
import { wait } from 'src/utils'
import db from 'src/db'
import { Transfer } from 'src/db/TransfersDb'
import MerkleTree from 'src/utils/MerkleTree'
import BaseWatcherWithEventHandlers from './classes/BaseWatcherWithEventHandlers'
import L2Bridge from './classes/L2Bridge'

export interface Config {
  label: string
  order?: () => number
  minThresholdAmount?: number

  isL1?: boolean
  bridgeContract?: Contract
  dryMode?: boolean
}

const BONDER_ORDER_DELAY_MS = 60 * 1000

class CommitTransfersWatcher extends BaseWatcherWithEventHandlers {
  siblingWatchers: { [chainId: string]: CommitTransfersWatcher }
  minPendingTransfers: number = 1
  minThresholdAmount: BigNumber = BigNumber.from(0)

  constructor (config: Config) {
    super({
      tag: 'commitTransferWatcher',
      prefix: config.label,
      logColor: 'yellow',
      order: config.order,
      isL1: config.isL1,
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    if (config.minThresholdAmount) {
      this.minThresholdAmount = this.bridge.parseUnits(
        config.minThresholdAmount
      )
    }
  }

  async start () {
    this.logger.debug(
      `minThresholdAmount: ${this.bridge.formatUnits(this.minThresholdAmount)}`
    )
    await super.start()
  }

  async syncUp (): Promise<any> {
    if (this.isL1) {
      return
    }

    this.logger.debug('syncing up events')

    const promises: Promise<any>[] = []
    const l2Bridge = this.bridge as L2Bridge
    promises.push(
      l2Bridge.mapTransferSentEvents(
        async (event: Event) => {
          return this.handleRawTransferSentEvent(event)
        },
        { cacheKey: this.cacheKey(l2Bridge.TransferSent) }
      )
    )

    promises.push(
      l2Bridge.mapTransfersCommittedEvents(
        async (event: Event) => {
          return this.handleRawTransfersCommittedEventForTransferIds(event)
        },
        { cacheKey: this.cacheKey(l2Bridge.TransfersCommitted) }
      )
    )

    await Promise.all(promises)
    this.logger.debug('done syncing')

    await wait(this.resyncIntervalSec)
    return this.syncUp()
  }

  async watch () {
    if (this.isL1) {
      return
    }
    const l2Bridge = this.bridge as L2Bridge
    this.bridge
      .on(l2Bridge.TransferSent, this.handleTransferSentEvent)
      .on(l2Bridge.TransfersCommitted, this.handleTransfersCommittedEventForTransferIds)
      .on('error', err => {
        this.logger.error(`event watcher error: ${err.message}`)
        this.notifier.error(`event watcher error: ${err.message}`)
        this.quit()
      })
  }

  async pollCheck () {
    if (this.isL1) {
      return
    }
    while (true) {
      if (!this.started) {
        return
      }
      try {
        await this.checkTransferSentFromDb()
      } catch (err) {
        this.logger.error(`poll check error: ${err.message}`)
        this.notifier.error(`poll check error: ${err.message}`)
      }
      await wait(this.pollIntervalSec)
    }
  }

  async handleRawTransfersCommittedEventForTransferIds (event: Event) {
    const {
      destinationChainId,
      rootHash,
      totalAmount,
      rootCommittedAt
    } = event.args
    await this.handleTransfersCommittedEventForTransferIds(
      destinationChainId,
      rootHash,
      totalAmount,
      rootCommittedAt,
      event
    )
  }

  async handleRawTransferSentEvent (event: Event) {
    const {
      transferId,
      chainId: destinationChainId,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      index,
      amountOutMin,
      deadline
    } = event.args
    await this.handleTransferSentEvent(
      transferId,
      destinationChainId,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      index,
      amountOutMin,
      deadline,
      event
    )
  }

  async checkTransferSentFromDb () {
    const dbTransfers = await db.transfers.getUncommittedTransfers({
      sourceChainId: await this.bridge.getChainId()
    })
    if (dbTransfers.length) {
      this.logger.debug(
        `checking ${dbTransfers.length} uncommitted transfers db items`
      )
    }
    let destinationChainIds: number[] = []
    for (let dbTransfer of dbTransfers) {
      const { destinationChainId } = dbTransfer
      if (!destinationChainIds.includes(destinationChainId)) {
        destinationChainIds.push(destinationChainId)
      }
    }
    for (let destinationChainId of destinationChainIds) {
      const filtered = dbTransfers.filter(transfer => {
        return transfer.destinationChainId === destinationChainId
      })
      await this.checkIfShouldCommit(destinationChainId, filtered)
    }
  }

  async checkIfShouldCommit (
    destinationChainId: number,
    dbTransfers: Transfer[]
  ) {
    try {
      if (!destinationChainId) {
        throw new Error('destination chain id is required')
      }
      const l2Bridge = this.bridge as L2Bridge
      const totalPendingAmount = await l2Bridge.getPendingAmountForChainId(
        destinationChainId
      )
      if (totalPendingAmount.lte(0)) {
        for (let { transferId } of dbTransfers) {
          await db.transfers.update(transferId, {
            committed: true
          })
        }
        return
      }
      const lastCommitTime = await l2Bridge.getLastCommitTimeForChainId(
        destinationChainId
      )
      const minimumForceCommitDelay = await l2Bridge.getMinimumForceCommitDelay()
      const minForceCommitTime = lastCommitTime + minimumForceCommitDelay
      const isBonder = await this.bridge.isBonder()
      const l2ChainId = await l2Bridge.getChainId()
      this.logger.debug('sourceChainId:', l2ChainId)
      this.logger.debug('destinationChainId:', destinationChainId)
      this.logger.debug('lastCommitTime:', lastCommitTime)
      this.logger.debug('minimumForceCommitDelay:', minimumForceCommitDelay)
      this.logger.debug('minForceCommitTime:', minForceCommitTime)
      this.logger.debug('isBonder:', isBonder)

      if (minForceCommitTime >= Date.now() && !isBonder) {
        this.logger.warn('only Bonder can commit before min delay')
        return
      }

      const pendingTransfers: string[] = await l2Bridge.getPendingTransfers(
        destinationChainId
      )
      if (!pendingTransfers.length) {
        this.logger.warn('no pending transfers to commit')
        return
      }

      this.logger.debug(
        `total pending transfers count for chainId ${destinationChainId}: ${pendingTransfers.length}`
      )
      this.logger.debug(
        `total pending amount for chainId ${destinationChainId}: ${this.bridge.formatUnits(
          totalPendingAmount
        )}`
      )
      if (totalPendingAmount.lt(this.minThresholdAmount)) {
        this.logger.warn(
          `destinationChainId ${destinationChainId} pending amount ${this.bridge.formatUnits(
            totalPendingAmount
          )} does not meet min threshold of ${this.bridge.formatUnits(
            this.minThresholdAmount
          )}. Cannot commit transfers yet`
        )
        return
      }

      if (pendingTransfers.length < this.minPendingTransfers) {
        this.logger.warn(
          `must reach ${this.minPendingTransfers} pending transfers before committing. Have ${pendingTransfers.length} on destinationChainId: ${destinationChainId}`
        )
        return
      }

      this.logger.debug(
        `destinationChainId: ${destinationChainId} - onchain pendingTransfers\n`,
        pendingTransfers
      )
      const tree = new MerkleTree(pendingTransfers)
      const transferRootHash = tree.getHexRoot()
      this.logger.debug(
        `destinationChainId: ${destinationChainId} - calculated transferRootHash: ${chalk.bgMagenta.black(
          transferRootHash
        )}`
      )
      await db.transferRoots.update(transferRootHash, {
        transferRootHash,
        transferIds: pendingTransfers,
        totalAmount: totalPendingAmount,
        sourceChainId: l2ChainId
      })

      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        transferRootHash
      )
      if (
        (dbTransferRoot?.sentCommitTx || dbTransferRoot?.committed) &&
        dbTransferRoot?.sentCommitTxAt
      ) {
        const tenMinutes = 60 * 10 * 1000
        // skip if a transaction was sent in the last 10 minutes
        if (dbTransferRoot.sentCommitTxAt + tenMinutes > Date.now()) {
          this.logger.debug(
            'sent?:',
            !!dbTransferRoot.sentCommitTx,
            'committed?:',
            !!dbTransferRoot.committed
          )
          return
        }
      }

      if (this.dryMode) {
        this.logger.warn('dry mode: skipping commitTransfers transaction')
        return
      }

      await db.transferRoots.update(transferRootHash, {
        sentCommitTx: true,
        sentCommitTxAt: Date.now()
      })

      await this.waitTimeout(destinationChainId)
      this.logger.debug(
        `sending commitTransfers (destination chain ${destinationChainId}) tx`
      )

      const tx = await l2Bridge.commitTransfers(destinationChainId)
      tx?.wait()
        .then(async (receipt: providers.TransactionReceipt) => {
          if (receipt.status !== 1) {
            await db.transferRoots.update(transferRootHash, {
              sentCommitTx: false,
              sentCommitTxAt: 0
            })
            throw new Error('status=0')
          }
          this.emit('commitTransfers', {
            destinationChainId,
            transferRootHash,
            transferIds: pendingTransfers
          })
        })
        .catch(async (err: Error) => {
          await db.transferRoots.update(transferRootHash, {
            sentCommitTx: false,
            sentCommitTxAt: 0
          })

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

  async getRecentTransferIdsForCommittedRoots () {
    const blockNumber = await this.bridge.getBlockNumber()
    let start = blockNumber - 1000
    const l2Bridge = this.bridge as L2Bridge
    const transferCommits = await l2Bridge.getTransfersCommittedEvents(
      start,
      blockNumber
    )
    if (!transferCommits.length) {
      return
    }
    const transferCommitsMap: any = {}
    for (let i = 1; i < transferCommits.length; i++) {
      let { topics, blockNumber, transactionHash } = transferCommits[i]
      const { data } = await l2Bridge.getTransaction(transactionHash)
      const { destinationChainId } = await l2Bridge.decodeCommitTransfersData(
        data
      )
      if (!destinationChainId) {
        continue
      }
      const transferRootHash = topics[1]
      const prevBlockNumber =
        i === 0 ? start : transferCommits[i - 1].blockNumber
      if (!transferCommitsMap[destinationChainId]) {
        transferCommitsMap[destinationChainId] = {}
      }
      transferCommitsMap[destinationChainId][transferRootHash] = {
        transferRootHash,
        transferIds: [],
        prevBlockNumber,
        blockNumber
      }
    }
    for (let destinationChainId in transferCommitsMap) {
      for (let transferRootHash in transferCommitsMap[destinationChainId]) {
        let { prevBlockNumber, blockNumber, transferIds } = transferCommitsMap[
          destinationChainId
        ][transferRootHash]
        const recentEvents = await l2Bridge.getTransferSentEvents(
          prevBlockNumber,
          blockNumber
        )
        for (let event of recentEvents) {
          const { data } = await this.bridge.getTransaction(
            event.transactionHash
          )

          const {
            destinationChainId: decodedDestinationChainId
          } = await l2Bridge.decodeSendData(data)
          if (decodedDestinationChainId === destinationChainId) {
            transferIds.push(event.topics[1])
          }
        }
        if (transferIds.length) {
          const tree = new MerkleTree(transferIds)
          if (tree.getHexRoot() === transferRootHash) {
            db.transferRoots.update(transferRootHash, {
              transferIds: transferIds
            })
          } else {
            this.logger.warn(
              'merkle hex root does not match committed transfer root'
            )
          }
        }
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
      const pendingTransfers: string[] = await l2Bridge.getPendingTransfers(
        destinationChainId
      )
      if (!pendingTransfers.length) {
        break
      }
      const delay = 2 * 1000
      timeout -= delay
      await wait(delay)
    }
    if (timeout <= 0) {
      return
    }
    this.logger.debug(`transfers already committed`)
    throw new Error('cancelled')
  }
}

export default CommitTransfersWatcher
