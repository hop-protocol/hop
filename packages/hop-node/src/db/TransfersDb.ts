import BaseDb from './BaseDb'

export type Transfer = {
  transferHash?: string
  chainId?: string
  sourceChainId?: string
  withdrawalBondSettled?: boolean
  withdrawalBonded?: boolean
  sentBondWithdrawalTx?: boolean
}

class TransfersDb extends BaseDb {
  constructor (prefix: string = 'transfers') {
    super(prefix)
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
      return item.withdrawalBonded && !item.withdrawalBondSettled
    })
  }
}

export default TransfersDb
