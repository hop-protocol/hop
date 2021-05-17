import BaseDb from './BaseDb'

export type Transfer = {
  transferRootHash?: string
  transferHash?: string
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

  async update (transferHash: string, data: Partial<Transfer>) {
    return super.update(transferHash, data)
  }

  async getByTransferHash (transferHash: string): Promise<Transfer> {
    return this.getById(transferHash)
  }

  async getTransferHashes (): Promise<string[]> {
    return this.getKeys()
  }

  async getTransfers (): Promise<Transfer[]> {
    const transferHashes = await this.getTransferHashes()
    return await Promise.all(
      transferHashes.map(transferHash => {
        return this.getByTransferHash(transferHash)
      })
    )
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
