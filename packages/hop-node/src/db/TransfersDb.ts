import BaseDb, { KeyFilter } from './BaseDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber } from 'ethers'
import { OneWeekMs, TxError, TxRetryDelayMs } from 'src/constants'
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
  withdrawalBonded?: boolean
  withdrawalBondedTxHash?: string
  withdrawalBonder?: string
  withdrawalBondSettled?: boolean
  withdrawalBondTxError?: TxError
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

const invalidTransferIds: Record<string, boolean> = {
}

class TransfersDb extends BaseDb {
  subDbTimestamps: BaseDb
  subDbIncompletes: BaseDb
  subDbRootHashes: BaseDb

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)
    this.subDbTimestamps = new BaseDb(`${prefix}:timestampedKeys`, _namespace)
    this.subDbIncompletes = new BaseDb(`${prefix}:incompleteItems`, _namespace)
    this.subDbRootHashes = new BaseDb(`${prefix}:transferRootHashes`, _namespace)
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

  private getTimestampedKey (transfer: Transfer) {
    if (transfer.transferSentTimestamp && transfer.transferId) {
      return `transfer:${transfer.transferSentTimestamp}:${transfer.transferId}`
    }
  }

  private getTransferRootHashKey (transfer: Transfer) {
    if (transfer.transferRootHash && transfer.transferId) {
      return `${transfer.transferRootHash}:${transfer.transferId}`
    }
  }

  private isInvalidOrNotFound (item: Transfer) {
    const isNotFound = item?.isNotFound
    const isInvalid = invalidTransferIds[item.transferId]
    return isNotFound || isInvalid // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
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

  private async insertTimestampedKeyItem (transfer: Transfer) {
    const { transferId } = transfer
    const logger = this.logger.create({ id: transferId })
    const key = this.getTimestampedKey(transfer)
    if (key) {
      const exists = await this.subDbTimestamps.getById(key)
      if (!exists) {
        logger.debug(`storing db transfer timestamped key item. key: ${key}`)
        await this.subDbTimestamps._update(key, { transferId })
        logger.debug(`updated db transfer timestamped key item. key: ${key}`)
      }
    }
  }

  private async insertRootHashKeyItem (transfer: Transfer) {
    const { transferId } = transfer
    const logger = this.logger.create({ id: transferId })
    const key = this.getTransferRootHashKey(transfer)
    if (key) {
      const exists = await this.subDbRootHashes.getById(key)
      if (!exists) {
        logger.debug(`storing db transfer rootHash key item. key: ${key}`)
        await this.subDbRootHashes._update(key, { transferId })
        logger.debug(`updated db transfer rootHash key item. key: ${key}`)
      }
    }
  }

  private async upsertTransferItem (transfer: Transfer) {
    const { transferId } = transfer
    const logger = this.logger.create({ id: transferId })
    await this._update(transferId, transfer)
    const entry = await this.getById(transferId)
    logger.debug(`updated db transfer item. ${JSON.stringify(entry)}`)
    await this.upsertIncompleteItem(entry)
  }

  private async upsertIncompleteItem (transfer: Transfer) {
    const { transferId } = transfer
    const logger = this.logger.create({ id: transferId })
    const isIncomplete = this.isItemIncomplete(transfer)
    const exists = await this.subDbIncompletes.getById(transferId)
    const shouldUpsert = isIncomplete && !exists
    const shouldDelete = !isIncomplete && exists
    if (shouldUpsert) {
      logger.debug('updating db transfer incomplete key item')
      await this.subDbIncompletes._update(transferId, { transferId })
      logger.debug('updated db transfer incomplete key item')
    } else if (shouldDelete) {
      logger.debug('deleting db transfer incomplete key item')
      await this.subDbIncompletes.deleteById(transferId)
      logger.debug('deleted db transfer incomplete key item')
    }
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
      this.insertTimestampedKeyItem(transfer as Transfer),
      this.insertRootHashKeyItem(transfer as Transfer),
      this.upsertTransferItem(transfer as Transfer)
    ])
  }

  async getByTransferId (transferId: string): Promise<Transfer> {
    const item: Transfer = await this.getById(transferId)
    return this.normalizeItem(item)
  }

  async getTransferIds (dateFilter?: TransfersDateFilter): Promise<string[]> {
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

    const kv = await this.subDbTimestamps.getKeyValues(filter)
    return kv.map(this.filterValueTransferId).filter(this.filterExisty)
  }

  async getItems (dateFilter?: TransfersDateFilter): Promise<Transfer[]> {
    const transferIds = await this.getTransferIds(dateFilter)
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
    if (!transferRootHash) {
      throw new Error('expected transfer root hash')
    }

    const filter: KeyFilter = {
      gte: `${transferRootHash}`,
      lte: `${transferRootHash}~` // tilde is intentional
    }

    const kv = await this.subDbRootHashes.getKeyValues(filter)
    const unsortedTransferIds = kv.map(this.filterValueTransferId).filter(this.filterExisty)
    const items = await this.batchGetByIds(unsortedTransferIds)
    const sortedTransfers = items.sort(this.sortItems).filter(this.filterExisty)
    return sortedTransfers
  }

  async getUncommittedTransfers (
    filter: GetItemsFilter = {}
  ): Promise<Transfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromWeek()
    return transfers.filter(item => {
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
  }

  async getUnbondedSentTransfers (
    filter: GetItemsFilter = {}
  ): Promise<Transfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromWeek()
    return transfers.filter(item => {
      if (!item?.transferId) {
        return false
      }
      if (invalidTransferIds[item.transferId]) {
        return false
      }

      if (!this.isRouteOk(filter, item)) {
        return false
      }

      const shouldIgnoreItem = this.isInvalidOrNotFound(item)
      if (shouldIgnoreItem) {
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
  }

  isItemIncomplete (item: Transfer) {
    if (!item?.transferId) {
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
      !item.transferSentBlockNumber ||
      (item.transferSentBlockNumber && !item.transferSentTimestamp) ||
      (item.withdrawalBondedTxHash && !item.withdrawalBonder)
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    )
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

      const shouldIgnoreItem = this.isInvalidOrNotFound(item)
      if (shouldIgnoreItem) {
        return false
      }

      return this.isItemIncomplete(item)
    })
  }
}

export default TransfersDb
