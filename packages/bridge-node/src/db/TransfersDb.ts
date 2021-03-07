import BaseDb from './BaseDb'

export type Transfer = {
  transferHash?: string
  chainId?: string
  sourceChainId?: string
  withdrawalBondSettled?: boolean
  withdrawalBonded?: boolean
}

class TransfersDb extends BaseDb {
  constructor (prefix: string = 'transfers') {
    super(prefix)
  }

  handleDataEvent = async (err, data) => {
    if (err) {
      throw err
    }
    if (!data) {
      return
    }
    const { key, value } = data
    if (key === 'ids') {
      return
    }
    const transfers = await this.getTransferHashes()
    const unique = new Set(transfers.concat(key))
    return this.update('ids', Array.from(unique), false)
  }

  async getByTransferHash (transferHash: string): Promise<Transfer> {
    return this.getById(transferHash)
  }

  async getTransferHashes (): Promise<string[]> {
    return Object.values(await this.getById('ids', []))
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
