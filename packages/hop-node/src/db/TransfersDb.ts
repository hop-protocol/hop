import BaseDb, { KeyFilter } from './BaseDb'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import getExponentialBackoffDelayMs from 'src/utils/getExponentialBackoffDelayMs'
import { BigNumber } from 'ethers'
import { Chain, FiveMinutesMs, OneDayMs, OneHourMs, OneWeekMs, RelayableChains, TxError } from 'src/constants'
import { TxRetryDelayMs } from 'src/config'
import { normalizeDbItem } from './utils'
import { transfersMigrations } from './migrations'

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
  isFinalized?: boolean
  isRelayable?: boolean
  isRelayed?: boolean
  isNotFound?: boolean
  isTransferSpent?: boolean
  recipient?: string
  relayAttemptedAt?: number
  relayBackoffIndex?: number
  relayTxError?: TxError
  relayer?: string
  relayerFee?: BigNumber
  sourceChainId?: number
  sourceChainSlug?: string
  transferFromL1Complete?: boolean
  transferFromL1CompleteTxHash?: string
  transferNonce?: string
  transferRelayed?: boolean
  transferSentBlockNumber?: number
  transferSentIndex?: number
  transferSentLogIndex?: number
  transferSentTimestamp?: number
  transferSentTxHash?: string
  transferSpentTxHash?: string
  withdrawalBondBackoffIndex?: number
  withdrawalBondTxError?: TxError
  withdrawalBonded?: boolean
  withdrawalBondedTxHash?: string
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
  transferSentIndex: number
  transferSentBlockNumber: number
  isFinalized: boolean
}

export type UnrelayedSentTransfer = {
  transferId: string
  sourceChainId: number
  destinationChainId: number
  recipient: string
  amount: BigNumber
  relayer: string
  relayerFee: BigNumber
  transferSentTxHash: string
  transferSentTimestamp: number
  transferSentLogIndex: number
}

export type UncommittedTransfer = {
  transferId: string
  transferSentTxHash: string
  committed: boolean
  destinationChainId: number
}

export interface TransfersIdsWithTransferRootHashParams {
  sourceChainId: number
  destinationChainId: number
  commitTxBlockNumber: number
  commitTxLogIndex: number
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
    const now = Math.floor(Date.now() / 1000)
    const maxDateFilterWarning = now - OneWeekMs
    if (dateFilter?.fromUnix && dateFilter.fromUnix < maxDateFilterWarning) {
      this.logger.warn(`TransfersDb.getFilteredKeyValues: Date range is large. Watch out for memory issues. fromUnix: ${dateFilter.fromUnix}`)
    }

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
      (item.transferSentBlockNumber && !item.transferSentTimestamp)
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
    )
  }
}

// structure:
// key: `<transferId>`
// value: `{ ...Transfer }`
class TransfersDb extends BaseDb {
  subDbTimestamps: SubDbTimestamps
  subDbIncompletes: SubDbIncompletes

  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace, transfersMigrations)
    this.subDbTimestamps = new SubDbTimestamps(prefix, _namespace)
    this.subDbIncompletes = new SubDbIncompletes(prefix, _namespace)
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
    try {
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
    } catch (err: any) {
      const logger = this.logger.create({ id: item?.transferId })

      logger.error('normalizeItem error:', err)
      return null
    }
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
    const transfers = batchedItems.map((item: Transfer) => this.normalizeItem(item))
    const items = transfers.filter(Boolean).sort(this.sortItems)
    this.logger.info(`getMultipleTransfersByTransferIds, items length: ${items.length}`)

    return items
  }

  async getTransfers (dateFilter?: TransfersDateFilter): Promise<Transfer[]> {
    await this.tilReady()
    return await this.getItems(dateFilter)
  }

  async getTransfersFromDay () {
    await this.tilReady()
    const fromUnix = Math.floor((Date.now() - OneDayMs) / 1000)
    return await this.getTransfers({
      fromUnix
    })
  }

  /**
   * @returns transferIds sorted in order of their index in the root
   */
  async getTransfersIdsWithTransferRootHash (input: TransfersIdsWithTransferRootHashParams): Promise<string[] | undefined> {
    const { sourceChainId, destinationChainId, commitTxBlockNumber, commitTxLogIndex } = input
    await this.tilReady()

    // Look back this many days/weeks to construct the root. If this is not enough, the consumer should look
    // up the root onchain.
    const maxLookbackIndex = 14
    const transferIds: string[] = []

    const now = Date.now()
    for (let i = 0; i <= maxLookbackIndex; i++) {
      const fromUnix = Math.floor((now - (OneDayMs * (i + 1))) / 1000)
      const toUnix = Math.floor((now - (OneDayMs * i)) / 1000)
      const transfers: Transfer[] = await this.getTransfers({
        fromUnix,
        toUnix
      })

      // Sorted newest to oldest
      const sortedTransfers = transfers.filter(Boolean).sort(this.sortItems).reverse()
      for (const transfer of sortedTransfers) {
        if (
          transfer.sourceChainId === sourceChainId &&
          transfer.destinationChainId === destinationChainId &&
          transfer.transferSentBlockNumber &&
          transfer.transferSentBlockNumber <= commitTxBlockNumber &&
          transfer.transferSentIndex !== undefined
        ) {
          if (transfer.transferSentBlockNumber === commitTxBlockNumber) {
            if (
              transfer.transferSentLogIndex === undefined ||
              transfer.transferSentLogIndex > commitTxLogIndex
            ) {
            continue
            }
          }

          transferIds.unshift(transfer.transferId)
          if (transfer.transferSentIndex === 0) {
            return transferIds
          }
        }
      }
    }
  }

  async getUncommittedTransfers (
    filter: GetItemsFilter = {}
  ): Promise<UncommittedTransfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromDay()
    const filtered = transfers.filter(item => {
      if (!this.isRouteOk(filter, item)) {
        return false
      }

      return (
        item.transferId &&
        item.transferSentTxHash &&
        !item.committed &&
        item.isFinalized
      )
    })

    return filtered as UncommittedTransfer[]
  }

  async getUnbondedSentTransfers (
    filter: GetItemsFilter = {}
  ): Promise<UnbondedSentTransfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromDay()
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
        if (
          item.withdrawalBondTxError === TxError.BonderFeeTooLow ||
          item.withdrawalBondTxError === TxError.RedundantRpcOutOfSync ||
          item.withdrawalBondTxError === TxError.RpcServerError
        ) {
          const delayMs = getExponentialBackoffDelayMs(item.withdrawalBondBackoffIndex!)
          if (delayMs > OneWeekMs) {
            return false
          }
          timestampOk = item.bondWithdrawalAttemptedAt + delayMs < Date.now()
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
        item.transferSentBlockNumber &&
        !item.isTransferSpent &&
        timestampOk
      )
    })

    return filtered as UnbondedSentTransfer[]
  }

  async getUnrelayedSentTransfers (
    filter: GetItemsFilter = {}
  ): Promise<UnrelayedSentTransfer[]> {
    const transfers: Transfer[] = await this.getTransfersFromDay()
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

      if (!item?.sourceChainId) {
        return false
      }

      const sourceChainSlug = chainIdToSlug(item.sourceChainId)
      if (sourceChainSlug !== Chain.Ethereum) {
        return false
      }

      if (!item?.destinationChainId) {
        return false
      }

      const destinationChainSlug = chainIdToSlug(item.destinationChainId)
      if (!RelayableChains.includes(destinationChainSlug)) {
        return false
      }

      if (!item.transferSentTimestamp) {
        return false
      }

      // TODO: This is temp. Rm.
      const lineaRelayTime = 6 * FiveMinutesMs
      if (destinationChainSlug === Chain.Linea) {
        if ((item.transferSentTimestamp * 1000) + lineaRelayTime > Date.now()) {
          return false
        }
      }

      let timestampOk = true
      if (item.relayAttemptedAt) {
        if (
          item.relayTxError === TxError.RelayerFeeTooLow ||
          item.withdrawalBondTxError === TxError.RpcServerError ||
          item.withdrawalBondTxError === TxError.UnfinalizedTransferBondError
        ) {
          const delayMs = getExponentialBackoffDelayMs(item.relayBackoffIndex!)
          if (delayMs > OneWeekMs) {
            return false
          }
          timestampOk = item.relayAttemptedAt + delayMs < Date.now()
        } else {
          timestampOk = item.relayAttemptedAt + TxRetryDelayMs < Date.now()
        }
      }

      return (
        item.transferId &&
        item.transferSentTimestamp &&
        !item.transferRelayed &&
        item.transferSentTxHash &&
        item.isRelayable &&
        !item.isRelayed &&
        !item.transferFromL1Complete &&
        item.transferSentLogIndex &&
        timestampOk
      )
    })

    return filtered as UnrelayedSentTransfer[]
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
    const transfers = batchedItems.map((item: Transfer) => this.normalizeItem(item))

    return transfers.filter((item: any) => {
      if (!item) {
        return false
      }

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

  async getWithdrawalBondBackoffIndexForTransferId (transferId: string) {
    let { withdrawalBondBackoffIndex } = await this.getByTransferId(transferId)
    if (!withdrawalBondBackoffIndex) {
      withdrawalBondBackoffIndex = 0
    }

    return withdrawalBondBackoffIndex
  }

  async getRelayBackoffIndexForTransferId (transferId: string) {
    let { relayBackoffIndex } = await this.getByTransferId(transferId)
    if (!relayBackoffIndex) {
      relayBackoffIndex = 0
    }

    return relayBackoffIndex
  }

  async getInFlightTransfers (): Promise<Transfer[]> {
    await this.tilReady()

    // Unbonded should not be in flight for more than 1 hour
    const fromUnix = Math.floor((Date.now() - OneHourMs) / 1000)
    const transfersFromHour: Transfer[] = await this.getTransfers({
      fromUnix
    })

    return transfersFromHour.filter((transfer: Transfer) => {
      if (!transfer?.sourceChainId || !transfer?.transferId || !transfer?.isBondable) {
        return false
      }

      // L1 to L2 transfers are not bonded by the bonder so they are not considered in flight.
      // Checking bonderFeeTooLow could be a false positive since the bonder bonds relative to the current gas price.
      const sourceChainSlug = chainIdToSlug(transfer.sourceChainId)
      return (
        sourceChainSlug !== Chain.Ethereum &&
        transfer.transferId &&
        transfer.isBondable &&
        !transfer?.withdrawalBonded &&
        !transfer?.isTransferSpent
      )
    })
  }
}

export default TransfersDb
