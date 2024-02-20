import BaseDb, { DateFilter, DateFilterWithKeyPrefix } from './BaseDb.js'
import { chainIdToSlug } from '@hop-protocol/hop-node-core/utils'
import { getExponentialBackoffDelayMs } from '@hop-protocol/hop-node-core/utils'
import { BigNumber } from 'ethers'
import {
  BondTransferRootChains,
  ChallengePeriodMs,
  RelayWaitTimeMs,
  RelayableChains,
  RootSetSettleDelayMs,
  TxError
} from 'src/constants/index.js'
import {
  Chain,
  OneWeekMs,
  TenMinutesMs
} from '@hop-protocol/hop-node-core/constants'
import { TxRetryDelayMs } from 'src/config/index.js'
import { transferRootsMigrations } from './migrations.js'

interface BaseTransferRoot {
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
  commitTxLogIndex?: number
  confirmBlockNumber?: number
  confirmed?: boolean
  confirmedAt?: number
  confirmTxHash?: string
  destinationChainId?: number
  isNotFound?: boolean
  isRelayable?: boolean
  relayBackoffIndex?: number
  relayTxError?: TxError
  multipleWithdrawalsSettledTxHash?: string
  rootSetBlockNumber?: number
  rootSetTimestamp?: number
  rootSetTxHash?: string
  sentBondTxAt?: number
  sentCommitTxAt?: number
  sentConfirmTxAt?: number
  sentRelayTxAt?: number
  settled?: boolean
  shouldBondTransferRoot?: boolean
  sourceChainId?: number
  totalAmount?: BigNumber
  transferIds?: string[]
  transferRootHash?: string
  withdrawalBondSettleTxSentAt?: number
  rootBondTxError?: TxError
  rootBondBackoffIndex?: number
}

export interface TransferRoot extends BaseTransferRoot {
  transferRootId: string
}

interface UpdateTransferRoot extends BaseTransferRoot {
  transferRootId?: string
}

type GetItemsFilter = Partial<TransferRoot> & {
  destinationChainIds?: number[]
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

export type TransferRootRelayProps = {
  isRelayable?: boolean
  relayBackoffIndex?: number
  relayTxError?: TxError
}

export type RelayableTransferRoot = {
  transferRootId: string
  transferRootHash: string
  totalAmount: BigNumber
  destinationChainId: number
  confirmTxHash?: string
  bondTxHash?: string
} & TransferRootRelayProps

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
class SubDbTimestamps extends BaseDb<TransferRoot> {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:timestampedKeys`, _namespace)
  }

  async update (transferRootId: string, transferRoot: TransferRoot): Promise<void> {
    const key = this.getTimestampedKey(transferRoot)
    if (!key) {
      this.logger.debug(`key not found for transferRootId: ${transferRootId}. Can occur if an event has been missed or during initial sync.`)
      return
    }
    await this.insertIfNotExists(key, { transferRootId })
  }

  async getTransferRootIds (dateFilter?: DateFilter): Promise<string[]> {
    const keyPrefix = 'transferRoot'
    const dateFilterWithKeyPrefix: DateFilterWithKeyPrefix = {
      keyPrefix,
      ...dateFilter
    }
    const values = await this.getValues({ dateFilterWithKeyPrefix })
    return values.map(this.filterTransferRootId).filter(this.filterExisty)
  }

  protected getTimestampedKey (transferRoot: TransferRoot): string | undefined {
    if (transferRoot.committedAt && transferRoot.transferRootId) {
      return `transferRoot:${transferRoot.committedAt}:${transferRoot.transferRootId}`
    }
  }

  protected readonly filterTransferRootId = (x: TransferRoot): string => {
    return x?.transferRootId
  }
}

// structure:
// key: `<transferRootId>`
// value: `{ transferRootId: <transferRootId> }`
class SubDbIncompletes extends BaseDb<TransferRoot> {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:incompleteItems`, _namespace)
  }

  async update (transferRootId: string, transferRoot: TransferRoot): Promise<void> {
    const isIncomplete = this.isItemIncomplete(transferRoot)
    if (isIncomplete) {
      const value = { transferRootId }
      await this.insertIfNotExists(transferRootId, value)
    } else {
      await this.del(transferRootId)
    }
  }

  async getItems (): Promise<string[]> {
    // No filter needed, as incomplete items are deleted when they are complete. Each get should retrieve all.
    const incompleteItems = await this.getValues()
    return incompleteItems.map(this.filterTransferRootId).filter(this.filterExisty)
  }

  protected isItemIncomplete (item: TransferRoot): boolean {
    if (item.isNotFound) {
      return false
    }

    return (
      /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
      !item.sourceChainId ||
      !item.destinationChainId ||
      !item.commitTxBlockNumber ||
      !!(item.commitTxHash && !item.committedAt) ||
      !!(item.bondTxHash && (!item.bonder || !item.bondedAt)) ||
      !!(item.confirmTxHash && !item.confirmedAt) ||
      !!(item.rootSetBlockNumber && !item.rootSetTimestamp) ||
      !!(item.sourceChainId && !item.transferIds)
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    )
  }

  protected readonly filterTransferRootId = (x: TransferRoot): string => {
    return x?.transferRootId
  }
}

// structure:
// key: `<transferRootHash>`
// value: `{ transferRootId: <transferRootId> }`
class SubDbRootHashes extends BaseDb<TransferRoot> {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:rootHashes`, _namespace)
  }

  async update (transferRootId: string, transferRoot: TransferRoot): Promise<void> {
    const key = transferRoot?.transferRootHash
    if (!key) {
      this.logger.debug(`key (transferRootHash) not found for transferRootId: ${transferRootId}. Can occur with legacy DBs. Will be updated on next event for this transferRootId.`)
      return
    }
    await this.insertIfNotExists(key, { transferRootId: transferRoot.transferRootId })
  }

  async getTransferRootId (transferRootHash: string): Promise<string | null> {
    const item = await this.get(transferRootHash)
    if (!item?.transferRootId) {
      return null
    }
    return item.transferRootId
  }
}

// structure:
// key: `<transferRootId>`
// value: `{ ...TransferRoot }`
class TransferRootsDb extends BaseDb<TransferRoot> {
  subDbTimestamps: SubDbTimestamps
  subDbIncompletes: SubDbIncompletes
  subDbRootHashes: SubDbRootHashes

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace, transferRootsMigrations)

    this.subDbTimestamps = new SubDbTimestamps(prefix, _namespace)
    this.subDbIncompletes = new SubDbIncompletes(prefix, _namespace)
    this.subDbRootHashes = new SubDbRootHashes(prefix, _namespace)
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

  async update (transferRootId: string, transferRoot: UpdateTransferRoot): Promise<void> {
    const item = await this.get(transferRootId) ?? {} as TransferRoot
    const updatedValue: TransferRoot = this.getUpdatedValue(item, transferRoot as TransferRoot)
    updatedValue.transferRootId = transferRootId

    await Promise.all([
      this.subDbRootHashes.update(transferRootId, updatedValue),
      this.subDbTimestamps.update(transferRootId, updatedValue),
      this.subDbIncompletes.update(transferRootId, updatedValue),
      this.put(transferRootId, updatedValue)
    ])
  }

  async getByTransferRootId (transferRootId: string): Promise<TransferRoot | null> {
    return this.get(transferRootId)
  }

  async getByTransferRootHash (transferRootHash: string): Promise<TransferRoot | null> {
    const transferRootId = await this.subDbRootHashes.getTransferRootId(transferRootHash)
    if (!transferRootId) {
      return null
    }
    return this.getByTransferRootId(transferRootId)
  }

  async getTransferRootIdByTransferRootHash (transferRootHash: string): Promise<string | null> {
    const transferRootId = await this.subDbRootHashes.getTransferRootId(transferRootHash)
    if (!transferRootId) {
      return null
    }
    return transferRootId
  }

  async getTransferRoots (dateFilter?: DateFilter): Promise<TransferRoot[]> {
    return this.getItems(dateFilter)
  }

  async getTransferRootsFromWeek (): Promise<TransferRoot[]> {
    const fromUnix = Math.floor((Date.now() - (OneWeekMs)) / 1000)
    return this.getTransferRoots({
      fromUnix
    })
  }

  protected async getItems (dateFilter?: DateFilter): Promise<TransferRoot[]> {
    const transferRootIds = await this.subDbTimestamps.getTransferRootIds(dateFilter)
    if (!transferRootIds.length) {
      return []
    }

    const batchedItems = await this.getMany(transferRootIds)
    if (!batchedItems.length) {
      return []
    }

    const items = batchedItems.sort(this.sortItems)
    if (items == null || !items.length) {
      return []
    }

    return items
  }

  async getUnbondedTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<UnbondedTransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromWeek()
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

      if (!item.sourceChainId) {
        return false
      }

      const sourceChain = chainIdToSlug(item.sourceChainId)
      const doesChainSupportRootBond = BondTransferRootChains.includes(sourceChain)
      if (!doesChainSupportRootBond) {
        return false
      }

      // Since bonding of transferRoots is not time sensitive, wait an arbitrary amount of time for
      // finality before attempting to bond. This prevents repetitive RPC calls, since that is the
      // only true way to know finality for ORUs. The arbitrary time should represent roughly how long
      // the longest chain should wait for finality. Waiting longer also allows extra time to observe
      // reorgs deeper than finality.
      let finalityTimestampOk = false
      if (item?.committedAt) {
        const longestTimeToFinalityMs = 3 * TenMinutesMs
        finalityTimestampOk = item.committedAt + longestTimeToFinalityMs < Date.now()
      }

      let sentBondTxAtTimestampOk = true
      if (item.sentBondTxAt) {
        if (item?.rootBondTxError === TxError.RedundantRpcOutOfSync) {
          const delayMs = getExponentialBackoffDelayMs(item.rootBondBackoffIndex!)
          if (delayMs > OneWeekMs * 2) {
            return false
          }
          sentBondTxAtTimestampOk = item.sentBondTxAt + delayMs < Date.now()
        } else {
          sentBondTxAtTimestampOk = item.sentBondTxAt + TxRetryDelayMs < Date.now()
        }
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
        item.transferIds &&
        finalityTimestampOk &&
        sentBondTxAtTimestampOk
      )
    })

    return filtered as UnbondedTransferRoot[]
  }

  async getL2ToL1RelayableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<ExitableTransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromWeek()
    const filtered = transferRoots.filter(item => {
      if (!item.sourceChainId) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      if (!item.committedAt) {
        return false
      }

      const sourceChain = chainIdToSlug(item.sourceChainId)
      const isRelayable = RelayableChains.L2_TO_L1.includes(sourceChain)
      if (!isRelayable) {
        return false
      }

      let relayTimestampOk = true
      if (isRelayable) {
        const committedAtMs = item.committedAt * 1000
        const relayTimeMs = RelayWaitTimeMs.L2_TO_L1?.[sourceChain]
        if (!relayTimeMs) {
          return false
        }
        relayTimestampOk = committedAtMs + relayTimeMs < Date.now()
      }

      let timestampOk = true
      if (item.sentConfirmTxAt) {
        timestampOk =
          item.sentConfirmTxAt + TxRetryDelayMs < Date.now()
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
        relayTimestampOk &&
        timestampOk
      )
    })

    return filtered as ExitableTransferRoot[]
  }

  async getConfirmableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<ExitableTransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromWeek()
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

      const isChallenged = item?.challenged === true

      let confirmableTimestampOk = false
      if (item?.bondedAt) {
        const bondedAtMs = item.bondedAt * 1000
        confirmableTimestampOk = bondedAtMs + ChallengePeriodMs < Date.now()
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
        item.bonded &&
        item.bondedAt &&
        !isChallenged &&
        timestampOk &&
        confirmableTimestampOk
      )
    })

    return filtered as ExitableTransferRoot[]
  }

  async getL1ToL2UnrelayedTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<RelayableTransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromWeek()
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

      if (item.isNotFound) {
        return false
      }

      // Check DB relayability
      // It is fine if isRelayable is undefined. We just need to ensure it is not false.
      if (item?.isRelayable === false) {
        return false
      }

      const seenOnL1Timestamp = item?.bondedAt ?? item?.confirmedAt
      if (!seenOnL1Timestamp) {
        return false
      }

      const destinationChain = chainIdToSlug(item.destinationChainId)
      const isRelayable = RelayableChains.L1_TO_L2.includes(destinationChain)
      if (!isRelayable) {
        return false
      }

      let relayTimestampOk = true
      if (isRelayable) {
        const l1TxTimestampMs = seenOnL1Timestamp * 1000
        const relayTimeMs = RelayWaitTimeMs.L1_TO_L2?.[destinationChain]
        if (!relayTimeMs) {
          return false
        }
        relayTimestampOk = l1TxTimestampMs + relayTimeMs < Date.now()
      }

      let sentTxTimestampOk = true
      if (item.sentRelayTxAt) {
        if (
          item.relayTxError === TxError.UnfinalizedTransferBondError ||
          item.relayTxError === TxError.MessageUnknownStatus ||
          item.relayTxError === TxError.MessageRelayTooEarly
        ) {
          const delayMs = getExponentialBackoffDelayMs(item.relayBackoffIndex!)
          if (delayMs > OneWeekMs) {
            return false
          }
          sentTxTimestampOk = item.sentRelayTxAt + delayMs < Date.now()
        } else {
          sentTxTimestampOk = item.sentRelayTxAt + TxRetryDelayMs < Date.now()
        }
      }

      return (
        !item.rootSetTxHash &&
        item.commitTxHash &&
        item.transferRootHash &&
        item.transferRootId &&
        item.committed &&
        item.committedAt &&
        relayTimestampOk &&
        sentTxTimestampOk
      )
    })

    return filtered as RelayableTransferRoot[]
  }

  async getChallengeableTransferRoots (
    filter: GetItemsFilter = {}
  ): Promise<ChallengeableTransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromWeek()
    const filtered = transferRoots.filter(item => {
      if (!item.sourceChainId) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      let isWithinChallengePeriod = true
      const sourceChain = chainIdToSlug(item?.sourceChainId)
      const doesChainSupportRootBond = BondTransferRootChains.includes(sourceChain)
      if (doesChainSupportRootBond && item?.bondedAt) {
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
    const transferRoots: TransferRoot[] = await this.getTransferRootsFromWeek()
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
        rootSetTimestampOk = (item.rootSetTimestamp! * 1000) + RootSetSettleDelayMs < Date.now()
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
        !item.settled &&
        rootSetTimestampOk &&
        bondSettleTimestampOk
      )
    })

    return filtered as UnsettledTransferRoot[]
  }

  async getIncompleteItems (filter: GetItemsFilter = {}): Promise<TransferRoot[]> {
    const incompleteTransferRootIds: string[] = await this.subDbIncompletes.getItems()
    if (!incompleteTransferRootIds.length) {
      return []
    }

    const incompleteTransferRootIdItems: TransferRoot[] | null = await this.getMany(incompleteTransferRootIds)
    if (!incompleteTransferRootIdItems.length) {
      return []
    }

    return incompleteTransferRootIdItems.filter((item: TransferRoot) => {
      if (filter.sourceChainId && item.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      if (item.isNotFound) {
        return false
      }

      return true
    })
  }

  /**
   * Utils
   */

  protected readonly sortItems = (a: any, b: any) => {
    return a?.committedAt - b?.committedAt
  }
}

export default TransferRootsDb
