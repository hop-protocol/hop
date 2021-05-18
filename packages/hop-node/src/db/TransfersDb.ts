import BaseDb from './BaseDb'

export type Transfer = {
  transferRootId?: string
  transferId?: string
  chainId?: number
  sourceChainId?: number
  withdrawalBondSettled?: boolean
  withdrawalBondSettleTxSent?: boolean
  withdrawalBonded?: boolean
  withdrawalBonder?: string
  sentBondWithdrawalTx?: boolean
}

class TransfersDb extends BaseDb {
  constructor (prefix: string = 'transfers') {
    super(prefix)
  }

  async update (transferId: string, data: Partial<Transfer>) {
    return super.update(transferId, data)
  }

  async getByTransferId (transferId: string): Promise<Transfer> {
    return this.getById(transferId)
  }

  async getTransferIds (): Promise<string[]> {
    return this.getKeys()
  }

  async getTransfers (): Promise<Transfer[]> {
    const transferIds = await this.getTransferIds()
    return await Promise.all(
      transferIds.map(transferId => {
        return this.getByTransferId(transferId)
      })
    )
  }

  async getUnsettledBondedWithdrawalTransfers (): Promise<Transfer[]> {
    const transfers = await this.getTransfers()
    return transfers.filter(item => {
      return (
        item.withdrawalBonded &&
        !item.withdrawalBondSettled &&
        item.transferRootId
      )
    })
  }
}

export default TransfersDb
