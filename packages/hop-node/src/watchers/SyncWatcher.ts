import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import S3Upload from 'src/aws/s3Upload'
import chunk from 'lodash/chunk'
import getBlockNumberFromDate from 'src/utils/getBlockNumberFromDate'
import isL1ChainId from 'src/utils/isL1ChainId'
import wait from 'src/utils/wait'
import { BigNumber, Contract } from 'ethers'
import { Chain, TenMinutesMs } from 'src/constants'
import { DateTime } from 'luxon'
import { Event } from 'src/types'
import { Transfer } from 'src/db/TransfersDb'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { config as globalConfig, oruChains } from 'src/config'

type S3JsonData = {
  [token: string]: {
    availableCredit: {[chain: string]: string},
    pendingAmounts: {[chain: string]: string},
    unbondedTransferRootAmounts: {[chain: string]: string}
  }
}

// TODO: better way of managing aggregate state
const s3JsonData: S3JsonData = {}
let s3LastUpload : number

export interface Config {
  chainSlug: string
  tokenSymbol: string
  label: string
  isL1: boolean
  bridgeContract: Contract
  syncFromDate?: string
  s3Upload?: boolean
  s3Namespace?: string
}

class SyncWatcher extends BaseWatcher {
  initialSyncCompleted: boolean = false
  resyncIntervalMs: number = 60 * 1000
  syncIndex: number = 0
  syncFromDate : string
  customStartBlockNumber : number
  ready: boolean = false
  private s3AvailableCredit: { [destinationChain: string]: BigNumber } = {} // bonder from core package config
  private availableCredit: { [destinationChain: string]: BigNumber } = {} // own bonder
  private pendingAmounts: { [destinationChain: string]: BigNumber } = {}
  private unbondedTransferRootAmounts: { [destinationChain: string]: BigNumber } = {}
  private lastCalculated: { [destinationChain: string]: number } = {}
  s3Upload: S3Upload
  s3Namespace: S3Upload

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      tag: 'SyncWatcher',
      prefix: config.label,
      logColor: 'gray',
      isL1: config.isL1,
      bridgeContract: config.bridgeContract
    })
    this.syncFromDate = config.syncFromDate
    if (config.s3Upload) {
      this.s3Upload = new S3Upload({
        bucket: 'assets.hop.exchange',
        key: `${config.s3Namespace || globalConfig.network}/v1-available-liquidity.json`
      })
    }
    this.init()
      .catch(err => {
        this.logger.error('init error:', err)
        this.quit()
      })
  }

  async init () {
    if (this.syncFromDate) {
      const date = DateTime.fromISO(this.syncFromDate)
      const timestamp = date.toSeconds()
      this.customStartBlockNumber = await getBlockNumberFromDate(this.chainSlug, timestamp)
    }
    this.ready = true
  }

  async start () {
    this.started = true
    try {
      await this.pollSync()
    } catch (err) {
      this.logger.error(`sync watcher error: ${err.message}\ntrace: ${err.stack}`)
      this.notifier.error(`sync watcher error: ${err.message}`)
      this.quit()
    }
  }

  async pollSync () {
    while (true) {
      try {
        if (!this.ready) {
          await wait(5 * 1000)
          continue
        }
        await this.preSyncHandler()
        await this.syncHandler()
        this.logger.debug('done syncing pure handlers. index:', this.syncIndex)
        await this.incompletePollSync()
        this.logger.debug('done syncing incomplete items. index:', this.syncIndex)
        await this.postSyncHandler()
      } catch (err) {
        this.notifier.error(`pollSync error: ${err.message}`)
        this.logger.error('pollSync error:', err)
      }
    }
  }

  async incompletePollSync () {
    try {
      const chunkSize = 20
      const incompleteTransfers = await this.db.transfers.getIncompleteItems({
        sourceChainId: this.chainSlugToId(this.chainSlug)
      })
      if (incompleteTransfers.length) {
        this.logger.debug(`incomplete transfer items: ${incompleteTransfers.length}`)
        const allChunks = chunk(incompleteTransfers, chunkSize)
        for (const chunks of allChunks) {
          await Promise.all(chunks.map((transfer: Transfer) => {
            const { transferId } = transfer
            return this.populateTransferDbItem(transferId)
              .then(() => {
                // fill in missing db timestamped keys
                return this.db.transfers.trackTimestampedKeyByTransferId(transferId)
              })
              .catch((err: Error) => {
                this.logger.error('populateTransferDbItem error:', err)
                this.notifier.error(`populateTransferDbItem error: ${err.message}`)
              })
          }))
        }
      }
      const incompleteTransferRoots = await this.db.transferRoots.getIncompleteItems({
        sourceChainId: this.chainSlugToId(this.chainSlug)
      })
      if (incompleteTransferRoots.length) {
        this.logger.debug(`incomplete transfer root items: ${incompleteTransferRoots.length}`)
        const allChunks = chunk(incompleteTransferRoots, chunkSize)
        for (const chunks of allChunks) {
          await Promise.all(chunks.map((transferRoot: TransferRoot) => {
            const { transferRootHash } = transferRoot
            return this.populateTransferRootDbItem(transferRootHash)
              .then(() => {
                // fill in missing db timestamped keys
                return this.db.transferRoots.trackTimestampedKeyByTransferRootHash(transferRootHash)
              })
              .catch((err: Error) => {
                this.logger.error('populateTransferRootDbItem error:', err)
                this.notifier.error(`populateTransferRootDbItem error: ${err.message}`)
              })
          }))
        }
      }
    } catch (err: any) {
      this.logger.error(`incomplete poll sync watcher error: ${err.message}\ntrace: ${err.stack}`)
      this.notifier.error(`incomplete poll sync watcher error: ${err.message}`)
    }
  }

  async preSyncHandler () {
    this.logger.debug('syncing up events. index:', this.syncIndex)
  }

  async postSyncHandler () {
    if (this.syncIndex === 0) {
      this.initialSyncCompleted = true
      this.logger.debug('initial sync complete')
    }
    this.logger.debug('done syncing. index:', this.syncIndex)
    this.syncIndex++
    try {
      await this.uploadToS3()
    } catch (err) {
      this.logger.error(err)
    }
    await wait(this.resyncIntervalMs)
  }

  isInitialSyncCompleted (): boolean {
    return this.initialSyncCompleted
  }

  isAllSiblingWatchersInitialSyncCompleted (): boolean {
    return Object.values(this.siblingWatchers).every(
      (siblingWatcher: SyncWatcher) => {
        return siblingWatcher.isInitialSyncCompleted()
      }
    )
  }

  async syncHandler (): Promise<any> {
    const promises: Promise<any>[] = []
    let startBlockNumber = this.bridge.bridgeDeployedBlockNumber
    let useCacheKey = true

    // if it is first sync upon start and
    // custom start block was specified,
    // then use that as initial start block
    if (!this.isInitialSyncCompleted() && this.customStartBlockNumber) {
      useCacheKey = false
      startBlockNumber = this.customStartBlockNumber
    }

    const getOptions = (keyName: string) => {
      return {
        cacheKey: useCacheKey ? this.cacheKey(keyName) : undefined,
        startBlockNumber
      }
    }

    if (this.isL1) {
      const l1Bridge = this.bridge as L1Bridge
      promises.push(
        l1Bridge.mapTransferRootBondedEvents(
          async (event: Event) => {
            return this.handleTransferRootBondedEvent(event)
          },
          getOptions(l1Bridge.TransferRootBonded)
        )
      )

      promises.push(
        l1Bridge.mapTransferRootConfirmedEvents(
          async (event: Event) => {
            return this.handleTransferRootConfirmedEvent(event)
          },
          getOptions(l1Bridge.TransferRootConfirmed)
        )
      )

      promises.push(
        l1Bridge.mapTransferBondChallengedEvents(
          async (event: Event) => {
            return this.handleTransferBondChallengedEvent(event)
          },
          getOptions(l1Bridge.TransferBondChallenged)
        )
      )
    }

    if (!this.isL1) {
      const l2Bridge = this.bridge as L2Bridge
      promises.push(
        l2Bridge.mapTransferSentEvents(
          async (event: Event) => {
            return this.handleTransferSentEvent(event)
          },
          getOptions(l2Bridge.TransferSent)
        )
      )

      promises.push(
        l2Bridge.mapTransfersCommittedEvents(
          async (event: Event) => {
            return this.handleTransfersCommittedEvent(event)
          },
          getOptions(l2Bridge.TransfersCommitted)
        )
      )
    }

    const transferSpentPromises: Promise<any>[] = []
    transferSpentPromises.push(
      this.bridge.mapWithdrawalBondedEvents(
        async (event: Event) => {
          return this.handleWithdrawalBondedEvent(event)
        },
        getOptions(this.bridge.WithdrawalBonded)
      )
    )

    transferSpentPromises.push(
      this.bridge.mapWithdrewEvents(
        async (event: Event) => {
          return this.handleWithdrewEvent(event)
        },
        getOptions(this.bridge.Withdrew)
      )
    )

    promises.push(
      Promise.all(transferSpentPromises)
        .then(() => {
        // This must be executed after the Withdrew and WithdrawalBonded event handlers
        // on initial sync since it relies on data from those handlers.
          return this.bridge.mapMultipleWithdrawalsSettledEvents(
            async (event: Event) => {
              return this.handleMultipleWithdrawalsSettledEvent(event)
            },
            getOptions(this.bridge.MultipleWithdrawalsSettled)
          )
        })
    )

    promises.push(
      this.bridge.mapTransferRootSetEvents(
        async (event: Event) => {
          return this.handleTransferRootSetEvent(event)
        },
        getOptions(this.bridge.TransferRootSet)
      )
    )

    // these must come after db is done syncing,
    // and syncAvailableCredit must be last
    await Promise.all(promises)
      .then(() => this.syncUnbondedTransferRootAmounts())
      .then(() => this.syncPendingAmounts())
      .then(() => this.syncAvailableCredit())
  }

  async handleTransferSentEvent (event: Event) {
    const {
      transferId,
      chainId: destinationChainIdBn,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      index,
      amountOutMin,
      deadline
    } = event.args
    const logger = this.logger.create({ id: transferId })
    logger.debug('handling TransferSent event')

    try {
      const { transactionHash, transactionIndex } = event
      const blockNumber: number = event.blockNumber
      if (!transactionHash) {
        throw new Error('event transaction hash not found')
      }
      if (!blockNumber) {
        throw new Error('event block number not found')
      }
      const destinationChainId = Number(destinationChainIdBn?.toString())
      const sourceChainId = await this.bridge.getChainId()
      const isBondable = this.getIsBondable(transferId, amountOutMin, deadline, destinationChainId)

      logger.debug('sourceChainId:', sourceChainId)
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('isBondable:', isBondable)
      logger.debug('transferId:', transferId)
      logger.debug('amount:', this.bridge.formatUnits(amount))
      logger.debug('bonderFee:', this.bridge.formatUnits(bonderFee))
      logger.debug('amountOutMin:', this.bridge.formatUnits(amountOutMin))
      logger.debug('deadline:', deadline?.toString())
      logger.debug('transferSentIndex:', transactionIndex)
      logger.debug('transferSentBlockNumber:', blockNumber)

      if (!isBondable) {
        logger.warn('transfer is unbondable', amountOutMin, deadline)
      }

      await this.db.transfers.update(transferId, {
        transferId,
        destinationChainId,
        sourceChainId,
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        isBondable,
        deadline,
        transferSentTxHash: transactionHash,
        transferSentBlockNumber: blockNumber,
        transferSentIndex: transactionIndex
      })
    } catch (err) {
      logger.error(`handleTransferSentEvent error: ${err.message}`)
      this.notifier.error(`handleTransferSentEvent error: ${err.message}`)
    }
  }

  async handleWithdrawalBondedEvent (event: Event) {
    const { transactionHash } = event
    const { transferId, amount } = event.args
    const logger = this.logger.create({ id: transferId })

    logger.debug('handling WithdrawalBonded event')
    logger.debug('transferId:', transferId)
    logger.debug('amount:', this.bridge.formatUnits(amount))

    await this.db.transfers.update(transferId, {
      withdrawalBonded: true,
      withdrawalBondedTxHash: transactionHash,
      isTransferSpent: true,
      transferSpentTxHash: transactionHash
    })
  }

  async handleWithdrewEvent (event: Event) {
    const {
      transferId,
      recipient,
      amount,
      transferNonce
    } = event.args
    const logger = this.logger.create({ id: transferId })

    const { transactionHash } = event

    logger.debug('handling Withdrew event')
    logger.debug('transferId:', transferId)
    logger.debug('transactionHash:', transactionHash)
    logger.debug('recipient:', recipient)
    logger.debug('amount:', amount)
    logger.debug('transferNonce:', transferNonce)

    await this.db.transfers.update(transferId, {
      isTransferSpent: true,
      transferSpentTxHash: transactionHash,
      isBondable: false
    })
  }

  async handleTransferRootConfirmedEvent (event: Event) {
    const {
      originChainId: sourceChainId,
      destinationChainId,
      rootHash: transferRootHash,
      totalAmount
    } = event.args
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('handling TransferRootConfirmed event')

    try {
      const { transactionHash } = event
      await this.db.transferRoots.update(transferRootHash, {
        confirmed: true,
        confirmTxHash: transactionHash
      })
    } catch (err) {
      logger.error(`handleTransferRootConfirmedEvent error: ${err.message}`)
      this.notifier.error(
        `handleTransferRootConfirmedEvent error: ${err.message}`
      )
    }
  }

  async handleTransferRootBondedEvent (event: Event) {
    const { transactionHash, blockNumber } = event
    const { root, amount } = event.args
    const logger = this.logger.create({ root })
    logger.debug('handling TransferRootBonded event')

    try {
      const bondTransferRootId = await this.bridge.getTransferRootId(
        root,
        amount
      )

      logger.debug(`transferRootHash from event: ${root}`)
      logger.debug(`event transactionHash: ${transactionHash}`)
      logger.debug(`event blockNumber: ${blockNumber}`)
      logger.debug(`bondAmount: ${this.bridge.formatUnits(amount)}`)
      logger.debug(`bondTransferRootId: ${bondTransferRootId}`)

      await this.db.transferRoots.update(root, {
        transferRootHash: root,
        bonded: true,
        bondTotalAmount: amount,
        bondTxHash: transactionHash,
        bondBlockNumber: blockNumber,
        bondTransferRootId
      })
    } catch (err) {
      logger.error(`handleTransferRootBondedEvent error: ${err.message}`)
      this.notifier.error(`handleTransferRootBondedEvent error: ${err.message}`)
    }
  }

  async handleTransfersCommittedEvent (event: Event) {
    const {
      destinationChainId: destinationChainIdBn,
      rootHash: transferRootHash,
      totalAmount,
      rootCommittedAt: committedAtBn
    } = event.args
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('handling TransfersCommitted event')

    try {
      const committedAt = Number(committedAtBn.toString())
      const { transactionHash, blockNumber } = event
      const sourceChainId = await this.bridge.getChainId()
      const destinationChainId = Number(destinationChainIdBn.toString())
      const transferRootId = await this.bridge.getTransferRootId(
        transferRootHash,
        totalAmount
      )

      const sourceChainSlug = this.chainIdToSlug(sourceChainId)
      const shouldBondTransferRoot = oruChains.includes(sourceChainSlug)

      logger.debug('transferRootId:', transferRootId)
      logger.debug('committedAt:', committedAt)
      logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
      logger.debug('transferRootHash:', transferRootHash)
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('shouldBondTransferRoot:', shouldBondTransferRoot)

      await this.db.transferRoots.update(transferRootHash, {
        transferRootHash,
        transferRootId,
        totalAmount,
        committedAt,
        destinationChainId,
        sourceChainId,
        committed: true,
        commitTxHash: transactionHash,
        commitTxBlockNumber: blockNumber,
        shouldBondTransferRoot
      })
    } catch (err) {
      logger.error(`handleTransfersCommittedEvent error: ${err.message}`)
      this.notifier.error(`handleTransfersCommittedEvent error: ${err.message}`)
    }
  }

  handleTransferBondChallengedEvent = async (event: Event) => {
    const {
      transferRootId,
      rootHash,
      originalAmount
    } = event.args
    const logger = this.logger.create({ root: rootHash })
    const { transactionHash } = event

    logger.debug('handling TransferBondChallenged event')
    logger.debug(`transferRootId: ${transferRootId}`)
    logger.debug(`rootHash: ${rootHash}`)
    logger.debug(`originalAmount: ${this.bridge.formatUnits(originalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)

    await this.db.transferRoots.update(rootHash, {
      challenged: true
    })
  }

  handleTransferRootSetEvent = async (event: Event) => {
    const {
      rootHash: transferRootHash,
      totalAmount
    } = event.args
    const logger = this.logger.create({ root: transferRootHash })
    const { transactionHash, blockNumber } = event

    logger.debug('handling TransferRootSet event')
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)

    await this.db.transferRoots.update(transferRootHash, {
      rootSetTxHash: transactionHash,
      rootSetBlockNumber: blockNumber
    })
  }

  async checkTransferRootSettledState (transferRootHash: string, totalBondsSettled: BigNumber) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }

    const logger = this.logger.create({ root: transferRootHash })
    const { transferIds } = dbTransferRoot
    if (!transferIds.length) {
      return
    }

    logger.debug(`transferIds count: ${transferIds.length}`)
    const dbTransfers: Transfer[] = []
    for (const transferId of transferIds) {
      const dbTransfer = await this.db.transfers.getByTransferId(transferId)
      if (!dbTransfer) {
        logger.warn(`transfer id ${transferId} db item not found`)
      }
      dbTransfers.push(dbTransfer)
      const withdrawalBondSettled = dbTransfer?.withdrawalBonded ?? false
      await this.db.transfers.update(transferId, {
        withdrawalBondSettled
      })
    }
    let rootAmountAllSettled = false
    if (totalBondsSettled) {
      rootAmountAllSettled = dbTransferRoot?.totalAmount?.eq(totalBondsSettled)
    }
    const allBondableTransfersSettled = dbTransfers.every(
      (dbTransfer: Transfer) => {
        // A transfer should not be settled if it is unbondable
        return !dbTransfer.isBondable || dbTransfer?.withdrawalBondSettled
      })
    const allSettled = rootAmountAllSettled || allBondableTransfersSettled
    logger.debug(`all settled: ${allSettled}`)
    await this.db.transferRoots.update(transferRootHash, {
      allSettled
    })
  }

  async populateTransferDbItem (transferId: string) {
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      throw new Error(`expected db transfer it, transferId: ${transferId}`)
    }

    await this.populateTransferSentTimestamp(transferId)
    await this.populateTransferWithdrawalBonder(transferId)
  }

  async populateTransferRootDbItem (transferRootHash: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    if (!dbTransferRoot) {
      throw new Error(`expected db transfer root item, transferRootHash: ${transferRootHash}`)
    }

    await this.populateTransferRootCommittedAt(transferRootHash)
    await this.populateTransferRootBondedAt(transferRootHash)
    await this.populateTransferRootTimestamp(transferRootHash)
    await this.populateTransferRootMultipleWithdrawSettled(transferRootHash)
  }

  async populateTransferSentTimestamp (transferId: string) {
    const logger = this.logger.create({ id: transferId })
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    const { transferSentTimestamp, transferSentBlockNumber, sourceChainId, destinationChainId } = dbTransfer
    if (
      !transferSentBlockNumber ||
      transferSentTimestamp
    ) {
      return
    }
    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId).bridge
    const timestamp = await sourceBridge.getBlockTimestamp(transferSentBlockNumber)
    logger.debug(`transferSentTimestamp: ${transferSentTimestamp}`)
    await this.db.transfers.update(transferId, {
      transferSentTimestamp: timestamp
    })
  }

  async populateTransferWithdrawalBonder (transferId: string) {
    const logger = this.logger.create({ id: transferId })
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    const { destinationChainId, withdrawalBondedTxHash, withdrawalBonder } = dbTransfer
    if (
      !withdrawalBondedTxHash ||
      withdrawalBonder
    ) {
      return
    }
    const destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    const tx = await destinationBridge.getTransaction(withdrawalBondedTxHash)
    if (!tx) {
      throw new Error(`expected tx object. transferId: ${transferId}`)
    }
    const { from } = tx
    logger.debug(`withdrawalBonder: ${from}`)
    await this.db.transfers.update(transferId, {
      withdrawalBonder: from
    })
  }

  async populateTransferRootCommittedAt (transferRootHash: string) {
    const logger = this.logger.create({ root: transferRootHash })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    const { sourceChainId, destinationChainId, commitTxHash, committedAt } = dbTransferRoot

    if (
      !commitTxHash ||
      committedAt
    ) {
      return
    }

    logger.debug('populating committedAt')
    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId).bridge
    const timestamp = await sourceBridge.getTransactionTimestamp(commitTxHash)
    logger.debug(`committedAt: ${timestamp}`)
    await this.db.transferRoots.update(transferRootHash, {
      committedAt: timestamp
    })
  }

  async populateTransferRootBondedAt (transferRootHash: string) {
    const logger = this.logger.create({ root: transferRootHash })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    const { bondTxHash, bondBlockNumber, bonder, bondedAt, sourceChainId, destinationChainId } = dbTransferRoot
    if (
      !bondTxHash ||
      (bonder && bondedAt)
    ) {
      return
    }

    const destinationBridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum).bridge
    const tx = await destinationBridge.getTransaction(bondTxHash)
    if (!tx) {
      throw new Error(`expected tx object. transactionHash: ${bondTxHash} transferRootHash: ${transferRootHash} chain: ${Chain.Ethereum}`)
    }
    const { from } = tx
    const timestamp = await destinationBridge.getBlockTimestamp(bondBlockNumber)

    logger.debug(`bonder: ${from}`)
    logger.debug(`bondedAt: ${timestamp}`)

    await this.db.transferRoots.update(transferRootHash, {
      bonder: from,
      bondedAt: timestamp
    })
  }

  async populateTransferRootTimestamp (transferRootHash: string) {
    const logger = this.logger.create({ root: transferRootHash })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    const { rootSetBlockNumber, rootSetTimestamp, destinationChainId } = dbTransferRoot
    if (
      !rootSetBlockNumber || rootSetTimestamp
    ) {
      return
    }
    const destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    const timestamp = await destinationBridge.getBlockTimestamp(rootSetBlockNumber)
    logger.debug(`rootSetTimestamp: ${timestamp}`)
    await this.db.transferRoots.update(transferRootHash, {
      rootSetTimestamp: timestamp
    })
  }

  async populateTransferRootMultipleWithdrawSettled (transferRootHash: string) {
    const logger = this.logger.create({ root: transferRootHash })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    const { multipleWithdrawalsSettledTxHash, multipleWithdrawalsSettledTotalAmount, transferIds, destinationChainId } = dbTransferRoot
    if (
      !multipleWithdrawalsSettledTxHash ||
      !multipleWithdrawalsSettledTotalAmount ||
      transferIds
    ) {
      return
    }

    const destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    const _transferIds = await destinationBridge.getTransferIdsFromSettleEventTransaction(multipleWithdrawalsSettledTxHash)
    const tree = new MerkleTree(_transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      logger.error(
        `computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}. List: ${JSON.stringify(_transferIds)}`
      )
    } else {
      await this.db.transferRoots.update(transferRootHash, {
        transferIds: _transferIds
      })
      await this.checkTransferRootSettledState(transferRootHash, multipleWithdrawalsSettledTotalAmount)
    }
  }

  async populateTransferRootTransferIds (transferRootHash: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }
    const { sourceChainId, destinationChainId, totalAmount, commitTxBlockNumber, transferIds: dbTransferIds } = dbTransferRoot

    if (
      dbTransferIds ||
      !(sourceChainId && destinationChainId && commitTxBlockNumber && totalAmount) ||
      isL1ChainId(sourceChainId)
    ) {
      return
    }

    const logger = this.logger.create({ root: transferRootHash })
    logger.debug(
      `looking for transfer ids for transferRootHash ${transferRootHash}`
    )
    if (!this.hasSiblingWatcher(sourceChainId)) {
      logger.error(`no sibling watcher found for ${sourceChainId}`)
      return
    }
    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId)
      .bridge as L2Bridge

    const eventBlockNumber: number = commitTxBlockNumber
    let startEvent: Event
    let endEvent: Event

    let startBlockNumber = sourceBridge.bridgeDeployedBlockNumber
    await sourceBridge.eventsBatch(async (start: number, end: number) => {
      let events = await sourceBridge.getTransfersCommittedEvents(start, end)
      if (!events?.length) {
        return true
      }

      // events need to be sorted from [newest...oldest] in order to pick up the endEvent first
      events = events.reverse()
      for (const event of events) {
        if (event.args.rootHash === transferRootHash) {
          endEvent = event
          continue
        }

        const eventDestinationChainId = Number(event.args.destinationChainId.toString())
        const isSameChainId = eventDestinationChainId === destinationChainId
        if (endEvent && isSameChainId) {
          startEvent = event
          return false
        }
      }

      return true
    },
    { endBlockNumber: eventBlockNumber, startBlockNumber })

    if (!endEvent) {
      return
    }

    const endBlockNumber = endEvent.blockNumber
    if (startEvent) {
      startBlockNumber = startEvent.blockNumber
    }

    logger.debug(`Searching for transfers between ${startBlockNumber} and ${endBlockNumber}`)

    const transfers: any[] = []
    await sourceBridge.eventsBatch(
      async (start: number, end: number) => {
        let transferEvents = await sourceBridge.getTransferSentEvents(
          start,
          end
        )

        // transferEvents need to be sorted from [newest...oldest] in order to maintain the ordering
        transferEvents = transferEvents.reverse()
        for (const event of transferEvents) {
          const eventDestinationChainId = Number(event.args.chainId.toString())
          const isSameChainId = eventDestinationChainId === destinationChainId
          if (!isSameChainId) {
            continue
          }

          // TransferSent events must be handled differently when they exist in the
          // same block or same transaction as a TransfersCommitted event
          if (startEvent && event.blockNumber === startEvent.blockNumber) {
            if (event.transactionIndex < startEvent.transactionIndex) {
              continue
            }
          }

          if (event.blockNumber === endEvent.blockNumber) {
            // If TransferSent is in the same tx as TransfersCommitted or later,
            // the transferId should be included in the next transferRoot
            if (event.transactionIndex >= endEvent.transactionIndex) {
              continue
            }
          }

          transfers.unshift({
            transferId: event.args.transferId,
            index: Number(event.args.index.toString())
          })
        }
      },
      { startBlockNumber, endBlockNumber }
    )

    logger.debug(`Original transfer ids: ${JSON.stringify(transfers)}}`)

    // this gets only the last set of sequence of transfers {0, 1,.., n}
    // where n is the transfer id index.
    // example: {0, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 1, 2, 3} ⟶  {0, 1, 2, 3}
    const lastIndexZero = transfers.map((x: any) => x.index).lastIndexOf(0)
    const filtered = transfers.slice(lastIndexZero)
    const transferIds = filtered.map((x: any) => x.transferId)

    const tree = new MerkleTree(transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      logger.error(
        `computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}. List: ${JSON.stringify(transferIds)}`
      )
      return
    }

    logger.debug(
      `found transfer ids for transfer root hash ${transferRootHash}`,
      JSON.stringify(transferIds)
    )

    const transferRootId = await this.bridge.getTransferRootId(
      transferRootHash,
      totalAmount
    )

    await this.db.transferRoots.update(transferRootHash, {
      transferIds,
      totalAmount,
      sourceChainId
    })

    for (const transferId of transferIds) {
      await this.db.transfers.update(transferId, {
        transferRootHash,
        transferRootId
      })
    }
  }

  handleMultipleWithdrawalsSettledEvent = async (event: Event) => {
    const { transactionHash } = event
    const {
      bonder,
      rootHash: transferRootHash,
      totalBondsSettled
    } = event.args
    const logger = this.logger.create({ root: transferRootHash })

    logger.debug('handling MultipleWithdrawalsSettled event')
    logger.debug(`tx hash from event: ${transactionHash}`)
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`bonder : ${bonder}`)
    logger.debug(`totalBondSettled: ${this.bridge.formatUnits(totalBondsSettled)}`)

    await this.db.transferRoots.update(transferRootHash, {
      multipleWithdrawalsSettledTxHash: transactionHash,
      multipleWithdrawalsSettledTotalAmount: totalBondsSettled
    })

    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    const transferIds = dbTransferRoot?.transferIds
    if (!transferIds) {
      return
    }

    await this.checkTransferRootSettledState(transferRootHash, totalBondsSettled)
  }

  getIsBondable = (
    transferId: string,
    amountOutMin: BigNumber,
    deadline: BigNumber,
    destinationChainId: number
  ): boolean => {
    // Remove when this hash has been resolved
    const invalidTransferIds: string[] = [
      '0x99b304c55afc0b56456dc4999913bafff224080b8a3bbe0e5a04aaf1eedf76b6'
    ]
    if (invalidTransferIds.includes(transferId)) {
      return false
    }

    const attemptSwap = this.bridge.shouldAttemptSwap(amountOutMin, deadline)
    if (attemptSwap && isL1ChainId(destinationChainId)) {
      return false
    }

    return true
  }

  isOruToL1 (destinationChainId: number) {
    const sourceChain = this.chainSlug
    const destinationChain = this.chainIdToSlug(destinationChainId)
    return destinationChain === Chain.Ethereum && oruChains.includes(sourceChain)
  }

  isNonOruToL1 (destinationChainId: number) {
    const sourceChain = this.chainSlug
    const destinationChain = this.chainIdToSlug(destinationChainId)
    return destinationChain === Chain.Ethereum && !oruChains.includes(sourceChain)
  }

  // ORU -> L1: (credit - debit - OruToL1PendingAmount - OruToAllUnbondedTransferRoots) / 2
  //    - divide by 2 because `amount` gets added to OruToL1PendingAmount
  //    - the divide by 2 happens upstream
  // nonORU -> L1: (credit - debit - OruToL1PendingAmount - OruToAllUnbondedTransferRoots)
  // L2 -> L2: (credit - debit)
  private async calculateAvailableCredit (destinationChainId: number, bonder?: string) {
    const sourceChain = this.chainSlug
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const destinationWatcher = this.getSiblingWatcherByChainSlug(destinationChain)
    if (!destinationWatcher) {
      throw new Error(`no destination watcher for ${destinationChain}`)
    }
    const destinationBridge = destinationWatcher.bridge
    let availableCredit = await destinationBridge.getBaseAvailableCredit(bonder)
    if (this.isOruToL1(destinationChainId) || this.isNonOruToL1(destinationChainId)) {
      const pendingAmount = await this.getOruToL1PendingAmount()
      availableCredit = availableCredit.sub(pendingAmount)

      const unbondedTransferRootAmounts = await this.getOruToAllUnbondedTransferRootAmounts()
      availableCredit = availableCredit.sub(unbondedTransferRootAmounts)
    }

    if (availableCredit.lt(0)) {
      return BigNumber.from(0)
    }

    return availableCredit
  }

  async calculatePendingAmount (destinationChainId: number) {
    const bridge = this.bridge as L2Bridge
    const pendingAmount = await bridge.getPendingAmountForChainId(destinationChainId)
    return pendingAmount
  }

  public async calculateUnbondedTransferRootAmounts (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const transferRoots = await this.db.transferRoots.getUnbondedTransferRoots({
      sourceChainId: this.chainSlugToId(this.chainSlug),
      destinationChainId
    })
    this.logger.debug(`getUnbondedTransferRoots ${this.chainSlug}→${destinationChain}:`, JSON.stringify(transferRoots.map(({ transferRootHash, totalAmount }: TransferRoot) => ({ transferRootHash, totalAmount }))))
    let totalAmount = BigNumber.from(0)
    for (const transferRoot of transferRoots) {
      totalAmount = totalAmount.add(transferRoot.totalAmount)
    }

    return totalAmount
  }

  private async updateAvailableCreditMap (destinationChainId: number) {
    const availableCredit = await this.calculateAvailableCredit(destinationChainId)
    const destinationChain = this.chainIdToSlug(destinationChainId)
    this.availableCredit[destinationChain] = availableCredit

    if (this.s3Upload) {
      const bonder = globalConfig.bonders[this.tokenSymbol]?.[0]
      const availableCredit = await this.calculateAvailableCredit(destinationChainId, bonder)
      this.s3AvailableCredit[destinationChain] = availableCredit
    }
  }

  private async updatePendingAmountsMap (destinationChainId: number) {
    const pendingAmount = await this.calculatePendingAmount(destinationChainId)
    const destinationChain = this.chainIdToSlug(destinationChainId)
    this.pendingAmounts[destinationChain] = pendingAmount
  }

  private async updateUnbondedTransferRootAmountsMap (destinationChainId: number) {
    const totalAmounts = await this.calculateUnbondedTransferRootAmounts(destinationChainId)
    const destinationChain = this.chainIdToSlug(destinationChainId)
    this.unbondedTransferRootAmounts[destinationChain] = totalAmounts
    this.lastCalculated[destinationChain] = Date.now()
  }

  async syncPendingAmounts () {
    const pendingAmounts = BigNumber.from(0)
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const sourceChain = this.chainSlug
      const destinationChain = this.chainIdToSlug(destinationChainId)
      if (
        this.chainSlug === Chain.Ethereum ||
        this.chainSlug === destinationChain
      ) {
        continue
      }
      await this.updatePendingAmountsMap(destinationChainId)
      const pendingAmounts = await this.getPendingAmounts(destinationChainId)
      this.logger.debug(`pendingAmounts (${this.tokenSymbol} ${sourceChain}→${destinationChain}): ${this.bridge.formatUnits(pendingAmounts)}`)
    }
  }

  async syncUnbondedTransferRootAmounts () {
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const sourceChain = this.chainSlug
      const destinationChain = this.chainIdToSlug(destinationChainId)
      const shouldSkip = (
        sourceChain === Chain.Ethereum ||
        sourceChain === destinationChain ||
        !this.hasSiblingWatcher(destinationChainId)
      )
      if (shouldSkip) {
        continue
      }
      await this.updateUnbondedTransferRootAmountsMap(destinationChainId)
      const unbondedTransferRootAmounts = this.getUnbondedTransferRootAmounts(destinationChainId)
      this.logger.debug(`unbondedTransferRootAmounts (${this.tokenSymbol} ${sourceChain}→${destinationChain}): ${this.bridge.formatUnits(unbondedTransferRootAmounts)}`)
    }
  }

  private async syncAvailableCredit () {
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const sourceChain = this.chainSlug
      const destinationChain = this.chainIdToSlug(destinationChainId)
      const shouldSkip = (
        sourceChain === Chain.Ethereum ||
        sourceChain === destinationChain ||
        !this.hasSiblingWatcher(destinationChainId)
      )
      if (shouldSkip) {
        continue
      }
      await this.updateAvailableCreditMap(destinationChainId)
      const availableCredit = await this.getEffectiveAvailableCredit(destinationChainId)
      this.logger.debug(`availableCredit (${this.tokenSymbol} ${sourceChain}→${destinationChain}): ${this.bridge.formatUnits(availableCredit)}`)
    }
  }

  async getOruToL1PendingAmount () {
    let pendingAmounts = BigNumber.from(0)
    for (const chain of oruChains) {
      const watcher = this.getSiblingWatcherByChainSlug(chain)
      if (!watcher) {
        continue
      }

      const destinationChainId = this.chainSlugToId(Chain.Ethereum)
      const pendingAmount = await watcher.calculatePendingAmount(destinationChainId)
      pendingAmounts = pendingAmounts.add(pendingAmount)
    }

    return pendingAmounts
  }

  async getOruToAllUnbondedTransferRootAmounts () {
    let totalAmount = BigNumber.from(0)
    for (const destinationChain in this.unbondedTransferRootAmounts) {
      if (this.lastCalculated[destinationChain]) {
        const isStale = Date.now() - this.lastCalculated[destinationChain] > TenMinutesMs
        if (isStale) {
          continue
        }
      }
      const amount = this.unbondedTransferRootAmounts[destinationChain]
      totalAmount = totalAmount.add(amount)
    }
    return totalAmount
  }

  public getEffectiveAvailableCredit (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const availableCredit = this.availableCredit[destinationChain]
    if (!availableCredit) {
      return BigNumber.from(0)
    }

    return availableCredit
  }

  public getPendingAmounts (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const pendingAmounts = this.pendingAmounts[destinationChain]
    if (!pendingAmounts) {
      return BigNumber.from(0)
    }

    return pendingAmounts
  }

  public getUnbondedTransferRootAmounts (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const unbondedAmounts = this.unbondedTransferRootAmounts[destinationChain]
    if (!unbondedAmounts) {
      return BigNumber.from(0)
    }

    return unbondedAmounts
  }

  async uploadToS3 () {
    if (!this.s3Upload) {
      return
    }

    const data : any = {
      availableCredit: {},
      pendingAmounts: {},
      unbondedTransferRootAmounts: {}
    }
    for (const chainId in this.siblingWatchers) {
      const sourceChain = this.chainIdToSlug(Number(chainId))
      const watcher = this.siblingWatchers[chainId]
      const shouldSkip = (
        sourceChain === Chain.Ethereum
      )
      if (shouldSkip) {
        continue
      }
      data.availableCredit[sourceChain] = watcher.s3AvailableCredit
      data.pendingAmounts[sourceChain] = watcher.pendingAmounts
      data.unbondedTransferRootAmounts[sourceChain] = watcher.unbondedTransferRootAmounts
    }

    s3JsonData[this.tokenSymbol] = data
    if (!s3LastUpload || s3LastUpload < Date.now() - (60 * 1000)) {
      s3LastUpload = Date.now()
      await this.s3Upload.upload(s3JsonData)
    }
  }
}

export default SyncWatcher
