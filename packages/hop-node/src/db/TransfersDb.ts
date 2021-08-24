import BaseDb from './BaseDb'
import { BigNumber } from 'ethers'
import { ONE_MONTH_MS, TX_RETRY_DELAY_MS, TxError } from 'src/constants'
import { chainIdToSlug } from 'src/utils'
import { normalizeDbItem } from './utils'

export type Transfer = {
  transferRootId?: string
  transferRootHash?: string
  transferId?: string
  destinationChainId?: number
  destinationChainSlug?: string
  sourceChainId?: number
  sourceChainSlug?: string
  withdrawalBondSettled?: boolean
  withdrawalBondSettleTxSentAt?: number
  withdrawalBonded?: boolean
  withdrawalBonder?: string
  withdrawalBondedTxHash?: string
  withdrawalBondTxError?: string
  withdrawalBondBackoffIndex?: number
  sentBondWithdrawalTxAt?: number

  recipient?: string
  amount?: BigNumber
  amountOutMin?: BigNumber
  bonderFee?: BigNumber
  transferNonce?: string
  deadline?: number
  transferSentTxHash?: string
  transferSentBlockNumber?: number
  transferSentIndex?: number

  isBondable?: boolean
  committed: boolean
}

class TransfersDb extends BaseDb {
  async update (transferId: string, data: Partial<Transfer>) {
    return super.update(transferId, data)
  }

  async getByTransferId (transferId: string): Promise<Transfer> {
    const item = (await this.getById(transferId)) as Transfer
    if (!item) {
      return item
    }
    if (!item.transferId) {
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

  async getTransferIds (): Promise<string[]> {
    return this.getKeys()
  }

  async getTransfers (): Promise<Transfer[]> {
    const transferIds = await this.getTransferIds()
    const transfers = await Promise.all(
      transferIds.map(transferId => {
        return this.getByTransferId(transferId)
      })
    )

    // https://stackoverflow.com/a/9175783/1439168
    return transfers
      .filter(x => x)
      .sort((a, b) => {
        if (a.transferSentBlockNumber > b.transferSentBlockNumber) return 1
        if (a.transferSentBlockNumber < b.transferSentBlockNumber) return -1
        if (a.transferSentIndex > b.transferSentIndex) return 1
        if (a.transferSentIndex < b.transferSentIndex) return -1
        return 0
      })
  }

  async getUnsettledBondedWithdrawalTransfers (
    filter: Partial<Transfer> = {}
  ): Promise<Transfer[]> {
    const transfers: Transfer[] = await this.getTransfers()
    return transfers.filter(item => {
      if (filter?.destinationChainId) {
        if (filter.destinationChainId !== item.destinationChainId) {
          return false
        }
      }

      return (
        item.transferRootHash &&
        item.withdrawalBonded &&
        !item.withdrawalBondSettled &&
        item.withdrawalBondedTxHash
      )
    })
  }

  async getUncommittedTransfers (
    filter: Partial<Transfer> = {}
  ): Promise<Transfer[]> {
    const transfers: Transfer[] = await this.getTransfers()
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
    const transfers: Transfer[] = await this.getTransfers()
    return transfers.filter(item => {
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      let timestampOk = true
      let expirationTimestampOk = true
      if (item.sentBondWithdrawalTxAt) {
        if (item.withdrawalBondTxError === TxError.BonderFeeTooLow) {
          const maxDelay = 60 * 60
          const delay = Math.min((1 << item.withdrawalBondBackoffIndex), maxDelay) * 1000
          timestampOk = item.sentBondWithdrawalTxAt + delay < Date.now()
        } else {
          timestampOk = item.sentBondWithdrawalTxAt + TX_RETRY_DELAY_MS < Date.now()
          expirationTimestampOk = item.sentBondWithdrawalTxAt + ONE_MONTH_MS < Date.now()
        }
      }

      return (
        item.transferId &&
        !item.withdrawalBonded &&
        item.transferSentTxHash &&
        item.isBondable &&
        timestampOk &&
        expirationTimestampOk
      )
    })
  }

  async getBondedTransfersWithoutRoots (
    filter: Partial<Transfer> = {}
  ): Promise<Transfer[]> {
    const transfers: Transfer[] = await this.getTransfers()
    return transfers.filter(item => {
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      return item.withdrawalBonded && !item.transferRootHash
    })
  }
}

export default TransfersDb
