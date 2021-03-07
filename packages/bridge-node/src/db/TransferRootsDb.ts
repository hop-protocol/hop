import BaseDb from './BaseDb'

export type TransferRoot = {
  transferRootHash?: string
  totalAmount?: string
  chainId?: string
  sourceChainID?: string
  commited?: boolean
  bonded?: boolean
}

class TransferRootsDb extends BaseDb {
  constructor (prefix: string = 'transferRoots') {
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
    const transfers = await this.getTransferRootHashes()
    const unique = new Set(transfers.concat(key))
    return this.update('ids', Array.from(unique), false)
  }

  async getByTransferRootHash (
    transferRootHash: string
  ): Promise<TransferRoot> {
    return this.getById(transferRootHash)
  }

  async getTransferRootHashes (): Promise<string[]> {
    return Object.values(await this.getById('ids', []))
  }
}

export default TransferRootsDb
