import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import chalk from 'chalk'
import { wait } from 'src/utils'
import { throttle } from 'src/utils'
import db from 'src/db'
import MerkleTree from 'src/utils/MerkleTree'
import BaseWatcher from './helpers/BaseWatcher'
import L2Bridge from './helpers/L2Bridge'

export interface Config {
  label: string
  order?: () => number
  minThresholdAmount?: number

  isL1?: boolean
  bridgeContract?: Contract
  dryMode?: boolean
}

const BONDER_ORDER_DELAY_MS = 60 * 1000

class CommitTransfersWatcher extends BaseWatcher {
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
    this.started = true
    try {
      this.logger.debug(
        `minThresholdAmount: ${this.bridge.formatUnits(
          this.minThresholdAmount
        )}`
      )
      await Promise.all([this.syncUp(), this.watch()])
    } catch (err) {
      this.logger.error('watcher error:', err)
      this.notifier.error(`watcher error: ${err.message}`)
    }
  }

  async stop () {
    this.bridge.removeAllListeners()
    this.started = false
    this.logger.setEnabled(false)
  }

  async syncUp () {
    if (this.isL1) {
      return
    }
    this.logger.debug('syncing up events')
    const blockNumber = await this.bridge.getBlockNumber()
    const startBlockNumber = blockNumber - 1000
    const transferSentEvents = await (this
      .bridge as L2Bridge).getTransferSentEvents(startBlockNumber, blockNumber)

    for (let event of transferSentEvents) {
      const {
        transferId,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        index
      } = event.args
      await this.handleTransferSentEvent(
        transferId,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        index,
        event
      )
    }
  }

  async watch () {
    if (this.isL1) {
      return
    }
    this.bridge
      .on((this.bridge as L2Bridge).TransferSent, this.handleTransferSentEvent)
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })

    while (true) {
      if (!this.started) return
      try {
        // TODO
        const chainIds = [1, 42, 5, 69, 79377087078960, 77, 80001]
        for (let chainId of chainIds) {
          //await this.getRecentTransferHashesForCommittedRoots()
          const pendingTransfers = await (this
            .bridge as L2Bridge).getPendingTransfers(chainId)
          if (pendingTransfers.length > 0) {
            await this.checkTransferSent(chainId)
          }
        }
      } catch (err) {
        this.logger.error('error checking:', err.message)
        this.notifier.error(`error checking: ${err.message}`)
      }
      await wait(10 * 1000)
    }
  }

  checkTransferSent = throttle(async (chainId: number) => {
    if (this.isL1) {
      return
    }
    try {
      if (!chainId) {
        throw new Error('chainId is required')
      }
      const pendingAmount = await (this
        .bridge as L2Bridge).getPendingAmountForChainId(chainId)
      if (pendingAmount.lte(0)) {
        return
      }

      const lastCommitTime = await (this
        .bridge as L2Bridge).getLastCommitTimeForChainId(chainId)
      const minimumForceCommitDelay = await (this
        .bridge as L2Bridge).getMinimumForceCommitDelay()
      const minForceCommitTime = lastCommitTime + minimumForceCommitDelay
      const isBonder = await this.bridge.isBonder()
      const l2ChainId = await (this.bridge as L2Bridge).getChainId()
      this.logger.debug('chainId:', l2ChainId)
      this.logger.debug('destinationChainId:', chainId)
      this.logger.debug('lastCommitTime:', lastCommitTime)
      this.logger.debug('minimumForceCommitDelay:', minimumForceCommitDelay)
      this.logger.debug('minForceCommitTime:', minForceCommitTime)
      this.logger.debug('isBonder:', isBonder)

      if (minForceCommitTime >= Date.now() && !isBonder) {
        this.logger.warn('only Bonder can commit before min delay')
      }

      const pendingTransfers: string[] = await (this
        .bridge as L2Bridge).getPendingTransfers(chainId)
      if (!pendingTransfers.length) {
        this.logger.warn('no pending transfers to commit')
      }

      this.logger.debug(
        `total pending transfers count for chainId ${chainId}: ${pendingTransfers.length}`
      )
      const totalPendingAmount = await (this
        .bridge as L2Bridge).getPendingAmountForChainId(chainId)
      this.logger.debug(
        `total pending amount for chainId ${chainId}: ${this.bridge.formatUnits(
          totalPendingAmount
        )}`
      )
      if (totalPendingAmount.lt(this.minThresholdAmount)) {
        this.logger.warn(
          `total pending amount for chainId ${chainId} is ${this.bridge.formatUnits(
            totalPendingAmount
          )} and does not meet min threshold of ${this.bridge.formatUnits(
            this.minThresholdAmount
          )}. Cannot commit transfers yet`
        )
        return
      }

      if (pendingTransfers.length < this.minPendingTransfers) {
        this.logger.warn(
          `must reach ${this.minPendingTransfers} pending transfers before committing. Have ${pendingTransfers.length} on chainId: ${chainId}`
        )
        return
      }

      this.logger.debug(
        `chainId: ${chainId} - onchain pendingTransfers`,
        pendingTransfers
      )
      const tree = new MerkleTree(pendingTransfers)
      const transferRootHash = tree.getHexRoot()
      this.logger.debug(
        `chainId: ${chainId} - calculated transferRootHash: ${chalk.bgMagenta.black(
          transferRootHash
        )}`
      )
      await db.transferRoots.update(transferRootHash, {
        transferRootHash,
        transferHashes: pendingTransfers,
        totalAmount: totalPendingAmount
      })

      const dbTransferRoot = await db.transferRoots.getByTransferRootHash(
        transferRootHash
      )
      if (dbTransferRoot?.sentCommitTx || dbTransferRoot?.commited) {
        this.logger.debug(
          'sent?:',
          !!dbTransferRoot.sentCommitTx,
          'commited?:',
          !!dbTransferRoot.commited
        )
        return
      }

      if (this.dryMode) {
        this.logger.warn('dry mode: skipping commitTransfers transaction')
        return
      }

      for (let transferHash of pendingTransfers) {
        await db.transfers.update(transferHash, {
          transferHash,
          transferRootHash
        })
      }

      await db.transferRoots.update(transferRootHash, {
        sentCommitTx: true
      })

      await this.waitTimeout(chainId)
      this.logger.debug('sending commitTransfers tx')

      const tx = await (this.bridge as L2Bridge).commitTransfers(chainId)
      tx?.wait()
        .then(async (receipt: any) => {
          if (receipt.status !== 1) {
            await db.transferRoots.update(transferRootHash, {
              sentCommitTx: false
            })
            throw new Error('status=0')
          }
          this.emit('commitTransfers', {
            chainId,
            transferRootHash,
            transferHashes: pendingTransfers
          })
          await db.transferRoots.update(transferRootHash, {
            commited: true
          })
        })
        .catch(async (err: Error) => {
          await db.transferRoots.update(transferRootHash, {
            sentCommitTx: false
          })

          throw err
        })
      this.logger.info(
        `L2 commitTransfers tx:`,
        chalk.bgYellow.black.bold(tx.hash)
      )
      this.notifier.info(`L2 commitTransfers tx: ${tx.hash}`)
    } catch (err) {
      if (err.message !== 'cancelled') {
        throw err
      }
    }
  }, 15 * 1000)

  handleTransferSentEvent = async (
    transferHash: string,
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    index: string,
    meta: any
  ) => {
    try {
      const dbTransferHash = await db.transfers.getByTransferHash(transferHash)
      if (dbTransferHash?.sourceChainId) {
        return
      }

      this.logger.debug(`received TransferSent event`)
      this.logger.debug(`waiting`)
      // TODO: batch
      const { transactionHash } = meta
      const { data } = await this.bridge.getTransaction(transactionHash)

      const { chainId } = await (this.bridge as L2Bridge).decodeSendData(data)
      const sourceChainId = await (this.bridge as L2Bridge).getChainId()
      await db.transfers.update(transferHash, {
        transferHash,
        chainId,
        sourceChainId
      })
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.logger.error('commitTransfers tx error:', err.message)
        this.notifier.error(`commitTransfers tx error: ${err.message}`)
      }
    }
  }

  async getRecentTransferHashesForCommittedRoots () {
    const blockNumber = await this.bridge.getBlockNumber()
    let start = blockNumber - 1000
    const transferCommits = await (this
      .bridge as L2Bridge).getTransfersCommitedEvents(start, blockNumber)
    if (!transferCommits.length) {
      return
    }
    const transferCommitsMap: any = {}
    for (let i = 1; i < transferCommits.length; i++) {
      let { topics, blockNumber, transactionHash } = transferCommits[i]
      const { data } = await (this.bridge as L2Bridge).getTransaction(
        transactionHash
      )
      const { destinationChainId: chainId } = await (this
        .bridge as L2Bridge).decodeCommitTransfersData(data)
      if (!chainId) {
        continue
      }
      const transferRootHash = topics[1]
      const prevBlockNumber =
        i === 0 ? start : transferCommits[i - 1].blockNumber
      if (!transferCommitsMap[chainId]) {
        transferCommitsMap[chainId] = {}
      }
      transferCommitsMap[chainId][transferRootHash] = {
        transferRootHash,
        transferHashes: [],
        prevBlockNumber,
        blockNumber
      }
    }
    for (let destChainId in transferCommitsMap) {
      for (let transferRootHash in transferCommitsMap[destChainId]) {
        let {
          prevBlockNumber,
          blockNumber,
          transferHashes
        } = transferCommitsMap[destChainId][transferRootHash]
        const recentEvents = await (this
          .bridge as L2Bridge).getTransferSentEvents(
          prevBlockNumber,
          blockNumber
        )
        for (let event of recentEvents) {
          const { data } = await this.bridge.getTransaction(
            event.transactionHash
          )

          const { chainId } = await (this.bridge as L2Bridge).decodeSendData(
            data
          )
          if (chainId === destChainId) {
            transferHashes.push(event.topics[1])
          }
        }
        if (transferHashes.length) {
          const tree = new MerkleTree(transferHashes)
          if (tree.getHexRoot() === transferRootHash) {
            db.transferRoots.update(transferRootHash, {
              transferHashes: transferHashes,
              commited: true
            })
          } else {
            this.logger.warn(
              'merkle hex root does not match commited transfer root'
            )
          }
        }
      }
    }
  }

  async waitTimeout (chainId: number) {
    await wait(2 * 1000)
    if (!this.order()) {
      return
    }
    this.logger.debug(`waiting for commitTransfers event. chainId: ${chainId}`)
    let timeout = this.order() * BONDER_ORDER_DELAY_MS
    while (timeout > 0) {
      if (!this.started) {
        return
      }
      const pendingTransfers: string[] = await (this
        .bridge as L2Bridge).getPendingTransfers(chainId)
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
