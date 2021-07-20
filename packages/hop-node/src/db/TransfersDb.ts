import BaseDb from './BaseDb'
import { BigNumber } from 'ethers'
import { TX_RETRY_DELAY_MS } from 'src/constants'
import { chainIdToSlug } from 'src/utils'
import { normalizeBigNumber } from './utils'

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
    let item = (await this.getById(transferId)) as Transfer
    if (!item) {
      return item
    }
    item = normalizeBigNumber(item, 'amount')
    item = normalizeBigNumber(item, 'bonderFee')
    item = normalizeBigNumber(item, 'amountOutMin')
    if (item?.destinationChainId) {
      item.destinationChainSlug = chainIdToSlug(item?.destinationChainId)
    }
    if (item?.sourceChainId) {
      item.sourceChainSlug = chainIdToSlug(item.sourceChainId)
    }
    return item
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
      .sort((a, b) =>
        Number(
          a?.transferSentBlockNumber > b?.transferSentBlockNumber ||
            a?.transferSentIndex > b?.transferSentIndex
        )
      )
      .filter(x => x)
  }

  async getUnsettledBondedWithdrawalTransfers (
    filter: Partial<Transfer> = {}
  ): Promise<Transfer[]> {
    const transfers = await this.getTransfers()
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
    const transfers = await this.getTransfers()
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
    const transfers = await this.getTransfers()
    return transfers.filter(item => {
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      let timestampOk = true
      if (item?.sentBondWithdrawalTxAt) {
        timestampOk =
          item?.sentBondWithdrawalTxAt + TX_RETRY_DELAY_MS < Date.now()
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
    const transfers = await this.getTransfers()
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
