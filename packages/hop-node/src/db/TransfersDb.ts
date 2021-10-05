import BaseDb, { KeyFilter } from './BaseDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import wait from 'src/utils/wait'
import { BigNumber } from 'ethers'
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

  recipient?: string
  amount?: BigNumber
  amountOutMin?: BigNumber
  bonderFee?: BigNumber
  transferNonce?: string
  deadline?: number
  transferSentTimestamp?: number
  transferSentTxHash?: string
  transferSentBlockNumber?: number
  transferSentIndex?: number

  isBondable?: boolean
  committed: boolean
}

class TransfersTimestampedKeysDb extends BaseDb {}

class TransfersDb extends BaseDb {
  ready = false
  subDb : TransfersTimestampedKeysDb

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)

    this.subDb = new TransfersTimestampedKeysDb(`${prefix}TimestampedKeys`, _namespace)

    // this only needs to be ran once on start up to backfill timestamped keys.
    // this function can be removed once all bonders update.
    // timestamped keys (in addition to transferId as keys) are needed to filter
    // leveldb read streams.
    this.trackTimestampedKeys()
      .then(() => {
        this.ready = true
        this.logger.debug('transfersDb ready')
      })
      .catch(this.logger.error)
  }

  private async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return this.tilReady()
  }

  async trackTimestampedKeys () {
    const transfers = await this._getTransfers()
    for (const transfer of transfers) {
      await this.trackTimestampedKey(transfer)
    }
  }

  async trackTimestampedKey (transfer: Partial<Transfer>) {
    const data = await this.getTimestampedKeyValueForUpdate(transfer)
    if (data) {
      const key = data?.key
      const transferId = data?.value?.transferId
      this.logger.debug(`storing timestamped key. key: ${key} transferId: ${transferId}`)
      const value = { transferId }
      await this.subDb._update(key, value)
    }
  }

  getTimestampedKey (transfer: Partial<Transfer>) {
    if (transfer?.transferSentTimestamp && transfer?.transferSentIndex !== undefined) {
      const key = `transfer:${transfer?.transferSentTimestamp}:${transfer?.transferSentIndex}`
      return key
    }
  }

  async getTimestampedKeyValueForUpdate (transfer: Partial<Transfer>) {
    if (!transfer) {
      this.logger.warn('expected transfer object for timestamped key')
      return
    }
    const transferId = transfer?.transferId
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
    if (timestampedKv) {
      logger.debug(`storing timestamped key. key: ${timestampedKv.key} transferId: ${transferId}`)
      await this.subDb._update(timestampedKv.key, timestampedKv.value)
      logger.debug(`updated db item. key: ${timestampedKv.key}`)
    }
    await this._update(transferId, transfer)
    logger.debug(`updated db item. key: ${transferId}`)
  }

  async getByTransferId (transferId: string): Promise<Transfer> {
    const item = (await this.getById(transferId)) as Transfer
    if (!item) {
      return null
    }
    if (!item?.transferId) {
      item.transferId = transferId
    }
    if (item?.destinationChainId) {
      item.destinationChainSlug = chainIdToSlug(item?.destinationChainId)
    }
    if (item?.sourceChainId) {
      item.sourceChainSlug = chainIdToSlug(item.sourceChainId)
    }
    return normalizeDbItem(item)
  }

  async getTransferIds (dateFilter?: TransfersDateFilter): Promise<string[]> {
    // return only transfer-id keys that are within specified range (filter by timestamped keys)
    if (dateFilter) {
      const filter : KeyFilter = {}
      if (dateFilter.fromUnix) {
        filter.gte = `transfer:${dateFilter.fromUnix}`
      }
      if (dateFilter.toUnix) {
        filter.lte = `transfer:${dateFilter.toUnix}~`
      }
      const kv = await this.subDb.getKeyValues(filter)
      return kv.map(x => x?.value?.transferId).filter(x => x)
    }

    // return all transfer-id keys if no filter is used (filter out timestamped keys)
    const keys = await this.getKeys()
    return keys.filter((key: string) => !key?.startsWith('transfer:')).filter(x => x)
  }

  private async _getTransfers (dateFilter?: TransfersDateFilter): Promise<Transfer[]> {
    const transferIds = await this.getTransferIds(dateFilter)
    const transfers = await Promise.all(
      transferIds.map(transferId => {
        return this.getByTransferId(transferId)
      })
    )

    // sort explainer: https://stackoverflow.com/a/9175783/1439168
    const items = transfers
      .filter(x => x)
      .sort((a, b) => {
        if (a.transferSentBlockNumber > b.transferSentBlockNumber) return 1
        if (a.transferSentBlockNumber < b.transferSentBlockNumber) return -1
        if (a.transferSentIndex > b.transferSentIndex) return 1
        if (a.transferSentIndex < b.transferSentIndex) return -1
        return 0
      })

    return items
  }

  async getTransfers (dateFilter?: TransfersDateFilter): Promise<Transfer[]> {
    await this.tilReady()
    return this._getTransfers(dateFilter)
  }

  // gets only transfers within range: now - 1 week ago
  async getTransfersFromWeek () {
    await this.tilReady()
    const fromUnix = Math.floor((Date.now() - OneWeekMs) / 1000)
    return this.getTransfers({
      fromUnix
    })
  }

  async getUncommittedTransfers (
    filter: Partial<Transfer> = {}
  ): Promise<Transfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromWeek()
    return transfers.filter(item => {
      if (filter?.sourceChainId) {
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
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      const customTransferIds: string [] = [
        '0xa66b7633f73c4e056e67c92b5632f6c6fbf3527d55dba5a1ee6613e2fbf4178a'
      ]
      if (customTransferIds.includes(item.transferId)) {
        item.isBondable = true
      }

      const invalidTransferIds: string[] = [
        '0xb9332b783982344a6b082ef76ec88f3c567f843dad9c896e43dc3248ca205915',
        '0x53e43773a6942eb91b3439b9bbfc1cbc6c3f4bcd23db92a85ec190e283c7ac4a'
      ]
      if (invalidTransferIds.includes(item.transferId)) {
        return false
      }

      let timestampOk = true
      if (item.bondWithdrawalAttemptedAt) {
        if (TxError.BonderFeeTooLow === item.withdrawalBondTxError) {
          const delay = TxRetryDelayMs + ((1 << item.withdrawalBondBackoffIndex) * 60 * 1000)
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
        !item.withdrawalBonded &&
        item.transferSentTxHash &&
        item.isBondable &&
        timestampOk
      )
    })
  }

  async getBondedTransfersWithoutRoots (
    filter: Partial<Transfer> = {}
  ): Promise<Transfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromWeek()
    return transfers.filter(item => {
      if (filter?.sourceChainId) {
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
    const transfers: Transfer[] = await this.getTransfers()
    return transfers.filter(item => {
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      return (
        (item.transferSentBlockNumber && !item.transferSentTimestamp)
      )
    })
  }
}

export default TransfersDb
