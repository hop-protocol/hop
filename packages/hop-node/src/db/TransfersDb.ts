import TimestampedKeysDb from './TimestampedKeysDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import { BigNumber } from 'ethers'
import { KeyFilter } from './BaseDb'
import { OneWeekMs, TxError, TxRetryDelayMs } from 'src/constants'
import { normalizeDbItem } from './utils'

export type TransfersDateFilter = {
  fromUnix?: number
  toUnix?: number
}

export type Transfer = {
  transferRootId?: string
  transferRootHash?: string
  transferId?: string
  destinationChainId?: number
  destinationChainSlug?: string
  sourceChainId?: number
  sourceChainSlug?: string
  withdrawalBondSettled?: boolean
  withdrawalBonded?: boolean
  withdrawalBonder?: string
  withdrawalBondedTxHash?: string
  withdrawalBondTxError?: TxError
  withdrawalBondBackoffIndex?: number
  bondWithdrawalAttemptedAt?: number
  isTransferSpent?: boolean
  transferSpentTxHash?: string

  recipient?: string
  amount?: BigNumber
  amountOutMin?: BigNumber
  bonderFee?: BigNumber
  transferNonce?: string
  deadline?: BigNumber
  transferSentTimestamp?: number
  transferSentTxHash?: string
  transferSentBlockNumber?: number
  transferSentIndex?: number

  isBondable?: boolean
  committed: boolean
}

class TransfersDb extends TimestampedKeysDb<Transfer> {
  async trackTimestampedKey (transfer: Partial<Transfer>) {
    const data = await this.getTimestampedKeyValueForUpdate(transfer)
    if (data != null) {
      const key = data.key
      const transferId = data.value.transferId
      this.logger.debug(`storing timestamped key. key: ${key} transferId: ${transferId}`)
      const value = { transferId }
      await this.subDb._update(key, value)
    }
  }

  async trackTimestampedKeyByTransferId (transferId: string) {
    const transfer = await this.getByTransferId(transferId)
    return await this.trackTimestampedKey(transfer)
  }

  getTimestampedKey (transfer: Partial<Transfer>) {
    if (transfer.transferSentTimestamp && transfer.transferId) {
      const key = `transfer:${transfer.transferSentTimestamp}:${transfer.transferId}`
      return key
    }
  }

  async getTimestampedKeyValueForUpdate (transfer: Partial<Transfer>) {
    if (!transfer) {
      this.logger.warn('expected transfer object for timestamped key')
      return
    }
    const transferId = transfer.transferId
    const key = this.getTimestampedKey(transfer)
    if (!key) {
      this.logger.warn('expected timestamped key. incomplete transfer:', JSON.stringify(transfer))
      return
    }
    if (!transferId) {
      this.logger.warn(`expected transfer id for timestamped key. key: ${key} incomplete transfer: `, JSON.stringify(transfer))
      return
    }
    const item = await this.subDb.getById(key)
    const exists = !!item
    if (!exists) {
      const value = { transferId }
      return { key, value }
    }
  }

  async update (transferId: string, transfer: Partial<Transfer>) {
    const logger = this.logger.create({ id: transferId })
    logger.debug('update called')
    const timestampedKv = await this.getTimestampedKeyValueForUpdate(transfer)
    const promises: Array<Promise<any>> = []
    if (timestampedKv) {
      logger.debug(`storing timestamped key. key: ${timestampedKv.key} transferId: ${transferId}`)
      promises.push(this.subDb._update(timestampedKv.key, timestampedKv.value).then(() => {
        logger.debug(`updated db item. key: ${timestampedKv.key}`)
      }))
    }
    promises.push(this._update(transferId, transfer).then(async () => {
      const entry = await this.getById(transferId)
      logger.debug(`updated db transfer item. ${JSON.stringify(entry)}`)
    }))
    await Promise.all(promises)
  }

  normalizeItem (item: Partial<Transfer>) {
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
        item.deadline = BigNumber.from(item.deadline)
      }
    }
    return normalizeDbItem(item)
  }

  async getByTransferId (transferId: string): Promise<Transfer> {
    const item: Transfer = await this.getById(transferId)
    return this.normalizeItem(item)
  }

  private readonly filterTimestampedKeyValues = (x: any) => {
    return x?.value?.transferId
  }

  private readonly filterOutTimestampedKeys = (key: string) => {
    return !key.startsWith('transfer:')
  }

  async getTransferIds (dateFilter?: TransfersDateFilter): Promise<string[]> {
    // return only transfer-id keys that are within specified range (filter by timestamped keys)
    if (dateFilter?.fromUnix || dateFilter?.toUnix) { // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
      const filter: KeyFilter = {}
      if (dateFilter.fromUnix) {
        filter.gte = `transfer:${dateFilter.fromUnix}`
      }
      if (dateFilter.toUnix) {
        filter.lte = `transfer:${dateFilter.toUnix}~` // tilde is intentional
      }
      const kv = await this.subDb.getKeyValues(filter)
      return kv.map(this.filterTimestampedKeyValues).filter(this.filterExisty)
    }

    // return all transfer-id keys if no filter is used (filter out timestamped keys)
    const keys = (await this.getKeys()).filter(this.filterOutTimestampedKeys)
    return keys
  }

  sortItems = (a: any, b: any) => {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    if (a.transferSentBlockNumber! > b.transferSentBlockNumber!) return 1
    if (a.transferSentBlockNumber! < b.transferSentBlockNumber!) return -1
    if (a.transferSentIndex! > b.transferSentIndex!) return 1
    if (a.transferSentIndex! < b.transferSentIndex!) return -1
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    /* eslint-enable @typescript-eslint/no-unnecessary-type-assertion */
    return 0
  }

  async getItems (dateFilter?: TransfersDateFilter): Promise<Transfer[]> {
    const transferIds = await this.getTransferIds(dateFilter)
    this.logger.debug(`transferIds length: ${transferIds.length}`)
    const batchedItems = await this.batchGetByIds(transferIds)
    const transfers = batchedItems.map(this.normalizeItem)

    // sort explainer: https://stackoverflow.com/a/9175783/1439168
    const items = transfers
      .sort(this.sortItems)

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

  async getUncommittedTransfers (
    filter: Partial<Transfer> = {}
  ): Promise<Transfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromWeek()
    return transfers.filter(item => {
      if (filter.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
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
    filter: Partial<Transfer> = {}
  ): Promise<Transfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromWeek()
    return transfers.filter(item => {
      if (filter.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
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

  async getBondedTransfersWithoutRoots (
    filter: Partial<Transfer> = {}
  ): Promise<Transfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromWeek()
    return transfers.filter(item => {
      if (filter.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      return item.withdrawalBonded && !item.transferRootHash
    })
  }

  async getIncompleteItems (
    filter: Partial<Transfer> = {}
  ) {
    const transfers: Transfer[] = await this.getTransfersFromWeek()
    return transfers.filter(item => {
      if (filter.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      return (
        (item.transferSentBlockNumber && !item.transferSentTimestamp) ||
        (item.withdrawalBondedTxHash && !item.withdrawalBonder)
      )
    })
  }
}

export default TransfersDb
