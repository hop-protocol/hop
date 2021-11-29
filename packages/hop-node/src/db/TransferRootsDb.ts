import BaseDb, { KeyFilter } from './BaseDb'
import TimestampedKeysDb from './TimestampedKeysDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber } from 'ethers'
import { Chain, ChallengePeriodMs, OneHourMs, OneWeekMs, RootSetSettleDelayMs, TxRetryDelayMs } from 'src/constants'
import { normalizeDbItem } from './utils'
import { oruChains } from 'src/config'

export type TransferRootsDateFilter = {
  fromUnix?: number
  toUnix?: number
}

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
  bondTransferRootId?: string
  challenged?: boolean
  allSettled?: boolean
  multipleWithdrawalsSettledTxHash?: string
  multipleWithdrawalsSettledTotalAmount?: BigNumber
  isNotFound?: boolean
}

const invalidTransferRoots: Record<string, boolean> = {
  // Optimism pre-regenesis txs
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
  '0xbe12aa5c65bf2ebc59a8ebf65225d7496c59153e83d134102c5c3abaf3fd92e9': true
}

class TransferRootsDb extends TimestampedKeysDb<TransferRoot> {
  subDbIncompletes: any

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)
    this.subDbIncompletes = new BaseDb(`${prefix}:incompleteItems`, _namespace)

    this.ready = false
  }

  async updateIncompleteItem (item: Partial<TransferRoot>) {
    if (!item) {
      this.logger.error('expected item', item)
      return
    }
    const { transferRootHash } = item
    if (!transferRootHash) {
      this.logger.error('expected transferRootHash', item)
      return
    }
    const isIncomplete = this.isItemIncomplete(item)
    const exists = await this.subDbIncompletes.getById(transferRootHash)
    const shouldUpsert = isIncomplete && !exists
    const shouldDelete = !isIncomplete && exists
    if (shouldUpsert) {
      await this.subDbIncompletes._update(transferRootHash, { transferRootHash })
    } else if (shouldDelete) {
      await this.subDbIncompletes.deleteById(transferRootHash)
    }
  }

  async trackTimestampedKey (transferRoot: Partial<TransferRoot>) {
    const data = await this.getTimestampedKeyValueForUpdate(transferRoot)
    if (data != null) {
      const key = data.key
      const transferRootHash = data.value.transferRootHash
      this.logger.debug(`storing timestamped key. key: ${key} transferRootHash: ${transferRootHash}`)
      const value = { transferRootHash }
      await this.subDb._update(key, value)
    }
  }

  async trackTimestampedKeyByTransferRootHash (transferRootHash: string) {
    const transferRoot = await this.getByTransferRootHash(transferRootHash)
    return await this.trackTimestampedKey(transferRoot)
  }

  getTimestampedKey (transferRoot: Partial<TransferRoot>) {
    if (transferRoot.committedAt && transferRoot.transferRootHash) {
      const key = `transferRoot:${transferRoot.committedAt}:${transferRoot.transferRootHash}`
      return key
    }
  }

  async getTimestampedKeyValueForUpdate (transferRoot: Partial<TransferRoot>) {
    if (!transferRoot) {
      this.logger.warn('expected transfer root object for timestamped key')
      return
    }
    const transferRootHash = transferRoot.transferRootHash
    const key = this.getTimestampedKey(transferRoot)
    if (!key) {
      this.logger.warn('expected timestamped key. incomplete transfer root:', JSON.stringify(transferRoot))
      return
    }
    if (!transferRootHash) {
      this.logger.warn(`expected transfer root hash for timestamped key. key: ${key} incomplete transfer root: `, JSON.stringify(transferRoot))
      return
    }
    const item = await this.subDb.getById(key)
    const exists = !!item
    if (!exists) {
      const value = { transferRootHash }
      return { key, value }
    }
  }

  async update (transferRootHash: string, transferRoot: Partial<TransferRoot>) {
    const logger = this.logger.create({ root: transferRootHash })
    logger.debug('update called')
    transferRoot.transferRootHash = transferRootHash
    const timestampedKv = await this.getTimestampedKeyValueForUpdate(transferRoot)
    const promises: Array<Promise<any>> = []
    if (timestampedKv) {
      logger.debug(`storing timestamped key. key: ${timestampedKv.key} transferRootHash: ${transferRootHash}`)
      promises.push(this.subDb._update(timestampedKv.key, timestampedKv.value).then(() => {
        logger.debug(`updated db item. key: ${timestampedKv.key}`)
      }))
    }
    promises.push(this._update(transferRootHash, transferRoot).then(async () => {
      const entry = await this.getById(transferRootHash)
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

  async getByTransferRootHash (
    transferRootHash: string
  ): Promise<TransferRoot> {
    const item: TransferRoot = await this.getById(transferRootHash)
    return this.normalizeItem(item)
  }

  async getByTransferRootId (transferRootId: string): Promise<TransferRoot | null | undefined> {
    const transferRootHashes = await this.getTransferRootHashes()
    const filtered = (
      await Promise.all(
        transferRootHashes.map(async (transferRootHash: string) => {
          const item = await this.getByTransferRootHash(transferRootHash)
          if (item.transferRootId === transferRootId) {
            return item
          }
        })
      )
    ).filter(this.filterExisty)
    return filtered?.[0]
  }

  filterTimestampedKeyValues = (x: any) => {
    return x?.value?.transferRootHash
  }

  async getTransferRootHashes (dateFilter?: TransferRootsDateFilter): Promise<string[]> {
    // return only transfer-root keys that are within specified range (filter by timestamped keys)
    if (dateFilter != null) {
      const filter: KeyFilter = {}
      if (dateFilter.fromUnix) {
        filter.gte = `transferRoot:${dateFilter.fromUnix}`
      }
      if (dateFilter.toUnix) {
        filter.lte = `transferRoot:${dateFilter.toUnix}~` // tilde is intentional
      }
      const kv = await this.subDb.getKeyValues(filter)
      return kv.map(this.filterTimestampedKeyValues).filter(this.filterExisty)
    }

    // return all transfer-root keys if no filter is used (filter out timestamped keys)
    const keys = await this.getKeys()
    return keys.filter(this.filterExisty)
  }

  sortItems = (a: any, b: any) => {
    return a?.committedAt - b?.committedAt
  }

  async getItems (dateFilter?: TransferRootsDateFilter): Promise<TransferRoot[]> {
    const transferRootHashes = await this.getTransferRootHashes(dateFilter)
    const batchedItems = await this.batchGetByIds(transferRootHashes)
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

  async getUncommittedBondedTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      return !item.committed && item.transferIds?.length
    })
  }

  async getUnbondedTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      if (filter.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }
      if (filter.destinationChainId) {
        if (filter.destinationChainId !== item.destinationChainId) {
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
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      if (filter.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      if (!item.sourceChainId) {
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
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      // Do not check if a rootHash has been committed. A rootHash can be committed and bonded,
      // but if the bond uses a different totalAmount then it is fraudulent. Instead, use the
      // transferRootId. If transferRootIds do not match then we know the bond is fraudulent.

      if (!item.sourceChainId) {
        return false
      }

      let isValidItem = false
      if (item?.transferRootId) {
        isValidItem = item?.bondTransferRootId === item.transferRootId
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
        item.bondTransferRootId &&
        item.transferRootHash &&
        item.bonded &&
        item.destinationChainId &&
        !isValidItem &&
        !item.challenged &&
        isWithinChallengePeriod
      )
    })
  }

  async getUnsettledTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      if (filter.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
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
        item.transferRootHash &&
        item.transferIds &&
        item.destinationChainId &&
        item.totalAmount &&
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
    if (!item?.transferRootHash) {
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
    const kv = await this.subDbIncompletes.getKeyValues()
    const transferRootHashes = kv.map(this.filterTimestampedKeyValues).filter(this.filterExisty)
    if (!transferRootHashes.length) {
      return []
    }

    const batchedItems = await this.batchGetByIds(transferRootHashes)
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
    const isInvalid = invalidTransferRoots[item.transferRootHash!] // eslint-disable-line @typescript-eslint/no-non-null-assertion
    return isNotFound || isInvalid // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
  }
}

export default TransferRootsDb
