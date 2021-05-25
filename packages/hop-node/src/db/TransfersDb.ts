import { BigNumber } from 'ethers'
import BaseDb from './BaseDb'
import { networkIdToSlug } from 'src/utils'

export type Transfer = {
  transferRootId?: string
  transferRootHash?: string
  transferId?: string
  chainId?: number
  destinationChainSlug?: string
  sourceChainId?: number
  sourceChainSlug?: string
  withdrawalBondSettled?: boolean
  withdrawalBondSettleTxSent?: boolean
  withdrawalBonded?: boolean
  withdrawalBonder?: string
  sentBondWithdrawalTx?: boolean

  // TODO
  recipient?: string
  amount?: BigNumber
  amountOutMin?: BigNumber
  bonderFee?: BigNumber
  transferNonce?: string
  deadline?: number
  sentTxHash?: string
  sentBlockNumber?: number
  sentTimestamp?: number
}

class TransfersDb extends BaseDb {
  constructor (prefix: string = 'transfers') {
    super(prefix)
  }

  async update (transferId: string, data: Partial<Transfer>) {
    return super.update(transferId, data)
  }

  async getByTransferId (transferId: string): Promise<Transfer> {
    const item = await this.getById(transferId)
    if (item?.amount && item?.amount?.type === 'BigNumber') {
      item.amount = BigNumber.from(item.amount?.hex)
    }
    if (item?.bonderFee && item?.bonderFee?.type === 'BigNumber') {
      item.bonderFee = BigNumber.from(item.bonderFee?.hex)
    }
    if (item?.amountOutMin && item?.amountOutMin?.type === 'BigNumber') {
      item.amountOutMin = BigNumber.from(item.amountOutMin?.hex)
    }
    if (item?.chainId) {
      item.destinationChainSlug = networkIdToSlug(item?.chainId)
    }
    if (item?.sourceChainId) {
      item.sourceChainSlug = networkIdToSlug(item?.sourceChainId)
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

    return transfers.sort((a, b) => a?.sentTimestamp - b?.sentTimestamp)
  }

  async getUnsettledBondedWithdrawalTransfers (): Promise<Transfer[]> {
    const transfers = await this.getTransfers()
    return transfers.filter(item => {
      return (
        item.withdrawalBonded &&
        !item.withdrawalBondSettled &&
        item.transferRootHash
      )
    })
  }
}

export default TransfersDb
