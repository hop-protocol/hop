import BaseWatcher from './classes/BaseWatcher'
import L1Bridge from './classes/L1Bridge'
import L2Bridge from './classes/L2Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import S3Upload from 'src/aws/s3Upload'
import chunk from 'lodash/chunk'
import getBlockNumberFromDate from 'src/utils/getBlockNumberFromDate'
import getRpcProvider from 'src/utils/getRpcProvider'
import isL1ChainId from 'src/utils/isL1ChainId'
import wait from 'src/utils/wait'
import { BigNumber } from 'ethers'
import { Chain, OneWeekMs, TenMinutesMs } from 'src/constants'
import { DateTime } from 'luxon'
import { L1Bridge as L1BridgeContract, MultipleWithdrawalsSettledEvent, TransferBondChallengedEvent, TransferRootBondedEvent, TransferRootConfirmedEvent, TransferRootSetEvent, WithdrawalBondedEvent, WithdrewEvent } from '@hop-protocol/core/contracts/L1Bridge'
import { L1ERC20Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/L1ERC20Bridge'
import { L2Bridge as L2BridgeContract, TransferSentEvent, TransfersCommittedEvent } from '@hop-protocol/core/contracts/L2Bridge'
import { Transfer } from 'src/db/TransfersDb'
import { TransferRoot } from 'src/db/TransferRootsDb'
import { config as globalConfig, oruChains } from 'src/config'

type S3JsonData = {
  [token: string]: {
    baseAvailableCredit: {[chain: string]: string}
    availableCredit: {[chain: string]: string}
    pendingAmounts: {[chain: string]: string}
    unbondedTransferRootAmounts: {[chain: string]: string}
  }
}

// TODO: better way of managing aggregate state
const s3JsonData: S3JsonData = {}
let s3LastUpload: number

type Config = {
  chainSlug: string
  tokenSymbol: string
  label: string
  isL1: boolean
  bridgeContract: L1BridgeContract | L1ERC20BridgeContract | L2BridgeContract
  syncFromDate?: string
  s3Upload?: boolean
  s3Namespace?: string
  gasCostPollEnabled?: boolean
}

class SyncWatcher extends BaseWatcher {
  initialSyncCompleted: boolean = false
  resyncIntervalMs: number = 60 * 1000
  gasCostPollMs: number = 60 * 1000
  gasCostPollEnabled: boolean = false
  syncIndex: number = 0
  syncFromDate: string
  customStartBlockNumber: number
  ready: boolean = false
  private baseAvailableCredit: { [destinationChain: string]: BigNumber } = {}
  private availableCredit: { [destinationChain: string]: BigNumber } = {}
  private pendingAmounts: { [destinationChain: string]: BigNumber } = {}
  private unbondedTransferRootAmounts: { [destinationChain: string]: BigNumber } = {}
  private lastCalculated: { [destinationChain: string]: number } = {}
  s3Upload: S3Upload
  s3Namespace: S3Upload
  bonderCreditPollerIncrementer: number = 0

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
    this.syncFromDate = config.syncFromDate!
    if (config.s3Upload) {
      this.s3Upload = new S3Upload({
        bucket: 'assets.hop.exchange',
        key: `${config.s3Namespace ?? globalConfig.network}/v1-available-liquidity.json`
      })
    }
    if (typeof config.gasCostPollEnabled === 'boolean') {
      this.gasCostPollEnabled = config.gasCostPollEnabled
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
      this.logger.debug(`syncing from syncFromDate with timestamp ${timestamp}`)
      this.customStartBlockNumber = await getBlockNumberFromDate(this.chainSlug, timestamp)
      this.logger.debug(`syncing from syncFromDate with blockNumber ${this.customStartBlockNumber}`)
    }
    this.ready = true
  }

  async start () {
    this.started = true
    try {
      await Promise.all([
        this.pollGasCost(),
        this.pollSync()
      ])
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
        this.logger.debug(`done syncing pure handlers. index: ${this.syncIndex}`)
        await this.incompletePollSync()
        this.logger.debug(`done syncing incomplete items. index: ${this.syncIndex}`)
        await this.postSyncHandler()
      } catch (err) {
        this.notifier.error(`pollSync error: ${err.message}`)
        this.logger.error('pollSync error:', err)
      }
    }
  }

  async incompletePollSync () {
    try {
      // Needs to be run synchronously because the transfers need to have the
      // withdrawalBonder entry completed
      await this.incompleteTransfersPollSync()
        .then(async () => await this.incompleteTransferRootsPollSync())
    } catch (err) {
      this.logger.error(`incomplete poll sync watcher error: ${err.message}\ntrace: ${err.stack}`)
    }
  }

  async incompleteTransferRootsPollSync () {
    try {
      const chunkSize = 20
      const incompleteTransferRoots = await this.db.transferRoots.getIncompleteItems({
        sourceChainId: this.chainSlugToId(this.chainSlug)
      })
      this.logger.info(`transfer roots incomplete items: ${incompleteTransferRoots.length}`)
      if (incompleteTransferRoots.length) {
        const allChunks = chunk(incompleteTransferRoots, chunkSize)
        for (const chunks of allChunks) {
          await Promise.all(chunks.map(async (transferRoot: TransferRoot) => {
            const { transferRootId } = transferRoot
            const logger = this.logger.create({ id: transferRootId })
            logger.debug(`populating transferRoot id: ${transferRootId}`)
            return this.populateTransferRootDbItem(transferRootId)
              .catch((err: Error) => {
                logger.error('populateTransferRootDbItem error:', err)
                this.notifier.error(`populateTransferRootDbItem error: ${err.message}`)
              })
          }))
        }
      }
    } catch (err: any) {
      this.logger.error(`incomplete transfer roots poll sync watcher error: ${err.message}\ntrace: ${err.stack}`)
      this.notifier.error(`incomplete transfer roots poll sync watcher error: ${err.message}`)
    }
  }

  async incompleteTransfersPollSync () {
    try {
      const chunkSize = 20
      const incompleteTransfers = await this.db.transfers.getIncompleteItems({
        sourceChainId: this.chainSlugToId(this.chainSlug)
      })
      this.logger.info(`transfers incomplete items: ${incompleteTransfers.length}`)
      if (incompleteTransfers.length) {
        const allChunks = chunk(incompleteTransfers, chunkSize)
        for (const chunks of allChunks) {
          await Promise.all(chunks.map(async (transfer: Transfer) => {
            const { transferId } = transfer
            const logger = this.logger.create({ id: transferId })
            logger.debug(`populating transferId: ${transferId}`)
            return this.populateTransferDbItem(transferId)
              .catch((err: Error) => {
                logger.error('populateTransferDbItem error:', err)
                this.notifier.error(`populateTransferDbItem error: ${err.message}`)
              })
          }))
        }
      }
    } catch (err: any) {
      this.logger.error(`incomplete transfers poll sync watcher error: ${err.message}\ntrace: ${err.stack}`)
      this.notifier.error(`incomplete transfer poll sync watcher error: ${err.message}`)
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
    const promises: Array<Promise<any>> = []
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
      const options = {
        cacheKey: useCacheKey ? this.cacheKey(keyName) : undefined,
        startBlockNumber
      }
      this.logger.debug(`syncing with options: ${JSON.stringify(options)}`)
      return options
    }

    const transferRootInitialEventPromises: Array<Promise<any>> = []
    if (this.isL1) {
      const l1Bridge = this.bridge as L1Bridge
      transferRootInitialEventPromises.push(
        l1Bridge.mapTransferRootBondedEvents(
          async (event: TransferRootBondedEvent) => {
            return await this.handleTransferRootBondedEvent(event)
          },
          getOptions(l1Bridge.TransferRootBonded)
        )
      )

      promises.push(
        l1Bridge.mapTransferRootConfirmedEvents(
          async (event: TransferRootConfirmedEvent) => {
            return await this.handleTransferRootConfirmedEvent(event)
          },
          getOptions(l1Bridge.TransferRootConfirmed)
        )
      )

      promises.push(
        l1Bridge.mapTransferBondChallengedEvents(
          async (event: TransferBondChallengedEvent) => {
            return await this.handleTransferBondChallengedEvent(event)
          },
          getOptions(l1Bridge.TransferBondChallenged)
        )
      )
    }

    if (!this.isL1) {
      const l2Bridge = this.bridge as L2Bridge
      promises.push(
        l2Bridge.mapTransferSentEvents(
          async (event: TransferSentEvent) => {
            return await this.handleTransferSentEvent(event)
          },
          getOptions(l2Bridge.TransferSent)
        )
      )

      transferRootInitialEventPromises.push(
        l2Bridge.mapTransfersCommittedEvents(
          async (event: TransfersCommittedEvent) => {
            return await Promise.all([
              this.handleTransfersCommittedEvent(event)
            ])
          },
          getOptions(l2Bridge.TransfersCommitted)
        )
      )
    }

    const transferSpentPromises: Array<Promise<any>> = []
    transferSpentPromises.push(
      this.bridge.mapWithdrawalBondedEvents(
        async (event: WithdrawalBondedEvent) => {
          return await this.handleWithdrawalBondedEvent(event)
        },
        getOptions(this.bridge.WithdrawalBonded)
      )
    )

    transferSpentPromises.push(
      this.bridge.mapWithdrewEvents(
        async (event: WithdrewEvent) => {
          return await this.handleWithdrewEvent(event)
        },
        getOptions(this.bridge.Withdrew)
      )
    )

    promises.push(
      Promise.all(transferSpentPromises.concat(transferRootInitialEventPromises))
        .then(async () => {
        // This must be executed after the Withdrew and WithdrawalBonded event handlers
        // on initial sync since it relies on data from those handlers.
          return await this.bridge.mapMultipleWithdrawalsSettledEvents(
            async (event: MultipleWithdrawalsSettledEvent) => {
              return await this.handleMultipleWithdrawalsSettledEvent(event)
            },
            getOptions(this.bridge.MultipleWithdrawalsSettled)
          )
        })
    )

    promises.push(
      this.bridge.mapTransferRootSetEvents(
        async (event: TransferRootSetEvent) => {
          return await this.handleTransferRootSetEvent(event)
        },
        getOptions(this.bridge.TransferRootSet)
      )
    )

    // these must come after db is done syncing,
    // and syncAvailableCredit must be last
    await Promise.all(promises)
      .then(async () => await this.syncBonderCredit())
  }

  async syncBonderCredit () {
    this.bonderCreditPollerIncrementer++
    const bonderCreditSyncInterval = 10
    // Don't check the 0 remainder so that the bonder has a valid credit immediately on startup
    const shouldSync = this.bonderCreditPollerIncrementer % bonderCreditSyncInterval === 1

    // When not uploading to S3, only sync on certain poll intervals
    if (!this.s3Upload && !shouldSync) {
      return
    }

    this.logger.debug('syncing bonder credit')
    await this.syncUnbondedTransferRootAmounts()
      .then(async () => await this.syncPendingAmounts())
      .then(async () => await this.syncAvailableCredit())
  }

  async handleTransferSentEvent (event: TransferSentEvent) {
    const {
      transferId,
      chainId: destinationChainIdBn,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      index
    } = event.args
    const logger = this.logger.create({ id: transferId })
    logger.debug('handling TransferSent event')

    try {
      const { transactionHash, transactionIndex } = event
      const transferSentIndex: number = index.toNumber()
      const blockNumber: number = event.blockNumber
      const l2Bridge = this.bridge as L2Bridge
      const destinationChainId = Number(destinationChainIdBn.toString())
      const sourceChainId = await l2Bridge.getChainId()
      const isBondable = this.getIsBondable(amountOutMin, deadline, destinationChainId)

      logger.debug('sourceChainId:', sourceChainId)
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('isBondable:', isBondable)
      logger.debug('transferId:', transferId)
      logger.debug('amount:', this.bridge.formatUnits(amount))
      logger.debug('bonderFee:', this.bridge.formatUnits(bonderFee))
      logger.debug('amountOutMin:', this.bridge.formatUnits(amountOutMin))
      logger.debug('deadline:', deadline.toString())
      logger.debug('transferSentIndex:', transferSentIndex)
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
        transferSentIndex
      })

      logger.debug('handleTransferSentEvent: stored transfer item')
    } catch (err) {
      logger.error(`handleTransferSentEvent error: ${err.message}`)
      this.notifier.error(`handleTransferSentEvent error: ${err.message}`)
    }
  }

  async handleWithdrawalBondedEvent (event: WithdrawalBondedEvent) {
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
      transferSpentTxHash: transactionHash,
      withdrawalBondSettled: false
    })
  }

  async handleWithdrewEvent (event: WithdrewEvent) {
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

  async handleTransferRootConfirmedEvent (event: TransferRootConfirmedEvent) {
    const {
      rootHash: transferRootHash,
      totalAmount
    } = event.args
    const transferRootId = this.bridge.getTransferRootId(transferRootHash, totalAmount)
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('handling TransferRootConfirmed event')

    try {
      const { transactionHash } = event
      await this.db.transferRoots.update(transferRootId, {
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

  async handleTransferRootBondedEvent (event: TransferRootBondedEvent) {
    const { transactionHash, blockNumber } = event
    const { root: transferRootHash, amount: totalAmount } = event.args
    const transferRootId = this.bridge.getTransferRootId(transferRootHash, totalAmount)

    const logger = this.logger.create({ root: transferRootId })
    logger.debug('handling TransferRootBonded event')

    try {
      logger.debug(`transferRootHash from event: ${transferRootHash}`)
      logger.debug(`event transactionHash: ${transactionHash}`)
      logger.debug(`event blockNumber: ${blockNumber}`)
      logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
      logger.debug(`transferRootId: ${transferRootId}`)

      await this.db.transferRoots.update(transferRootId, {
        transferRootHash,
        bonded: true,
        bondTxHash: transactionHash,
        bondBlockNumber: blockNumber,
        totalAmount
      })
    } catch (err) {
      logger.error(`handleTransferRootBondedEvent error: ${err.message}`)
      this.notifier.error(`handleTransferRootBondedEvent error: ${err.message}`)
    }
  }

  async handleTransfersCommittedEvent (event: TransfersCommittedEvent) {
    const {
      destinationChainId: destinationChainIdBn,
      rootHash: transferRootHash,
      totalAmount,
      rootCommittedAt: committedAtBn
    } = event.args
    const transferRootId = this.bridge.getTransferRootId(transferRootHash, totalAmount)
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('handling TransfersCommitted event')

    try {
      const committedAt = Number(committedAtBn.toString())
      const { transactionHash, blockNumber } = event
      const sourceChainId = await this.bridge.getChainId()
      const destinationChainId = Number(destinationChainIdBn.toString())

      const sourceChainSlug = this.chainIdToSlug(sourceChainId)
      const shouldBondTransferRoot = oruChains.includes(sourceChainSlug)

      logger.debug('transferRootId:', transferRootId)
      logger.debug('committedAt:', committedAt)
      logger.debug('totalAmount:', this.bridge.formatUnits(totalAmount))
      logger.debug('transferRootHash:', transferRootHash)
      logger.debug('destinationChainId:', destinationChainId)
      logger.debug('shouldBondTransferRoot:', shouldBondTransferRoot)

      await this.db.transferRoots.update(transferRootId, {
        transferRootHash,
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

  async handleTransferBondChallengedEvent (event: TransferBondChallengedEvent) {
    const {
      transferRootId,
      rootHash: transferRootHash,
      originalAmount
    } = event.args
    const logger = this.logger.create({ root: transferRootId })
    const { transactionHash } = event

    logger.debug('handling TransferBondChallenged event')
    logger.debug(`transferRootId: ${transferRootId}`)
    logger.debug(`transferRootHash: ${transferRootHash}`)
    logger.debug(`originalAmount: ${this.bridge.formatUnits(originalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)

    await this.db.transferRoots.update(transferRootId, {
      transferRootHash,
      challenged: true
    })
  }

  async handleTransferRootSetEvent (event: TransferRootSetEvent) {
    const {
      rootHash: transferRootHash,
      totalAmount
    } = event.args
    const transferRootId = this.bridge.getTransferRootId(transferRootHash, totalAmount)
    const logger = this.logger.create({ root: transferRootId })
    const { transactionHash, blockNumber } = event

    logger.debug('handling TransferRootSet event')
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`bondAmount: ${this.bridge.formatUnits(totalAmount)}`)
    logger.debug(`event transactionHash: ${transactionHash}`)

    await this.db.transferRoots.update(transferRootId, {
      transferRootHash,
      rootSetTxHash: transactionHash,
      rootSetBlockNumber: blockNumber
    })
  }

  async checkTransferRootSettledState (transferRootId: string, totalBondsSettled: BigNumber, bonder: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }

    const logger = this.logger.create({ root: transferRootId })
    const { transferIds } = dbTransferRoot
    if (transferIds === undefined || !transferIds.length) {
      return
    }

    logger.debug(`transferIds count: ${transferIds.length}`)
    const dbTransfers: Transfer[] = []
    await Promise.all(transferIds.map(async transferId => {
      const dbTransfer = await this.db.transfers.getByTransferId(transferId)
      if (!dbTransfer) {
        logger.warn(`transfer id ${transferId} db item not found`)
      }
      dbTransfers.push(dbTransfer)
      if (dbTransfer?.withdrawalBondSettled) {
        return
      }

      const isBonded = dbTransfer?.withdrawalBonded ?? false
      const isSameBonder = dbTransfer?.withdrawalBonder === bonder
      const isWithdrawalSettled = isBonded && isSameBonder
      await this.db.transfers.update(transferId, {
        withdrawalBondSettled: isWithdrawalSettled
      })
    }))

    logger.debug('transferIds checking allSettled')
    let rootAmountAllSettled = false
    if (totalBondsSettled) {
      rootAmountAllSettled = dbTransferRoot?.totalAmount?.eq(totalBondsSettled) ?? false
    }
    const allBondableTransfersSettled = this.getIsDbTransfersAllSettled(dbTransfers)
    const allSettled = rootAmountAllSettled || allBondableTransfersSettled
    logger.debug(`all settled: ${allSettled}`)
    await this.db.transferRoots.update(transferRootId, {
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

  async populateTransferRootDbItem (transferRootId: string) {
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error(`expected db transfer root item, transferRootId: ${transferRootId}`)
    }

    await this.populateTransferRootCommittedAt(transferRootId)
    await this.populateTransferRootBondedAt(transferRootId)
    await this.populateTransferRootTimestamp(transferRootId)
    await this.populateTransferRootMultipleWithdrawSettled(transferRootId)
    await this.populateTransferRootTransferIds(transferRootId)
  }

  async populateTransferSentTimestamp (transferId: string) {
    const logger = this.logger.create({ id: transferId })
    logger.debug('starting populateTransferSentTimestamp')
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    const { transferSentTimestamp, transferSentBlockNumber, sourceChainId } = dbTransfer
    if (
      !transferSentBlockNumber ||
      transferSentTimestamp
    ) {
      logger.debug('populateTransferSentTimestamp already found')
      return
    }
    if (!sourceChainId) {
      logger.warn(`populateTransferSentTimestamp marking item not found: sourceChainId. dbItem: ${JSON.stringify(dbTransfer)}`)
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }
    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId).bridge
    const timestamp = await sourceBridge.getBlockTimestamp(transferSentBlockNumber)
    if (!timestamp) {
      logger.warn(`populateTransferSentTimestamp marking item not found: timestamp for block number ${transferSentBlockNumber} on sourceChainId ${sourceChainId}. dbItem: ${JSON.stringify(dbTransfer)}`)
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }
    logger.debug(`transferSentTimestamp: ${timestamp}`)
    await this.db.transfers.update(transferId, {
      transferSentTimestamp: timestamp
    })
  }

  async populateTransferWithdrawalBonder (transferId: string) {
    const logger = this.logger.create({ id: transferId })
    logger.debug('starting populateTransferWithdrawalBonder')
    const dbTransfer = await this.db.transfers.getByTransferId(transferId)
    const { destinationChainId, withdrawalBondedTxHash, withdrawalBonder } = dbTransfer
    if (
      !destinationChainId ||
      !withdrawalBondedTxHash ||
      withdrawalBonder
    ) {
      logger.debug('populateTransferWithdrawalBonder already found')
      return
    }
    const destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    const tx = await destinationBridge.getTransaction(withdrawalBondedTxHash)
    if (!tx) {
      logger.warn(`populateTransferWithdrawalBonder marking item not found: tx object with withdrawalBondedTxHash ${withdrawalBondedTxHash}. dbItem: ${JSON.stringify(dbTransfer)}`)
      await this.db.transfers.update(transferId, { isNotFound: true })
      return
    }
    const { from } = tx
    logger.debug(`withdrawalBonder: ${from}`)
    await this.db.transfers.update(transferId, {
      withdrawalBonder: from
    })
  }

  async populateTransferRootCommittedAt (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootCommittedAt')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    const { sourceChainId, commitTxHash, committedAt } = dbTransferRoot

    if (
      !commitTxHash ||
      committedAt
    ) {
      logger.debug('populateTransferRootCommittedAt already found')
      return
    }

    if (!sourceChainId) {
      logger.warn(`populateTransferRootCommittedAt marking item not found: sourceChainId. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }
    logger.debug('populating committedAt')
    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId).bridge
    const timestamp = await sourceBridge.getTransactionTimestamp(commitTxHash)
    if (!timestamp) {
      logger.warn(`populateTransferRootCommittedAt item not found. timestamp for commitTxHash: ${commitTxHash}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }
    logger.debug(`committedAt: ${timestamp}`)
    await this.db.transferRoots.update(transferRootId, {
      committedAt: timestamp
    })
  }

  async populateTransferRootBondedAt (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootBondedAt')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    const { bondTxHash, bondBlockNumber, bonder, bondedAt } = dbTransferRoot
    if (
      !bondTxHash ||
      (bonder && bondedAt)
    ) {
      logger.debug('populateTransferRootBondedAt already found')
      return
    }

    const destinationBridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum).bridge
    const tx = await destinationBridge.getTransaction(bondTxHash)
    if (!tx) {
      logger.warn(`populateTransferRootBondedAt marking item not found: tx object for transactionHash: ${bondTxHash} on chain: ${Chain.Ethereum}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }
    const { from } = tx
    const timestamp = await destinationBridge.getBlockTimestamp(bondBlockNumber)

    if (!timestamp) {
      logger.warn(`populateTransferRootBondedAt marking item not found. timestamp for bondBlockNumber: ${bondBlockNumber}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    logger.debug(`bonder: ${from}`)
    logger.debug(`bondedAt: ${timestamp}`)

    await this.db.transferRoots.update(transferRootId, {
      bonder: from,
      bondedAt: timestamp
    })
  }

  async populateTransferRootTimestamp (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootTimestamp')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    const { rootSetBlockNumber, rootSetTimestamp, destinationChainId } = dbTransferRoot
    if (
      !rootSetBlockNumber || rootSetTimestamp
    ) {
      logger.debug('populateTransferRootTimestamp already found')
      return
    }
    if (!destinationChainId) {
      return
    }
    const destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    const timestamp = await destinationBridge.getBlockTimestamp(rootSetBlockNumber)
    if (!timestamp) {
      logger.warn(`populateTransferRootTimestamp marking item not found. timestamp for rootSetBlockNumber: ${rootSetBlockNumber}. dbItem: ${JSON.stringify(dbTransferRoot)}`)
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }
    logger.debug(`rootSetTimestamp: ${timestamp}`)
    await this.db.transferRoots.update(transferRootId, {
      rootSetTimestamp: timestamp
    })
  }

  async populateTransferRootMultipleWithdrawSettled (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting transferRootMultipleWithdrawSettled')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    const { transferRootHash, multipleWithdrawalsSettledTxHash, multipleWithdrawalsSettledTotalAmount, transferIds, destinationChainId } = dbTransferRoot
    if (
      !multipleWithdrawalsSettledTxHash ||
      !multipleWithdrawalsSettledTotalAmount ||
      transferIds
    ) {
      logger.debug('populateTransferRootMultipleWithdrawSettled already found')
      return
    }

    if (!destinationChainId) {
      return
    }
    const destinationBridge = this.getSiblingWatcherByChainId(destinationChainId).bridge
    const { transferIds: _transferIds, bonder } = await destinationBridge.getParamsFromSettleEventTransaction(multipleWithdrawalsSettledTxHash)
    const tree = new MerkleTree(_transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      logger.warn(
        `populateTransferRootTimestamp computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}. isNotFound: true, List: ${JSON.stringify(_transferIds)}`
      )
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
    }

    await this.db.transferRoots.update(transferRootId, {
      transferIds: _transferIds
    })

    await Promise.all(_transferIds.map(async (transferId: string) => {
      await this.db.transfers.update(transferId, {
        transferRootHash,
        transferRootId
      })
    }))

    await this.checkTransferRootSettledState(transferRootId, multipleWithdrawalsSettledTotalAmount, bonder)
  }

  async populateTransferRootTransferIds (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('starting populateTransferRootTransferIds')
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }
    const { transferRootHash, sourceChainId, destinationChainId, totalAmount, commitTxBlockNumber, transferIds: dbTransferIds } = dbTransferRoot

    if (
      (dbTransferIds !== undefined && dbTransferIds.length > 0) ||
      !(sourceChainId && destinationChainId && commitTxBlockNumber && totalAmount) ||
      isL1ChainId(sourceChainId)
    ) {
      logger.debug('populateTransferRootTransferIds already found')
      return
    }

    let transferIds = await this.checkTransferRootFromDb(transferRootId)
    if (!transferIds) {
      transferIds = await this.checkTransferRootFromChain(transferRootId)
    }

    if (transferIds?.length) {
      await this.db.transferRoots.update(transferRootId, {
        transferIds,
        totalAmount,
        sourceChainId
      })
    }
  }

  async checkTransferRootFromDb (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }
    const { transferRootHash } = dbTransferRoot
    if (!transferRootHash) {
      throw new Error('expected transfer root hash')
    }
    logger.debug(
      `looking in db for transfer ids for transferRootHash ${transferRootHash}`
    )
    const items = await this.db.transfers.getTransfersWithTransferRootHash(transferRootHash)
    if (items.length) {
      const transferIds = items.map((item: Transfer) => item.transferId)
      if (transferIds.length) {
        const tree = new MerkleTree(transferIds)
        const computedTransferRootHash = tree.getHexRoot()
        if (computedTransferRootHash === transferRootHash) {
          logger.debug(
            `found db transfer ids in db for transferRootHash ${transferRootHash}`
          )
          return transferIds
        }
      }
    }

    logger.debug(
      `no db transfer ids found for transferRootHash ${transferRootHash}`
    )
  }

  async checkTransferRootFromChain (transferRootId: string) {
    const logger = this.logger.create({ root: transferRootId })
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootId(transferRootId)
    if (!dbTransferRoot) {
      throw new Error('expected db transfer root item')
    }
    const { transferRootHash, sourceChainId, destinationChainId, totalAmount, commitTxBlockNumber, transferIds: dbTransferIds } = dbTransferRoot
    if (!sourceChainId) {
      throw new Error('expected source chain id')
    }
    if (!commitTxBlockNumber) {
      throw new Error('expected commit tx block number')
    }
    if (!this.hasSiblingWatcher(sourceChainId)) {
      logger.error(`no sibling watcher found for ${sourceChainId}`)
      return
    }
    const sourceBridge = this.getSiblingWatcherByChainId(sourceChainId)
      .bridge as L2Bridge

    const eventBlockNumber: number = commitTxBlockNumber
    let startEvent: TransfersCommittedEvent | undefined
    let endEvent: TransfersCommittedEvent | undefined

    logger.debug(
      `looking on-chain for transfer ids for transferRootHash ${transferRootHash}`
    )

    let startBlockNumber = sourceBridge.bridgeDeployedBlockNumber
    await sourceBridge.eventsBatch(async (start: number, end: number) => {
      let events = await sourceBridge.getTransfersCommittedEvents(start, end)
      if (!events.length) {
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

          if (event.blockNumber === endEvent?.blockNumber) {
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

    logger.debug(`transfer ids: ${JSON.stringify(transfers)}}`)

    const transferIds = transfers.map((x: any) => x.transferId)
    const tree = new MerkleTree(transferIds)
    const computedTransferRootHash = tree.getHexRoot()
    if (computedTransferRootHash !== transferRootHash) {
      logger.warn(
        `populateTransferRootTransferIds computed transfer root hash doesn't match. Expected ${transferRootHash}, got ${computedTransferRootHash}. isNotFound: true, List: ${JSON.stringify(transferIds)}`
      )
      await this.db.transferRoots.update(transferRootId, { isNotFound: true })
      return
    }

    logger.debug(
      `found transfer ids for transfer root hash ${transferRootHash}`,
      JSON.stringify(transferIds)
    )

    await Promise.all(transferIds.map(async transferId => {
      await this.db.transfers.update(transferId, {
        transferRootHash,
        transferRootId
      })
    }))

    return transferIds
  }

  handleMultipleWithdrawalsSettledEvent = async (event: MultipleWithdrawalsSettledEvent) => {
    const { transactionHash } = event
    const {
      bonder,
      rootHash: transferRootHash,
      totalBondsSettled
    } = event.args
    const dbTransferRoot = await this.db.transferRoots.getByTransferRootHash(transferRootHash)
    // Throwing here is not ideal, but it is required because we don't have the context of the transferId
    // with this event data. We can only get it from prior events. We should always see other events
    // first, but in the case where we completely miss an event, we will explicitly throw here.
    if (!dbTransferRoot?.transferRootId) {
      throw new Error(`expected db item for transfer root hash "${transferRootHash}"`)
    }

    const { transferRootId } = dbTransferRoot
    const logger = this.logger.create({ root: transferRootId })

    logger.debug('handling MultipleWithdrawalsSettled event')
    logger.debug(`tx hash from event: ${transactionHash}`)
    logger.debug(`transferRootHash from event: ${transferRootHash}`)
    logger.debug(`bonder : ${bonder}`)
    logger.debug(`totalBondSettled: ${this.bridge.formatUnits(totalBondsSettled)}`)
    await this.db.transferRoots.update(transferRootId, {
      multipleWithdrawalsSettledTxHash: transactionHash,
      multipleWithdrawalsSettledTotalAmount: totalBondsSettled
    })

    const transferIds = dbTransferRoot?.transferIds
    if (!transferIds) {
      return
    }

    await this.checkTransferRootSettledState(transferRootId, totalBondsSettled, bonder)
  }

  getIsBondable = (
    amountOutMin: BigNumber,
    deadline: BigNumber,
    destinationChainId: number
  ): boolean => {
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

  // L2 -> L1: (credit - debit - OruToL1PendingAmount - OruToAllUnbondedTransferRoots)
  // L2 -> L2: (credit - debit)
  private async calculateAvailableCredit (destinationChainId: number, bonder?: string) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const destinationWatcher = this.getSiblingWatcherByChainSlug(destinationChain)
    if (!destinationWatcher) {
      throw new Error(`no destination watcher for ${destinationChain}`)
    }
    const destinationBridge = destinationWatcher.bridge
    const baseAvailableCredit = await destinationBridge.getBaseAvailableCredit(bonder)
    let availableCredit = baseAvailableCredit
    if (this.isOruToL1(destinationChainId) || this.isNonOruToL1(destinationChainId)) {
      const pendingAmount = await this.getOruToL1PendingAmount()
      availableCredit = availableCredit.sub(pendingAmount)

      const unbondedTransferRootAmounts = await this.getOruToAllUnbondedTransferRootAmounts()
      availableCredit = availableCredit.sub(unbondedTransferRootAmounts)
    }

    if (availableCredit.lt(0)) {
      availableCredit = BigNumber.from(0)
    }

    return { availableCredit, baseAvailableCredit }
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
      const { transferRootId } = transferRoot
      const l1Bridge = this.getSiblingWatcherByChainSlug(Chain.Ethereum).bridge as L1Bridge
      const isBonded = await l1Bridge.isTransferRootIdBonded(transferRootId)
      if (isBonded) {
        const logger = this.logger.create({ root: transferRootId })
        logger.warn('calculateUnbondedTransferRootAmounts already bonded. isNotFound: true')
        await this.db.transferRoots.update(transferRootId, { isNotFound: true })
        continue
      }

      totalAmount = totalAmount.add(transferRoot.totalAmount!)
    }

    return totalAmount
  }

  private async updateAvailableCreditMap (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const bonder = this.bridge.getConfigBonderAddress(destinationChain)
    const { availableCredit, baseAvailableCredit } = await this.calculateAvailableCredit(destinationChainId, bonder)
    this.availableCredit[destinationChain] = availableCredit
    this.baseAvailableCredit[destinationChain] = baseAvailableCredit
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
    // Individual bonders are not concerned about pending amounts
    if (!this.s3Upload) {
      return
    }

    this.logger.debug('syncing pending amounts: start')
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const sourceChain = this.chainSlug
      const destinationChain = this.chainIdToSlug(destinationChainId)
      if (
        this.chainSlug === Chain.Ethereum ||
        this.chainSlug === destinationChain
      ) {
        this.logger.debug('syncing pending amounts: skipping')
        continue
      }
      await this.updatePendingAmountsMap(destinationChainId)
      const pendingAmounts = this.getPendingAmounts(destinationChainId)
      this.logger.debug(`pendingAmounts (${this.tokenSymbol} ${sourceChain}→${destinationChain}): ${this.bridge.formatUnits(pendingAmounts)}`)
    }
  }

  async syncUnbondedTransferRootAmounts () {
    this.logger.debug('syncing unbonded transferRoot amounts: start')
    const chains = await this.bridge.getChainIds()
    for (const destinationChainId of chains) {
      const sourceChain = this.chainSlug
      const destinationChain = this.chainIdToSlug(destinationChainId)
      const isSourceChainOru = oruChains.includes(sourceChain)
      const shouldSkip = (
        !isSourceChainOru ||
        sourceChain === Chain.Ethereum ||
        sourceChain === destinationChain ||
        !this.hasSiblingWatcher(destinationChainId)
      )
      if (shouldSkip) {
        this.logger.debug(`syncing unbonded transferRoot amounts: skipping ${destinationChainId}`)
        continue
      }
      await this.updateUnbondedTransferRootAmountsMap(destinationChainId)
      const unbondedTransferRootAmounts = this.getUnbondedTransferRootAmounts(destinationChainId)
      this.logger.debug(`unbondedTransferRootAmounts (${this.tokenSymbol} ${sourceChain}→${destinationChain}): ${this.bridge.formatUnits(unbondedTransferRootAmounts)}`)
    }
  }

  private async syncAvailableCredit () {
    this.logger.debug('syncing available credit: start')
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
        this.logger.debug(`syncing available credit: skipping ${destinationChainId}`)
        continue
      }
      await this.updateAvailableCreditMap(destinationChainId)
      const availableCredit = this.getEffectiveAvailableCredit(destinationChainId)
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

  public getBaseAvailableCredit (destinationChainId: number) {
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const baseAvailableCredit = this.baseAvailableCredit[destinationChain]
    if (!baseAvailableCredit) {
      return BigNumber.from(0)
    }

    return baseAvailableCredit
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

    const data: any = {
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
      data.availableCredit[sourceChain] = watcher.availableCredit
      data.pendingAmounts[sourceChain] = watcher.pendingAmounts
      data.unbondedTransferRootAmounts[sourceChain] = watcher.unbondedTransferRootAmounts
    }

    s3JsonData[this.tokenSymbol] = data
    if (!s3LastUpload || s3LastUpload < Date.now() - (60 * 1000)) {
      s3LastUpload = Date.now()
      await this.s3Upload.upload(s3JsonData)
    }
  }

  public getIsDbTransfersAllSettled (dbTransfers: Transfer[]) {
    const allBondableTransfersSettled = dbTransfers.every(
      (dbTransfer: Transfer) => {
        const isAlreadySettled = dbTransfer?.withdrawalBondSettled
        // Check that isBondable has been explicitly set to false.
        // Checking !dbTransfer.isBondable is not correct since isBondable can be undefined
        const isExplicitySetUnbondable = dbTransfer?.isBondable === false
        return isAlreadySettled || isExplicitySetUnbondable // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
      }
    )

    return allBondableTransfersSettled
  }

  async pollGasCost () {
    if (!this.gasCostPollEnabled) {
      return
    }
    const bridgeContract = this.bridge.bridgeContract.connect(getRpcProvider(this.chainSlug)!) as L1BridgeContract | L2BridgeContract
    const amount = BigNumber.from(10)
    const amountOutMin = BigNumber.from(0)
    const bonderFee = BigNumber.from(1)
    const bonder = await this.bridge.getBonderAddress()
    const recipient = `0x${'1'.repeat(40)}`
    const transferNonce = `0x${'0'.repeat(64)}`

    while (true) {
      try {
        const txOverrides = await this.bridge.txOverrides()
        txOverrides.from = bonder

        const timestamp = Math.floor(Date.now() / 1000)
        const deadline = Math.floor((Date.now() + OneWeekMs) / 1000)
        const payload = [
          recipient,
          amount,
          transferNonce,
          bonderFee,
          txOverrides
        ] as const
        const gasLimit = await bridgeContract.estimateGas.bondWithdrawal(...payload)
        const tx = await bridgeContract.populateTransaction.bondWithdrawal(...payload)
        const estimates = [{ gasLimit, ...tx, attemptSwap: false }]

        if (this._isL2BridgeContract(bridgeContract) && bridgeContract.bondWithdrawalAndDistribute) {
          const payload = [
            recipient,
            amount,
            transferNonce,
            bonderFee,
            amountOutMin,
            deadline,
            txOverrides
          ] as const
          const gasLimit = await bridgeContract.estimateGas.bondWithdrawalAndDistribute(...payload)
          const tx = await bridgeContract.populateTransaction.bondWithdrawalAndDistribute(...payload)
          estimates.push({ gasLimit, ...tx, attemptSwap: true })
        }

        this.logger.debug('pollGasCost estimate. estimates complete')
        await Promise.all(estimates.map(async ({ gasLimit, data, to, attemptSwap }) => {
          const { gasCost, gasCostInToken, gasPrice, tokenPriceUsd, nativeTokenPriceUsd } = await this.bridge.getGasCostEstimation(
            this.chainSlug,
            this.tokenSymbol,
            gasLimit,
            data,
            to
          )

          this.logger.debug(`pollGasCost estimate. attemptSwap: ${attemptSwap}, gasLimit: ${gasLimit?.toString()}, gasPrice: ${gasPrice?.toString()}, gasCost: ${gasCost?.toString()}, gasCostInToken: ${gasCostInToken?.toString()}, tokenPriceUsd: ${tokenPriceUsd?.toString()}`)
          const minBonderFeeAbsolute = await this.bridge.getMinBonderFeeAbsolute(this.tokenSymbol, tokenPriceUsd)
          this.logger.debug(`pollGasCost estimate. minBonderFeeAbsolute: ${minBonderFeeAbsolute.toString()}`)

          await this.db.gasCost.addGasCost({
            chain: this.chainSlug,
            token: this.tokenSymbol,
            timestamp,
            attemptSwap,
            gasCost,
            gasCostInToken,
            gasPrice,
            gasLimit,
            tokenPriceUsd,
            nativeTokenPriceUsd,
            minBonderFeeAbsolute
          })
        }))
      } catch (err) {
        this.logger.error(`pollGasCost error: ${err.message}`)
      }
      await wait(this.gasCostPollMs)
    }
  }

  private _isL2BridgeContract (bridgeContract: L1BridgeContract | L2BridgeContract): bridgeContract is L2BridgeContract {
    return !this.isL1
  }
}

export default SyncWatcher
