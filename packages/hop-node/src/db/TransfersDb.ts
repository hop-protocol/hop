import BaseDb, { KeyFilter } from './BaseDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber } from 'ethers'
import { OneWeekMs, TxError } from 'src/constants'
import { TxRetryDelayMs } from 'src/config'
import { normalizeDbItem } from './utils'

interface BaseTransfer {
  amount?: BigNumber
  amountOutMin?: BigNumber
  bonderFee?: BigNumber
  bondWithdrawalAttemptedAt?: number
  committed?: boolean
  deadline?: BigNumber
  destinationChainId?: number
  destinationChainSlug?: string
  isBondable?: boolean
  isNotFound?: boolean
  isTransferSpent?: boolean
  recipient?: string
  sourceChainId?: number
  sourceChainSlug?: string
  transferNonce?: string
  transferRootHash?: string
  transferRootId?: string
  transferSentBlockNumber?: number
  transferSentIndex?: number
  transferSentTimestamp?: number
  transferSentTxHash?: string
  transferSpentTxHash?: string
  withdrawalBondBackoffIndex?: number
  withdrawalBondSettled?: boolean
  withdrawalBondSettledTxHash?: string
  withdrawalBondTxError?: TxError
  withdrawalBonded?: boolean
  withdrawalBondedTxHash?: string
  withdrawalBonder?: string
}

export interface Transfer extends BaseTransfer {
  transferId: string
}

interface UpdateTransfer extends BaseTransfer {
  transferId?: string
}

type TransfersDateFilter = {
  fromUnix?: number
  toUnix?: number
}

type GetItemsFilter = Partial<Transfer> & {
  destinationChainIds?: number[]
}

export type UnbondedSentTransfer = {
  transferId: string
  transferSentTimestamp: number
  withdrawalBonded: boolean
  transferSentTxHash: string
  isBondable: boolean
  isTransferSpent: boolean
  destinationChainId: number
  amount: BigNumber
  withdrawalBondTxError: TxError
  sourceChainId: number
  recipient: string
  amountOutMin: BigNumber
  bonderFee: BigNumber
  transferNonce: string
  deadline: BigNumber
}

export type UncommittedTransfer = {
  transferId: string
  transferRootId: string
  transferSentTxHash: string
  committed: boolean
  destinationChainId: number
}

// structure:
// key: `transfer:<transferSentTimestamp>:<transferId>`
// value: `{ transferId: <transferId> }`
// note: the "transfer" prefix is not required but requires a migration to remove
class SubDbTimestamps extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:timestampedKeys`, _namespace)
  }

  getTimestampedKey (transfer: Transfer) {
    if (transfer.transferSentTimestamp && transfer.transferId) {
      return `transfer:${transfer.transferSentTimestamp}:${transfer.transferId}`
    }
  }

  async upsertItem (transfer: Transfer) {
    const { transferId } = transfer
    const logger = this.logger.create({ id: transferId })
    const key = this.getTimestampedKey(transfer)
    if (!key) {
      return
    }
    const exists = await this.getById(key)
    if (!exists) {
      logger.debug(`storing db transfer timestamped key item. key: ${key}`)
      await this._update(key, { transferId })
      logger.debug(`updated db transfer timestamped key item. key: ${key}`)
    }
  }

  async getFilteredKeyValues (dateFilter?: TransfersDateFilter) {
    const filter: KeyFilter = {
      gte: 'transfer:',
      lte: 'transfer:~'
    }

    // return only transfer-id keys that are within specified range (filter by timestamped keys)
    if (dateFilter?.fromUnix || dateFilter?.toUnix) { // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
      if (dateFilter.fromUnix) {
        filter.gte = `transfer:${dateFilter.fromUnix}`
      }
      if (dateFilter.toUnix) {
        filter.lte = `transfer:${dateFilter.toUnix}~` // tilde is intentional
      }
    }

    return this.getKeyValues(filter)
  }
}

// structure:
// key: `<transferId>`
// value: `{ transferId: <transferId> }`
class SubDbIncompletes extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:incompleteItems`, _namespace)
  }

  async upsertItem (transfer: Transfer) {
    const { transferId } = transfer
    const logger = this.logger.create({ id: transferId })
    const isIncomplete = this.isItemIncomplete(transfer)
    const exists = await this.getById(transferId)
    const shouldUpsert = isIncomplete && !exists
    const shouldDelete = !isIncomplete && exists
    if (shouldUpsert) {
      logger.debug('updating db transfer incomplete key item')
      await this._update(transferId, { transferId })
      logger.debug('updated db transfer incomplete key item')
    } else if (shouldDelete) {
      logger.debug('deleting db transfer incomplete key item')
      await this.deleteById(transferId)
      logger.debug('deleted db transfer incomplete key item')
    }
  }

  isItemIncomplete (item: Transfer) {
    if (!item?.transferId) {
      return false
    }

    if (item.isNotFound) {
      return false
    }

    return (
      /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
      !item.sourceChainId ||
      !item.destinationChainId ||
      !item.transferSentBlockNumber ||
      (item.transferSentBlockNumber && !item.transferSentTimestamp) ||
      (item.withdrawalBondedTxHash && !item.withdrawalBonder) ||
      (item.withdrawalBondSettledTxHash && !item.withdrawalBondSettled)
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    )
  }
}

// structure:
// key: `<transferRootHash>:<transferId>`
// value: `{ transferId: <transferId> }`
class SubDbRootHashes extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(`${prefix}:transferRootHashes`, _namespace)
  }

  getTransferRootHashKey (transfer: Transfer) {
    if (transfer.transferRootHash && transfer.transferId) {
      return `${transfer.transferRootHash}:${transfer.transferId}`
    }
  }

  async insertItem (transfer: Transfer) {
    const { transferId } = transfer
    const logger = this.logger.create({ id: transferId })
    const key = this.getTransferRootHashKey(transfer)
    if (key) {
      const exists = await this.getById(key)
      if (!exists) {
        logger.debug(`storing db transfer rootHash key item. key: ${key}`)
        await this._update(key, { transferId })
        logger.debug(`updated db transfer rootHash key item. key: ${key}`)
      }
    }
  }

  async getFilteredKeyValues (transferRootHash: string) {
    if (!transferRootHash) {
      throw new Error('expected transfer root hash')
    }

    const filter: KeyFilter = {
      gte: `${transferRootHash}`,
      lte: `${transferRootHash}~` // tilde is intentional
    }

    return this.getKeyValues(filter)
  }
}

// structure:
// key: `<transferId>`
// value: `{ ...Transfer }`
class TransfersDb extends BaseDb {
  subDbTimestamps: SubDbTimestamps
  subDbIncompletes: SubDbIncompletes
  subDbRootHashes: SubDbRootHashes

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)
    this.subDbTimestamps = new SubDbTimestamps(prefix, _namespace)
    this.subDbIncompletes = new SubDbIncompletes(prefix, _namespace)
    this.subDbRootHashes = new SubDbRootHashes(prefix, _namespace)
  }

  async migration () {
    this.logger.debug('TransfersDb migration started')
    const entries = await this.getKeyValues()
    this.logger.debug(`TransfersDb migration: ${entries.length} entries`)
    const promises: Array<Promise<any>> = []
    for (const { key, value } of entries) {
      let shouldUpdate = false
      if (value?.sourceChainSlug === 'xdai') {
        shouldUpdate = true
        value.sourceChainSlug = 'gnosis'
      }
      if (value?.destinationChainSlug === 'xdai') {
        shouldUpdate = true
        value.destinationChainSlug = 'gnosis'
      }
      if (shouldUpdate) {
        promises.push(this._update(key, value))
      }
    }

    await Promise.all(promises)
    this.logger.debug('TransfersDb migration complete')
  }

  private isRouteOk (filter: GetItemsFilter = {}, item: Transfer) {
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

  private normalizeItem (item: Transfer) {
    if (!item) {
      return null
    }
    if (item.destinationChainId) {
      item.destinationChainSlug = chainIdToSlug(item.destinationChainId)
    }
    if (item.sourceChainId) {
      item.sourceChainSlug = chainIdToSlug(item.sourceChainId)
    }
    if (item.deadline !== undefined) {
      // convert number to BigNumber for backward compatibility reasons
      if (typeof item.deadline === 'number') {
        item.deadline = BigNumber.from((item.deadline as number).toString())
      }
    }
    return normalizeDbItem(item)
  }

  private readonly filterValueTransferId = (x: any) => {
    return x?.value?.transferId
  }

  private async upsertTransferItem (transfer: Transfer) {
    const { transferId } = transfer
    const logger = this.logger.create({ id: transferId })
    await this._update(transferId, transfer)
    const entry = await this.getById(transferId)
    logger.debug(`updated db transfer item. ${JSON.stringify(entry)}`)
    await this.subDbIncompletes.upsertItem(entry)
  }

  // sort explainer: https://stackoverflow.com/a/9175783/1439168
  private readonly sortItems = (a: any, b: any) => {
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    if (a.transferSentBlockNumber! > b.transferSentBlockNumber!) return 1
    if (a.transferSentBlockNumber! < b.transferSentBlockNumber!) return -1
    if (a.transferSentIndex! > b.transferSentIndex!) return 1
    if (a.transferSentIndex! < b.transferSentIndex!) return -1
    /* eslint-enable @typescript-eslint/no-unnecessary-type-assertion */
    return 0
  }

  async update (transferId: string, transfer: UpdateTransfer) {
    const logger = this.logger.create({ id: transferId })
    logger.debug('update called')
    transfer.transferId = transferId
    await Promise.all([
      this.subDbTimestamps.upsertItem(transfer as Transfer),
      this.subDbRootHashes.insertItem(transfer as Transfer),
      this.upsertTransferItem(transfer as Transfer)
    ])
  }

  async getByTransferId (transferId: string): Promise<Transfer> {
    const item: Transfer = await this.getById(transferId)
    return this.normalizeItem(item)
  }

  async getTransferIds (dateFilter?: TransfersDateFilter): Promise<string[]> {
    const kv = await this.subDbTimestamps.getFilteredKeyValues(dateFilter)
    return kv.map(this.filterValueTransferId).filter(this.filterExisty)
  }

  async getItems (dateFilter?: TransfersDateFilter): Promise<Transfer[]> {
    const transferIds = await this.getTransferIds(dateFilter)
    return this.getMultipleTransfersByTransferIds(transferIds)
  }

  async getMultipleTransfersByTransferIds (transferIds: string[]) {
    const batchedItems = await this.batchGetByIds(transferIds)
    const transfers = batchedItems.map(this.normalizeItem)
    const items = transfers.sort(this.sortItems)
    this.logger.info(`items length: ${items.length}`)

    return items
  }

  async getTransfers (dateFilter?: TransfersDateFilter): Promise<Transfer[]> {
    await this.tilReady()
    return await this.getItems(dateFilter)
  }

  // gets only transfers within range: now - 1 week ago
  async getTransfersFromWeek () {
    await this.tilReady()
    const fromUnix = Math.floor((Date.now() - OneWeekMs) / 1000)
    return await this.getTransfers({
      fromUnix
    })
  }

  async getTransfersWithTransferRootHash (transferRootHash: string) {
    await this.tilReady()
    const kv = await this.subDbRootHashes.getFilteredKeyValues(transferRootHash)
    const unsortedTransferIds = kv.map(this.filterValueTransferId).filter(this.filterExisty)
    const items = await this.batchGetByIds(unsortedTransferIds)
    const sortedTransfers = items.sort(this.sortItems).filter(this.filterExisty)
    return sortedTransfers
  }

  async getUncommittedTransfers (
    filter: GetItemsFilter = {}
  ): Promise<UncommittedTransfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromWeek()
    const filtered = transfers.filter(item => {
      if (!this.isRouteOk(filter, item)) {
        return false
      }

      return (
        item.transferId &&
        !item.transferRootId &&
        item.transferSentTxHash &&
        !item.committed
      )
    })

    return filtered as UncommittedTransfer[]
  }

  async getUnbondedSentTransfers (
    filter: GetItemsFilter = {}
  ): Promise<UnbondedSentTransfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromWeek()
    const filtered = transfers.filter(item => {
      if (!item?.transferId) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      if (item.isNotFound) {
        return false
      }

      let timestampOk = true
      if (item.bondWithdrawalAttemptedAt) {
        if (TxError.BonderFeeTooLow === item.withdrawalBondTxError) {
          const delay = TxRetryDelayMs + ((1 << item.withdrawalBondBackoffIndex!) * 60 * 1000) // eslint-disable-line
          // TODO: use `sentTransferTimestamp` once it's added to db

          // don't attempt to bond withdrawals after a week
          if (delay > OneWeekMs) {
            return false
          }
          timestampOk = item.bondWithdrawalAttemptedAt + delay < Date.now()
        } else {
          timestampOk = item.bondWithdrawalAttemptedAt + TxRetryDelayMs < Date.now()
        }
      }

      return (
        item.transferId &&
        item.transferSentTimestamp &&
        !item.withdrawalBonded &&
        item.transferSentTxHash &&
        item.isBondable &&
        !item.isTransferSpent &&
        timestampOk
      )
    })

    return filtered as UnbondedSentTransfer[]
  }

  async getIncompleteItems (
    filter: GetItemsFilter = {}
  ) {
    const kv = await this.subDbIncompletes.getKeyValues()
    const transferIds = kv.map(this.filterValueTransferId).filter(this.filterExisty)
    if (!transferIds.length) {
      return []
    }
    const batchedItems = await this.batchGetByIds(transferIds)
    const transfers = batchedItems.map(this.normalizeItem)

    return transfers.filter((item: any) => {
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
  }
}

export default TransfersDb
