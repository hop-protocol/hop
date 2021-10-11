import TimestampedKeysDb from './TimestampedKeysDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber } from 'ethers'
import { Chain, OneWeekMs, RootSetSettleDelayMs, TxRetryDelayMs } from 'src/constants'
import { KeyFilter } from './BaseDb'
import { normalizeDbItem } from './utils'
import { oruChains } from 'src/config'

export type TransferRootsDateFilter = {
  fromUnix?: number
  toUnix?: number
}

export type TransferRoot = {
  destinationBridgeAddress?: string
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
  rootSetTimestamp?: number
  sentConfirmTxAt?: number
  shouldBondTransferRoot?: boolean
  bonded?: boolean
  sentBondTxAt?: number
  bondTxHash?: string
  bondedAt?: number
  transferIds?: string[]
  bonder?: string
  withdrawalBondSettleTxSentAt?: number
  bondTotalAmount?: BigNumber
  bondTransferRootId?: string
  challenged?: boolean
  challengeExpired?: boolean
  allSettled?: boolean
}

class TransferRootsDb extends TimestampedKeysDb<TransferRoot> {
  async trackTimestampedKey (transferRoot: Partial<TransferRoot>) {
    const data = await this.getTimestampedKeyValueForUpdate(transferRoot)
    if (data) {
      const key = data?.key
      const transferRootHash = data?.value?.transferRootHash
      this.logger.debug(`storing timestamped key. key: ${key} transferRootHash: ${transferRootHash}`)
      const value = { transferRootHash }
      await this.subDb._update(key, value)
    }
  }

  async trackTimestampedKeyByTransferRootHash (transferRootHash: string) {
    const transferRoot = await this.getByTransferRootHash(transferRootHash)
    return this.trackTimestampedKey(transferRoot)
  }

  getTimestampedKey (transferRoot: Partial<TransferRoot>) {
    if (transferRoot?.committedAt && transferRoot?.transferRootHash) {
      const key = `transferRoot:${transferRoot?.committedAt}:${transferRoot?.transferRootHash}`
      return key
    }
  }

  async getTimestampedKeyValueForUpdate (transferRoot: Partial<TransferRoot>) {
    if (!transferRoot) {
      this.logger.warn('expected transfer root object for timestamped key')
      return
    }
    const transferRootHash = transferRoot?.transferRootHash
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
    const timestampedKv = await this.getTimestampedKeyValueForUpdate(transferRoot)
    if (timestampedKv) {
      logger.debug(`storing timestamped key. key: ${timestampedKv.key} transferRootHash: ${transferRootHash}`)
      await this.subDb._update(timestampedKv.key, timestampedKv.value)
      logger.debug(`updated db item. key: ${timestampedKv.key}`)
    }
    await this._update(transferRootHash, transferRoot)
    logger.debug(`updated db item. key: ${transferRootHash}`)
  }

  async getByTransferRootHash (
    transferRootHash: string
  ): Promise<TransferRoot> {
    const item = (await this.getById(transferRootHash)) as TransferRoot
    if (!item) {
      return item
    }
    if (!item?.transferRootHash) {
      item.transferRootHash = transferRootHash
    }
    return normalizeDbItem(item)
  }

  async getByTransferRootId (transferRootId: string): Promise<TransferRoot> {
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
    ).filter(x => x)
    return filtered?.[0]
  }

  async getTransferRootHashes (dateFilter?: TransferRootsDateFilter): Promise<string[]> {
    // return only transfer-root keys that are within specified range (filter by timestamped keys)
    if (dateFilter) {
      const filter : KeyFilter = {}
      if (dateFilter.fromUnix) {
        filter.gte = `transferRoot:${dateFilter.fromUnix}`
      }
      if (dateFilter.toUnix) {
        filter.lte = `transferRoot:${dateFilter.toUnix}~` // tilde is intentional
      }
      const kv = await this.subDb.getKeyValues(filter)
      return kv.map((x: any) => x?.value?.transferRootHash).filter((x: any) => x)
    }

    // return all transfer-root keys if no filter is used (filter out timestamped keys)
    const keys = await this.getKeys()
    return keys.filter(x => x)
  }

  async getItems (dateFilter?: TransferRootsDateFilter): Promise<TransferRoot[]> {
    const transferRootHashes = await this.getTransferRootHashes(dateFilter)
    const transferRoots = await Promise.all(
      transferRootHashes.map(transferRootHash => {
        return this.getByTransferRootHash(transferRootHash)
      })
    )

    return transferRoots
      .sort((a, b) => a?.committedAt - b?.committedAt)
      .filter(x => x)
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

  async getUncommittedBondedTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      return !item.committed && item?.transferIds?.length
    })
  }

  async getUnbondedTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }
      if (filter?.destinationChainId) {
        if (filter.destinationChainId !== item.destinationChainId) {
          return false
        }
      }

      let timestampOk = true
      if (item?.sentBondTxAt) {
        timestampOk =
          item?.sentBondTxAt + TxRetryDelayMs < Date.now()
      }

      return (
        !item.bonded &&
        !item.bondedAt &&
        !item.confirmed &&
        item.transferRootHash &&
        item.committedAt &&
        item.commitTxHash &&
        item.commitTxBlockNumber &&
        item.destinationChainId &&
        item.sourceChainId &&
        item.shouldBondTransferRoot &&
        timestampOk
      )
    })
  }

  async getUnconfirmedTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      if (!item.sourceChainId) {
        return false
      }

      let timestampOk = true
      if (item?.sentConfirmTxAt) {
        timestampOk =
          item?.sentConfirmTxAt + TxRetryDelayMs < Date.now()
      }

      let oruTimestampOk = true
      const sourceChain = chainIdToSlug(item.sourceChainId)
      const isSourceOru = oruChains.includes(sourceChain)
      if (isSourceOru && item?.committedAt) {
        oruTimestampOk =
          item?.committedAt + OneWeekMs < Date.now()
      }

      return (
        item.commitTxHash &&
        !item.confirmed &&
        item.transferRootHash &&
        item.destinationChainId &&
        item.committed &&
        item.committedAt &&
        timestampOk &&
        oruTimestampOk
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
      const isTransferRootIdValid = item.bondTransferRootId === item.transferRootId
      return (
        item.transferRootHash &&
        item.bonded &&
        !isTransferRootIdValid &&
        !item.challenged &&
        !item.challengeExpired
      )
    })
  }

  async getUnsettledTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromTwoWeeks()
    return transferRoots.filter(item => {
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      // https://github.com/hop-protocol/hop/pull/140#discussion_r697919256
      let rootSetTimestampOk = true
      const checkRootSetTimestamp = item?.rootSetTimestamp && filter?.destinationChainId && chainIdToSlug(filter?.destinationChainId) === Chain.xDai
      if (checkRootSetTimestamp) {
        rootSetTimestampOk = (item.rootSetTimestamp * 1000) + RootSetSettleDelayMs < Date.now()
      }

      let bondSettleTimestampOk = true
      if (item?.withdrawalBondSettleTxSentAt) {
        bondSettleTimestampOk =
          (item?.withdrawalBondSettleTxSentAt + TxRetryDelayMs) <
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

  async getIncompleteItems (
    filter: Partial<TransferRoot> = {}
  ) {
    const transferRoots: TransferRoot[] = await this.getTransferRoots()
    return transferRoots.filter(item => {
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      return (
        (item.commitTxHash && !item.committedAt)
      )
    })
  }
}

export default TransferRootsDb
