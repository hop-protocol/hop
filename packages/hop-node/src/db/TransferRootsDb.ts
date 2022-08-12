import BaseDb, { KV, KeyFilter } from './BaseDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber } from 'ethers'
import {
  Chain,
  ChallengePeriodMs,
  OneHourMs,
  OneWeekMs,
  RelayableChains,
  RootSetSettleDelayMs,
  TimeFromL1ToL2Ms
} from 'src/constants'
import { isNitroLive, nitroStartTimestamp, TxRetryDelayMs, oruChains } from 'src/config'
import { normalizeDbItem } from './utils'

interface BaseTransferRoot {
  allSettled?: boolean
  bondBlockNumber?: number
  bonded?: boolean
  bondedAt?: number
  bonder?: string
  bondTxHash?: string
  challenged?: boolean
  committed?: boolean
  committedAt?: number
  commitTxBlockNumber?: number
  commitTxHash?: string
  confirmed?: boolean
  confirmedAt?: number
  confirmTxHash?: string
  destinationChainId?: number
  isNotFound?: boolean
  rootSetBlockNumber?: number
  rootSetTimestamp?: number
  rootSetTxHash?: string
  sentBondTxAt?: number
  sentCommitTxAt?: number
  sentConfirmTxAt?: number
  sentRelayTxAt?: number
  settleAttemptedAt?: number
  shouldBondTransferRoot?: boolean
  sourceChainId?: number
  totalAmount?: BigNumber
  transferIds?: string[]
  transferRootHash?: string
  withdrawalBondSettleTxSentAt?: number
}

export interface TransferRoot extends BaseTransferRoot {
  transferRootId: string
}

interface UpdateTransferRoot extends BaseTransferRoot {
  transferRootId?: string
}

type TransferRootsDateFilter = {
  fromUnix?: number
  toUnix?: number
}

type GetItemsFilter = Partial<TransferRoot> & {
  destinationChainIds?: number[]
}

interface MultipleWithdrawalsSettled {
  transferRootHash: string
  transferRootId: string
  bonder: string
  totalBondsSettled: BigNumber
  txHash: string
  blockNumber: number
  txIndex: number
  logIndex: number
}

type UnsettledTransferRoot = {
  transferRootId: string
  transferRootHash: string
  totalAmount: BigNumber
  transferIds: string[]
  destinationChainId: number
  rootSetTxHash: string
  committed: boolean
  committedAt: number
  allSettled: boolean
}

type UnbondedTransferRoot = {
  bonded: boolean
  bondedAt: number
  confirmed: boolean
  transferRootHash: string
  transferRootId: string
  committedAt: number
  commitTxHash: string
  commitTxBlockNumber: number
  destinationChainId: number
  sourceChainId: number
  totalAmount: BigNumber
  transferIds: string[]
}

export type ExitableTransferRoot = {
  commitTxHash: string
  confirmed: boolean
  transferRootHash: string
  transferRootId: string
  totalAmount: BigNumber
  destinationChainId: number
  committed: boolean
  committedAt: number
}

export type RelayableTransferRoots = {
  transferRootId: string
  transferRootHash: string
  totalAmount: BigNumber
  destinationChainId: number
  confirmTxHash?: string
  bondTxHash?: string
}

export type ChallengeableTransferRoot = {
  transferRootId: string
  transferRootHash: string
  committed: boolean
  totalAmount: BigNumber
  bonded: boolean
  challenged: boolean
}

// structure:
// key: `transferRoot:<committedAt>:<transferRootId>`
// value: `{ transferRootId: <transferRootId> }`
// note: the "transferRoot" prefix is not required but requires a migration to remove
class SubDbTimestamps extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:timestampedKeys`, _namespace)
  }

  getTimestampedKey (transferRoot: TransferRoot) {
    if (transferRoot.committedAt && transferRoot.transferRootId) {
      return `transferRoot:${transferRoot.committedAt}:${transferRoot.transferRootId}`
    }
  }

  async insertItem (transferRoot: TransferRoot) {
    const { transferRootId } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    const key = this.getTimestampedKey(transferRoot)
    if (!key) {
      return
    }
    const exists = await this.getById(key)
    if (!exists) {
      logger.debug(`storing db transferRoot timestamped key item. key: ${key}`)
      await this._update(key, { transferRootId })
      logger.debug(`updated db transferRoot timestamped key item. key: ${key}`)
    }
  }

  async getFilteredKeyValues (dateFilter?: TransferRootsDateFilter) {
    // return only transfer-root keys that are within specified range (filter by timestamped keys)
    const filter: KeyFilter = {
      gte: 'transferRoot:',
      lte: 'transferRoot:~'
    }

    if (dateFilter != null) {
      if (dateFilter.fromUnix) {
        filter.gte = `transferRoot:${dateFilter.fromUnix}`
      }
      if (dateFilter.toUnix) {
        filter.lte = `transferRoot:${dateFilter.toUnix}~` // tilde is intentional
      }
    }

    return this.getKeyValues(filter)
  }
}

// structure:
// key: `<transferRootId>`
// value: `{ transferRootId: <transferRootId> }`
class SubDbIncompletes extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:incompleteItems`, _namespace)
  }

  async upsertItem (transferRoot: TransferRoot) {
    const { transferRootId } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    const isIncomplete = this.isItemIncomplete(transferRoot)
    const exists = await this.getById(transferRootId)
    const shouldUpsert = isIncomplete && !exists
    const shouldDelete = !isIncomplete && exists
    if (shouldUpsert) {
      logger.debug('updating db transferRoot incomplete key item')
      await this._update(transferRootId, { transferRootId })
      logger.debug('updated db transferRoot incomplete key item')
    } else if (shouldDelete) {
      logger.debug('deleting db transferRoot incomplete key item')
      await this.deleteById(transferRootId)
      logger.debug('deleted db transferRoot incomplete key item')
    }
  }

  isItemIncomplete (item: TransferRoot) {
    if (item.isNotFound) {
      return false
    }

    return (
      /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
      !item.sourceChainId ||
      !item.destinationChainId ||
      !item.commitTxBlockNumber ||
      (item.commitTxHash && !item.committedAt) ||
      (item.bondTxHash && (!item.bonder || !item.bondedAt)) ||
      (item.rootSetBlockNumber && !item.rootSetTimestamp) ||
      (item.sourceChainId && item.destinationChainId && item.commitTxBlockNumber && item.totalAmount && !item.transferIds)
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    )
  }
}

// structure:
// key: `<transferRootHash>`
// value: `{ transferRootId: <transferRootId> }`
class SubDbRootHashes extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:rootHashes`, _namespace)
  }

  async insertItem (transferRoot: TransferRoot) {
    const { transferRootId, transferRootHash } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    const key = transferRoot.transferRootHash
    if (!key) {
      return
    }
    const exists = await this.getById(key)
    if (!exists) {
      logger.debug(`storing db transferRoot rootHash key item. key: ${key}`)
      await this._update(key, { transferRootId })
      logger.debug(`updated db transferRoot rootHash key item. key: ${key}`)
    }
  }

  async getByTransferRootHash (transferRootHash: string) {
    const item = await this.getById(transferRootHash)
    return item?.transferRootId
  }
}

// structure:
// key: `<bondedAt>:<transferRootId>`
// value: `{ transferRootId: <transferRootId> }`
class SubDbBondedAt extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:rootBondedAt`, _namespace)
  }

  async insertItem (transferRoot: TransferRoot) {
    const { transferRootId, bondedAt } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    if (!bondedAt) {
      return
    }
    const key = `${bondedAt}:${transferRootId}`
    const exists = await this.getById(key)
    if (!exists) {
      logger.debug('inserting db transferRoot bondedAt key item')
      await this._update(key, { transferRootId })
    }
  }

  async getFilteredKeyValues (dateFilter: TransferRootsDateFilter) {
    const filter: KeyFilter = {
      gte: `${dateFilter.fromUnix}`
    }
    return this.getKeyValues(filter)
  }
}

// structure:
// key: `<transferRootId>:<txHash>`
// value: `{ ...MultipleWithdrawalsSettled }`
class SubDbMultipleWithdrawalsSettleds extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:multipleWithdrawalsSettleds`, _namespace)
  }

  getInsertKey (event: MultipleWithdrawalsSettled) {
    if (event.transferRootId && event.txHash) {
      return `${event.transferRootId}:${event.txHash}`
    }
  }

  async insertItem (event: MultipleWithdrawalsSettled) {
    const { transferRootId } = event
    const logger = this.logger.create({ id: transferRootId })
    const key = this.getInsertKey(event)
    if (!key) {
      return
    }
    const exists = await this.getById(key)
    if (!exists) {
      logger.debug(`storing db MultipleWithdrawalsSettled item. key: ${key}`)
      await this._update(key, event)
      logger.debug(`updated db MultipleWithdrawalsSettled item. key: ${key}`)
    }
  }

  async getEvents (transferRootId: string): Promise<MultipleWithdrawalsSettled[]> {
    const filter: KeyFilter = {
      gte: `${transferRootId}:`,
      lte: `${transferRootId}:~`
    }

    return this.getValues(filter)
  }
}

// structure:
// key: `<transferRootId>`
// value: `{ ...TransferRoot }`
class TransferRootsDb extends BaseDb {
  subDbTimestamps: SubDbTimestamps
  subDbIncompletes: SubDbIncompletes
  subDbRootHashes: SubDbRootHashes
  subDbBondedAt: SubDbBondedAt
  subDbMultipleWithdrawalsSettleds: SubDbMultipleWithdrawalsSettleds

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)

    this.subDbTimestamps = new SubDbTimestamps(prefix, _namespace)
    this.subDbIncompletes = new SubDbIncompletes(prefix, _namespace)
    this.subDbRootHashes = new SubDbRootHashes(prefix, _namespace)
    this.subDbBondedAt = new SubDbBondedAt(prefix, _namespace)
    this.subDbMultipleWithdrawalsSettleds = new SubDbMultipleWithdrawalsSettleds(prefix, _namespace)
    this.logger.debug('TransferRootsDb initialized')
  }

  private isRouteOk (filter: GetItemsFilter = {}, item: TransferRoot) {
    if (filter.sourceChainId) {
      if (!item.sourceChainId || filter.sourceChainId !== item.sourceChainId) {
        return false
      }
    }

    if (filter.destinationChainIds) {
      if (!item.destinationChainId || !filter.destinationChainIds.includes(item.destinationChainId)) {
        return false
      }
    }

    return true
  }

  private async upsertTransferRootItem (transferRoot: TransferRoot) {
    const { transferRootId } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    await this._update(transferRootId, transferRoot)
    const entry = await this.getById(transferRootId)
    logger.debug(`updated db transferRoot item. ${JSON.stringify(entry)}`)
    await this.subDbIncompletes.upsertItem(entry)
  }

  private normalizeItem (item: TransferRoot) {
    return normalizeDbItem(item)
  }

  async update (transferRootId: string, transferRoot: UpdateTransferRoot) {
    await this.tilReady()
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('update called')
    transferRoot.transferRootId = transferRootId

    await Promise.all([
      this.subDbTimestamps.insertItem(transferRoot as TransferRoot),
      this.subDbRootHashes.insertItem(transferRoot as TransferRoot),
      this.subDbBondedAt.insertItem(transferRoot as TransferRoot),
      this.upsertTransferRootItem(transferRoot as TransferRoot)
    ])
  }

  async getByTransferRootId (
    transferRootId: string
  ): Promise<TransferRoot> {
    await this.tilReady()
    const item: TransferRoot = await this.getById(transferRootId)
    return this.normalizeItem(item)
  }

  private readonly filterTimestampedKeyValues = (x: any) => {
    return x?.value?.transferRootId
  }

  private readonly sortItems = (a: any, b: any) => {
    return a?.committedAt - b?.committedAt
  }

  async getByTransferRootHash (
    transferRootHash: string
  ): Promise<TransferRoot | null> {
    await this.tilReady()
    const transferRootId = await this.subDbRootHashes.getByTransferRootHash(transferRootHash)
    if (!transferRootId) {
      return null
    }
    const item = await this.getById(transferRootId)
    return this.normalizeItem(item)
  }

  async getTransferRootIds (dateFilter?: TransferRootsDateFilter): Promise<string[]> {
    await this.tilReady()
    const kv = await this.subDbTimestamps.getFilteredKeyValues(dateFilter)
    return kv.map(this.filterTimestampedKeyValues).filter(this.filterExisty)
  }

  async getItems (dateFilter?: TransferRootsDateFilter): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRootIds = await this.getTransferRootIds(dateFilter)
    const batchedItems = await this.batchGetByIds(transferRootIds)
    const transferRoots = batchedItems.map(this.normalizeItem)
    const items = transferRoots.sort(this.sortItems)

    this.logger.debug(`items length: ${items.length}`)
    return items
  }

  async getTransferRoots (dateFilter?: TransferRootsDateFilter): Promise<TransferRoot[]> {
    await this.tilReady()
    return this.getItems(dateFilter)
  }

  // gets only transfer roots within range: now - 2 weeks ago
  async getTransferRootsFromTwoWeeks (): Promise<TransferRoot[]> {
    await this.tilReady()
    const fromUnix = Math.floor((Date.now() - (OneWeekMs * 2)) / 1000)
    return this.getTransferRoots({
      fromUnix
    })
  }

  async getBondedTransferRootsFromTwoWeeks (): Promise<TransferRoot[]> {
    await this.tilReady()
    const fromUnix = Math.floor((Date.now() - (OneWeekMs * 2)) / 1000)
    const items = await this.subDbBondedAt.getFilteredKeyValues({ fromUnix })
    const transferRootIds = items.map((item: KV) => item.value.transferRootId)
    const entries = await this.batchGetByIds(transferRootIds)
    return entries.map(this.normalizeItem)
  }

  async getUnbondedTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<UnbondedTransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    const filtered = transferRoots.filter(item => {
      if (!this.isRouteOk(filter, item)) {
        return false
      }

      if (filter.destinationChainId) {
        if (!item.destinationChainId || filter.destinationChainId !== item.destinationChainId) {
          return false
        }
      }

      if (item.isNotFound) {
        return false
      }

      let timestampOk = true
      if (item.sentBondTxAt) {
        timestampOk =
          item.sentBondTxAt + TxRetryDelayMs < Date.now()
      }

      return (
        !item.bonded &&
        !item.bondedAt &&
        !item.confirmed &&
        item.transferRootHash &&
        item.transferRootId &&
        item.committedAt &&
        item.commitTxHash &&
        item.commitTxBlockNumber &&
        item.destinationChainId &&
        item.sourceChainId &&
        item.shouldBondTransferRoot &&
        item.totalAmount &&
        timestampOk
      )
    })

    return filtered as UnbondedTransferRoot[]
  }

  async getExitableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<ExitableTransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    const filtered = transferRoots.filter(item => {
      if (!item.sourceChainId) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      let timestampOk = true
      if (item.sentConfirmTxAt) {
        timestampOk =
          item.sentConfirmTxAt + TxRetryDelayMs < Date.now()
      }

      let oruTimestampOk = true
      const sourceChain = chainIdToSlug(item.sourceChainId)
      const isSourceOru = oruChains.has(sourceChain)
      if (isSourceOru && item.committedAt) {
        const committedAtMs = item.committedAt * 1000
        // Add a buffer to allow validators to actually make the assertion transactions
        // https://discord.com/channels/585084330037084172/585085215605653504/912843949855604736
        const validatorBufferMs = OneHourMs * 10
        const oruExitTimeMs = OneWeekMs + validatorBufferMs
        oruTimestampOk =
          committedAtMs + oruExitTimeMs < Date.now()
      }

      // Do not exit ORU if there is no risk of challenge
      let oruShouldExit = true
      const isChallenged = item?.challenged === true
      if (isSourceOru && item?.bondedAt && !isChallenged) {
        const bondedAtMs: number = item.bondedAt * 1000
        const isChallengePeriodOver = bondedAtMs + ChallengePeriodMs < Date.now()
        if (isChallengePeriodOver) {
          oruShouldExit = false
        }
      }

      return (
        item.commitTxHash &&
        !item.confirmed &&
        item.transferRootHash &&
        item.transferRootId &&
        item.totalAmount &&
        item.destinationChainId &&
        item.committed &&
        item.committedAt &&
        timestampOk &&
        oruTimestampOk &&
        oruShouldExit
      )
    })

    return filtered as ExitableTransferRoot[]
  }

  async getRelayableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<RelayableTransferRoots[]> {
    await this.tilReady()
    // TODO: Remove this post-nitro
    if (!isNitroLive) {
      return []
    }
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    const filtered = transferRoots.filter(item => {
      if (!item.sourceChainId) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      if (!item.destinationChainId) {
        return false
      }

      const destinationChain = chainIdToSlug(item?.destinationChainId)
      if (!RelayableChains.includes(destinationChain)) {
        return false
      }

      // TODO: Remove this post-nitro
      if (item.bondedAt && item.bondedAt < nitroStartTimestamp) {
        return false
      }

      // TODO: Remove this post-nitro
      if (item.confirmedAt && item.confirmedAt < nitroStartTimestamp) {
        return false
      }

      const isSeenOnL1 = item?.confirmed ?? item?.bonded

      let sentTxTimestampOk = true
      if (item.sentRelayTxAt) {
        sentTxTimestampOk = item.sentRelayTxAt + TxRetryDelayMs < Date.now()
      }

      // bondedAt should be checked first because a root can have both but it should be bonded prior to being confirmed
      const seenOnL1Timestamp = item?.bondedAt ?? item?.confirmedAt
      const seenOnL1TimestampMs: number = seenOnL1Timestamp! * 1000
      const seenOnL1TimestampOk = seenOnL1TimestampMs + TimeFromL1ToL2Ms[destinationChain] < Date.now()

      return (
        item.commitTxHash &&
        item.transferRootHash &&
        item.transferRootId &&
        item.committed &&
        item.committedAt &&
        isSeenOnL1 &&
        sentTxTimestampOk &&
        seenOnL1TimestampOk
      )
    })

    return filtered as RelayableTransferRoots[]
  }

  async getChallengeableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<ChallengeableTransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getBondedTransferRootsFromTwoWeeks()
    const filtered = transferRoots.filter(item => {
      if (!item.sourceChainId) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      let isWithinChallengePeriod = true
      const sourceChain = chainIdToSlug(item?.sourceChainId)
      const isSourceOru = oruChains.has(sourceChain)
      if (isSourceOru && item?.bondedAt) {
        const bondedAtMs: number = item.bondedAt * 1000
        const isChallengePeriodOver = bondedAtMs + ChallengePeriodMs < Date.now()
        if (isChallengePeriodOver) {
          isWithinChallengePeriod = false
        }
      }

      return (
        item.transferRootId &&
        item.transferRootHash &&
        !item.committed &&
        item.totalAmount &&
        item.bonded &&
        !item.challenged &&
        isWithinChallengePeriod
      )
    })

    return filtered as ChallengeableTransferRoot[]
  }

  async getUnsettledTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<UnsettledTransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    const filtered = transferRoots.filter(item => {
      if (!this.isRouteOk(filter, item)) {
        return false
      }

      if (filter.destinationChainId) {
        if (!item.destinationChainId || filter.destinationChainId !== item.destinationChainId) {
          return false
        }
      }

      // https://github.com/hop-protocol/hop/pull/140#discussion_r697919256
      let rootSetTimestampOk = true
      const checkRootSetTimestamp = item.rootSetTimestamp && filter.destinationChainId && chainIdToSlug(filter.destinationChainId) === Chain.Gnosis
      if (checkRootSetTimestamp) {
        rootSetTimestampOk = (item.rootSetTimestamp! * 1000) + RootSetSettleDelayMs < Date.now() // eslint-disable-line
      }

      let bondSettleTimestampOk = true
      if (item.withdrawalBondSettleTxSentAt) {
        bondSettleTimestampOk =
          (item.withdrawalBondSettleTxSentAt + TxRetryDelayMs) <
          Date.now()
      }

      let settleAttemptTimestampOk = true
      if (item.settleAttemptedAt) {
        settleAttemptTimestampOk = item.settleAttemptedAt + TxRetryDelayMs < Date.now()
      }

      return (
        item.transferRootId &&
        item.transferRootHash &&
        item.totalAmount &&
        item.transferIds &&
        item.destinationChainId &&
        item.rootSetTxHash &&
        item.committed &&
        item.committedAt &&
        !item.allSettled &&
        rootSetTimestampOk &&
        bondSettleTimestampOk &&
        settleAttemptTimestampOk
      )
    })

    return filtered as UnsettledTransferRoot[]
  }

  async getIncompleteItems (
    filter: GetItemsFilter = {}
  ) {
    await this.tilReady()
    const kv = await this.subDbIncompletes.getKeyValues()
    const transferRootIds = kv.map(this.filterTimestampedKeyValues).filter(this.filterExisty)
    if (!transferRootIds.length) {
      return []
    }

    const batchedItems = await this.batchGetByIds(transferRootIds)
    const transferRoots = batchedItems.map(this.normalizeItem)
    const filtered = transferRoots.filter((item: TransferRoot) => {
      if (filter.sourceChainId && item.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      if (item.isNotFound) {
        return false
      }

      return this.subDbIncompletes.isItemIncomplete(item)
    })

    return filtered
  }

  async updateMultipleWithdrawalsSettledEvent (event: MultipleWithdrawalsSettled) {
    await this.subDbMultipleWithdrawalsSettleds.insertItem(event)
  }

  async getMultipleWithdrawalsSettledTotalAmount (transferRootId: string) {
    // sum up all the totalBondsSettled amounts to get total settled amount
    const events = await this.subDbMultipleWithdrawalsSettleds.getEvents(transferRootId)
    let settledTotalAmount = BigNumber.from(0)
    for (const event of events) {
      settledTotalAmount = settledTotalAmount.add(event.totalBondsSettled)
    }
    return settledTotalAmount
  }

  async getMultipleWithdrawalsSettledTxHash (transferRootId: string) {
    const events = await this.subDbMultipleWithdrawalsSettleds.getEvents(transferRootId)

    // we can use any tx hash since we'll be using it to decode list of transfer ids upstream
    return events?.[0]?.txHash
  }
}

export default TransferRootsDb
