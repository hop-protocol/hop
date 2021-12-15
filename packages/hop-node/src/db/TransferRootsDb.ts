import BaseDb, { KeyFilter } from './BaseDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber } from 'ethers'
import { Chain, ChallengePeriodMs, OneHourMs, OneWeekMs, RootSetSettleDelayMs, TxRetryDelayMs } from 'src/constants'
import { normalizeDbItem } from './utils'
import { oruChains } from 'src/config'

export type TransferRoot = {
  transferRootId?: string
  transferRootHash?: string
  totalAmount?: BigNumber
  destinationChainId?: number
  sourceChainId?: number
  sentCommitTxAt: number
  committed?: boolean
  committedAt?: number
  commitTxHash?: string
  commitTxBlockNumber?: number
  confirmed?: boolean
  confirmedAt?: number
  confirmTxHash?: string
  rootSetTxHash?: string
  rootSetBlockNumber?: number
  rootSetTimestamp?: number
  sentConfirmTxAt?: number
  shouldBondTransferRoot?: boolean
  bonded?: boolean
  sentBondTxAt?: number
  bondTxHash?: string
  bondBlockNumber?: number
  bondedAt?: number
  transferIds?: string[]
  bonder?: string
  withdrawalBondSettleTxSentAt?: number
  bondTotalAmount?: BigNumber
  challenged?: boolean
  allSettled?: boolean
  multipleWithdrawalsSettledTxHash?: string
  multipleWithdrawalsSettledTotalAmount?: BigNumber
  isNotFound?: boolean
}

type TransferRootsDateFilter = {
  fromUnix?: number
  toUnix?: number
}

type GetItemsFilter = Partial<TransferRoot> & {
  destinationChainIds?: number[]
}

const invalidTransferRoots: Record<string, boolean> = {
  // Optimism pre-regenesis roots
  '0x063d5d24ca64f0c662b3f3339990ef6550eb4a5dee7925448d85b712dd38b9e5': true,
  '0x4c131e7af19d7dd1bc8ffe8e937ff8fcdb99bb1f09cc2e041f031e8c48d4d275': true,
  '0x843314ec24c31a00385ae66fb9f3bfe15b29bcd998681f0ba09b49ac500ffaee': true,
  '0x693d04548e6f7b6cafbd3761744411a2db98230de2d2ac372b310b59de42530a': true,
  '0xdcfab2fe9e84837b1cece4b3585ab355f8e51750f7e55a7a282da81bbdc0a5dd': true,
  '0xe3de2861ff4ca7046da4bd0345beb0a6fcb6fa09b108cc2d66f8bdfa7768fd70': true,
  '0xdfa48ba341de6478a8236a9efd9dd832569f2e7045d357a27ec89c8aeed25d19': true,
  '0xf3c01d73de571edcddc5a627726c1b5e1301da394a65d713cb489d3999cba52a': true,
  '0x8ce859861c32ee6608b45501e3a007165c9053b22e8f482edd2585746aa479b8': true,
  '0x3a098609751fa52d284ae86293873123238d2b676a6fc2b6620a34d3d83b362b': true,
  '0xd8b02ee1f0512ced8be25959c7650aeb9f6a5c60e3e63b1e322b5179545e9b73': true,
  '0x7d6cb1ee007a95756050f63d7f522b095eb2b3818207c2198fcdb90dc7fdc00c': true,
  '0x590778a6138164cfe808673fb3f707f3b16432c29c2d341cc97873bbc3218eae': true,
  '0xf2ccd9600ff6bf107fd16b076bf310ea456f14c9cee2a9c6abf1f394b2fe2489': true,
  '0x12a648e1dd69a7ae52e09eddc274d289280d80d5d5de7d0255a410de17ec3208': true,
  '0x00cd29b12bc3041a37a2cb64474f0726783c9b7cf6ce243927d5dc9f3473fb80': true,
  '0xa601b46a44a7a62c80560949eee70b437ba4a26049b0787a3eab76ad60b1c391': true,
  '0xbe12aa5c65bf2ebc59a8ebf65225d7496c59153e83d134102c5c3abaf3fd92e9': true,
  // Other
  '0xf902d5143ceee334fce5d56483024e0f4c476a1b5065d9d39d6c1deb6513b7bb': true
}

class TransferRootsDb extends BaseDb {
  subDbIncompletes: any
  subDbTimestamps: any
  subDbRootHashes: any

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)

    this.subDbTimestamps = new BaseDb(`${prefix}:timestampedKeys`, _namespace)
    this.subDbIncompletes = new BaseDb(`${prefix}:incompleteItems`, _namespace)
    this.subDbRootHashes = new BaseDb(`${prefix}:rootHashes`, _namespace)

    this.migration()
      .then(() => {
        this.ready = true
        this.logger.debug('db ready')
      })
      .catch(err => {
        this.logger.error(err)
      })
  }

  async migration () {
    // re-index timestamped db keys by transfer root id
    let items = await this.subDbTimestamps.getKeyValues()
    let promises: Array<Promise<any>> = []
    for (const { key, value } of items) {
      promises.push(new Promise(async (resolve) => {
        if (!value?.transferRootHash) {
          resolve(null)
          return
        }
        const item = await this.getById(value.transferRootHash)
        if (!item?.transferRootId) {
          resolve(null)
          return
        }
        const { transferRootId } = item
        const parts = key.split(':')
        if (parts.length < 2) {
          resolve(null)
          return
        }
        const newKey = `${parts[0]}:${parts[1]}:${transferRootId}`
        await this.subDbTimestamps._update(newKey, { transferRootId })
        await this.subDbTimestamps.deleteById(key)
        resolve(null)
      }))
    }

    await Promise.all(promises)

    // re-index incomplete db item keys by transfer root id
    items = await this.subDbIncompletes.getKeyValues()
    promises = []
    for (const { key, value } of items) {
      promises.push(new Promise(async (resolve) => {
        if (!value?.transferRootHash) {
          resolve(null)
          return
        }
        const item = await this.getById(value.transferRootHash)
        if (!item?.transferRootId) {
          resolve(null)
          return
        }
        const { transferRootId } = item
        await this.subDbIncompletes._update(transferRootId, { transferRootId })
        await this.subDbIncompletes.deleteById(key)
        resolve(null)
      }))
    }

    await Promise.all(promises)

    // re-index db keys by transfer root id
    items = await this.getKeyValues()
    promises = []
    for (const { key, value } of items) {
      promises.push(new Promise(async (resolve) => {
        if (!value?.transferRootId || key === value?.transferRootId) {
          resolve(null)
          return
        }
        const { transferRootId } = value
        await this._update(transferRootId, value)
        await this.deleteById(key)
        resolve(null)
      }))
    }

    await Promise.all(promises)
  }

  async updateIncompleteItem (item: Partial<TransferRoot>) {
    if (!item) {
      this.logger.error('expected item', item)
      return
    }
    const { transferRootId } = item
    if (!transferRootId) {
      this.logger.error('expected transferRootId', item)
      return
    }
    const isIncomplete = this.isItemIncomplete(item)
    const exists = await this.subDbIncompletes.getById(transferRootId)
    const shouldUpsert = isIncomplete && !exists
    const shouldDelete = !isIncomplete && exists
    if (shouldUpsert) {
      await this.subDbIncompletes._update(transferRootId, { transferRootId })
    } else if (shouldDelete) {
      await this.subDbIncompletes.deleteById(transferRootId)
    }
  }

  getTimestampedKey (transferRoot: Partial<TransferRoot>) {
    if (transferRoot.committedAt && transferRoot.transferRootId) {
      const key = `transferRoot:${transferRoot.committedAt}:${transferRoot.transferRootId}`
      return key
    }
  }

  async getTimestampedKeyValueForUpdate (transferRoot: Partial<TransferRoot>) {
    if (!transferRoot) {
      this.logger.warn('expected transfer root object for timestamped key')
      return
    }
    const transferRootId = transferRoot.transferRootId
    const key = this.getTimestampedKey(transferRoot)
    if (!key) {
      this.logger.warn('expected timestamped key. incomplete transfer root:', JSON.stringify(transferRoot))
      return
    }
    if (!transferRootId) {
      this.logger.warn(`expected transfer root id for timestamped key. key: ${key} incomplete transfer root: `, JSON.stringify(transferRoot))
      return
    }
    const item = await this.subDbTimestamps.getById(key)
    const exists = !!item
    if (!exists) {
      const value = { transferRootId }
      return { key, value }
    }
  }

  async getRootHashKeyValueForUpdate (transferRoot: Partial<TransferRoot>) {
    if (!transferRoot) {
      this.logger.warn('expected transfer root object for root hash key')
      return
    }
    const transferRootId = transferRoot.transferRootId
    const key = transferRoot.transferRootHash
    if (!key) {
      this.logger.warn('expected root hash key. incomplete transfer root:', JSON.stringify(transferRoot))
      return
    }
    if (!transferRootId) {
      this.logger.warn(`expected transfer root id for root hash key. key: ${key} incomplete transfer root: `, JSON.stringify(transferRoot))
      return
    }
    const item = await this.subDbRootHashes.getById(key)
    const exists = !!item
    if (!exists) {
      const value = { transferRootId }
      return { key, value }
    }
  }

  async update (transferRootId: string, transferRoot: Partial<TransferRoot>) {
    await this.tilReady()
    const logger = this.logger.create({ root: transferRootId })
    logger.debug('update called')
    transferRoot.transferRootId = transferRootId
    const promises: Array<Promise<any>> = []
    const timestampedKv = await this.getTimestampedKeyValueForUpdate(transferRoot)
    if (timestampedKv) {
      logger.debug(`storing timestamped key. key: ${timestampedKv.key} transferRootId: ${transferRootId}`)
      promises.push(this.subDbTimestamps._update(timestampedKv.key, timestampedKv.value).then(() => {
        logger.debug(`updated db item. key: ${timestampedKv.key}`)
      }))
    }
    const rootHashKv = await this.getRootHashKeyValueForUpdate(transferRoot)
    if (rootHashKv) {
      logger.debug(`storing root hash key. key: ${rootHashKv.key} transferRootId: ${transferRootId}`)
      promises.push(this.subDbRootHashes._update(rootHashKv.key, rootHashKv.value).then(() => {
        logger.debug(`updated db item. key: ${rootHashKv.key}`)
      }))
    }
    promises.push(this._update(transferRootId, transferRoot).then(async () => {
      const entry = await this.getById(transferRootId)
      logger.debug(`updated db transferRoot item. ${JSON.stringify(entry)}`)
      await this.updateIncompleteItem(entry)
    }))
    await Promise.all(promises)
  }

  normalizeItem (item: Partial<TransferRoot>) {
    if (!item) {
      return item
    }
    return normalizeDbItem(item)
  }

  async getByTransferRootId (
    transferRootId: string
  ): Promise<TransferRoot> {
    await this.tilReady()
    const item: TransferRoot = await this.getById(transferRootId)
    return this.normalizeItem(item)
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

  filterTimestampedKeyValues = (x: any) => {
    return x?.value?.transferRootId
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

  sortItems = (a: any, b: any) => {
    return a?.committedAt - b?.committedAt
  }

  async getItems (dateFilter?: TransferRootsDateFilter): Promise<TransferRoot[]> {
    await this.tilReady()
    const transferRootIds = await this.getTransferRootIds(dateFilter)
    const batchedItems = await this.batchGetByIds(transferRootIds)
    const transferRoots = batchedItems.map(this.normalizeItem)

    const items = transferRoots
      .sort(this.sortItems)

    this.logger.debug(`items length: ${items.length}`)
    return items
  }

  async getTransferRoots (dateFilter?: TransferRootsDateFilter): Promise<TransferRoot[]> {
    await this.tilReady()
    return await this.getItems(dateFilter)
  }

  // gets only transfer roots within range: now - 2 weeks ago
  async getTransferRootsFromTwoWeeks (): Promise<TransferRoot[]> {
    await this.tilReady()
    const fromUnix = Math.floor((Date.now() - (OneWeekMs * 2)) / 1000)
    return await this.getTransferRoots({
      fromUnix
    })
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
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
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
      const checkRootSetTimestamp = item.rootSetTimestamp && filter.destinationChainId && chainIdToSlug(filter.destinationChainId) === Chain.xDai
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

  isItemIncomplete (item: Partial<TransferRoot>) {
    if (!item?.transferRootId) {
      return false
    }

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
    filter: Partial<TransferRoot> = {}
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

  isInvalidOrNotFound (item: Partial<TransferRoot>) {
    const isNotFound = item?.isNotFound
    const isInvalid = invalidTransferRoots[item.transferRootId!] // eslint-disable-line @typescript-eslint/no-non-null-assertion
    return isNotFound || isInvalid // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
  }

  isRouteOk (filter: GetItemsFilter = {}, item: Partial<TransferRoot>) {
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
}

export default TransferRootsDb
