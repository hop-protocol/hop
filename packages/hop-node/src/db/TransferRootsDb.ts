import BaseDb, { KV, KeyFilter } from './BaseDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber } from 'ethers'
import { Chain, ChallengePeriodMs, OneHourMs, OneWeekMs, RootSetSettleDelayMs, TxRetryDelayMs } from 'src/constants'
import { normalizeDbItem } from './utils'
import { oruChains } from 'src/config'

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
  multipleWithdrawalsSettledTotalAmount?: BigNumber
  multipleWithdrawalsSettledTxHash?: string
  rootSetBlockNumber?: number
  rootSetTimestamp?: number
  rootSetTxHash?: string
  sentBondTxAt?: number
  sentCommitTxAt?: number
  sentConfirmTxAt?: number
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

const invalidTransferRoots: Record<string, boolean> = {
}

class TransferRootsDb extends BaseDb {
  subDbIncompletes: BaseDb
  subDbTimestamps: BaseDb
  subDbRootHashes: BaseDb
  subDbBondedAt: BaseDb

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)

    this.subDbTimestamps = new BaseDb(`${prefix}:timestampedKeys`, _namespace)
    this.subDbIncompletes = new BaseDb(`${prefix}:incompleteItems`, _namespace)
    this.subDbRootHashes = new BaseDb(`${prefix}:rootHashes`, _namespace)
    this.subDbBondedAt = new BaseDb(`${prefix}:rootBondedAt`, _namespace)
    this.logger.debug('TransferRootsDb initialized')
  }

  async migration () {
    this.logger.debug('TransferRootsDb migration started')
    const entries = await this.getKeyValues()
    this.logger.debug(`TransferRootsDb migration: ${entries.length} entries`)
    for (const entry of entries) {
      await this.insertBondedAtItem(entry.value)
    }
  }

  private isInvalidOrNotFound (item: TransferRoot) {
    const isNotFound = item?.isNotFound
    const isInvalid = invalidTransferRoots[item.transferRootId]
    return isNotFound || isInvalid // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
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

  private getTimestampedKey (transferRoot: TransferRoot) {
    if (transferRoot.committedAt && transferRoot.transferRootId) {
      return `transferRoot:${transferRoot.committedAt}:${transferRoot.transferRootId}`
    }
  }

  private async insertTimestampedKeyItem (transferRoot: TransferRoot) {
    const { transferRootId } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    const key = this.getTimestampedKey(transferRoot)
    if (key) {
      const exists = await this.subDbTimestamps.getById(key)
      if (!exists) {
        logger.debug(`storing db transferRoot timestamped key item. key: ${key}`)
        await this.subDbTimestamps._update(key, { transferRootId })
        logger.debug(`updated db transferRoot timestamped key item. key: ${key}`)
      }
    }
  }

  private async insertRootHashKeyItem (transferRoot: TransferRoot) {
    const { transferRootId, transferRootHash } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    const key = transferRoot.transferRootHash
    if (key) {
      const exists = await this.subDbRootHashes.getById(key)
      if (!exists) {
        logger.debug(`storing db transferRoot rootHash key item. key: ${key}`)
        await this.subDbRootHashes._update(key, { transferRootId })
        logger.debug(`updated db transferRoot rootHash key item. key: ${key}`)
      }
    }
  }

  private async upsertTransferRootItem (transferRoot: TransferRoot) {
    const { transferRootId } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    await this._update(transferRootId, transferRoot)
    const entry = await this.getById(transferRootId)
    logger.debug(`updated db transferRoot item. ${JSON.stringify(entry)}`)
    await this.upsertIncompleteItem(entry)
  }

  private async upsertIncompleteItem (transferRoot: TransferRoot) {
    const { transferRootId } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    const isIncomplete = this.isItemIncomplete(transferRoot)
    const exists = await this.subDbIncompletes.getById(transferRootId)
    const shouldUpsert = isIncomplete && !exists
    const shouldDelete = !isIncomplete && exists
    if (shouldUpsert) {
      logger.debug('updating db transferRoot incomplete key item')
      await this.subDbIncompletes._update(transferRootId, { transferRootId })
      logger.debug('updated db transferRoot incomplete key item')
    } else if (shouldDelete) {
      logger.debug('deleting db transferRoot incomplete key item')
      await this.subDbIncompletes.deleteById(transferRootId)
      logger.debug('deleted db transferRoot incomplete key item')
    }
  }

  private async insertBondedAtItem (transferRoot: TransferRoot) {
    const { transferRootId, bondedAt } = transferRoot
    const logger = this.logger.create({ id: transferRootId })
    if (!bondedAt) {
      return
    }
    const key = `${bondedAt}:${transferRootId}`
    const exists = await this.subDbBondedAt.getById(key)
    if (!exists) {
      logger.debug('inserting db transferRoot bondedAt key item')
      await this.subDbBondedAt._update(key, { transferRootId })
    }
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
      this.insertTimestampedKeyItem(transferRoot as TransferRoot),
      this.insertRootHashKeyItem(transferRoot as TransferRoot),
      this.insertBondedAtItem(transferRoot as TransferRoot),
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
    let item = await this.subDbRootHashes.getById(transferRootHash)
    if (!item?.transferRootId) {
      return null
    }
    item = await this.getById(item.transferRootId)
    return this.normalizeItem(item)
  }

  async getTransferRootIds (dateFilter?: TransferRootsDateFilter): Promise<string[]> {
    await this.tilReady()
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

    const kv = await this.subDbTimestamps.getKeyValues(filter)
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
    const filter: KeyFilter = {
      gte: `${fromUnix}`
    }
    const items = await this.subDbBondedAt.getKeyValues(filter)
    const transferRootIds = items.map((item: KV) => item.value.transferRootId)
    const entries = await this.batchGetByIds(transferRootIds)
    return entries.map(this.normalizeItem)
  }

  async getUnbondedTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      if (!this.isRouteOk(filter, item)) {
        return false
      }

      if (filter.destinationChainId) {
        if (!item.destinationChainId || filter.destinationChainId !== item.destinationChainId) {
          return false
        }
      }

      const shouldIgnoreItem = this.isInvalidOrNotFound(item)
      if (shouldIgnoreItem) {
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
  }

  async getExitableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
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
      const isSourceOru = oruChains.includes(sourceChain)
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
  }

  async getChallengeableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getBondedTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      if (!item.sourceChainId) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      let isWithinChallengePeriod = true
      const sourceChain = chainIdToSlug(item?.sourceChainId)
      const isSourceOru = oruChains.includes(sourceChain)
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
  }

  async getUnsettledTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
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
        bondSettleTimestampOk
      )
    })
  }

  isItemIncomplete (item: TransferRoot) {
    const shouldIgnoreItem = this.isInvalidOrNotFound(item)
    if (shouldIgnoreItem) {
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
      (item.sourceChainId && item.destinationChainId && item.commitTxBlockNumber && item.totalAmount && !item.transferIds) ||
      (item.multipleWithdrawalsSettledTxHash && item.multipleWithdrawalsSettledTotalAmount && !item.transferIds)
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    )
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
    return transferRoots.filter(item => {
      if (filter.sourceChainId && item.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      const shouldIgnoreItem = this.isInvalidOrNotFound(item)
      if (shouldIgnoreItem) {
        return false
      }

      return this.isItemIncomplete(item)
    })
  }
}

export default TransferRootsDb
