import BaseDb from './BaseDb'

export type TransferRoot = {
  transferRootHash?: string
  totalAmount?: string
  chainId?: string
  sourceChainID?: string
  commited?: boolean
  bonded?: boolean
  settled?: boolean
  sentSettleTx?: boolean
  transferHashes?: string[]
}

class TransferRootsDb extends BaseDb {
  constructor (prefix: string = 'transferRoots') {
    super(prefix)
  }

  async getByTransferRootHash (
    transferRootHash: string
  ): Promise<TransferRoot> {
    return this.getById(transferRootHash)
  }

  async getTransferRootHashes (): Promise<string[]> {
    return this.getKeys()
  }

  async getTransferRoots (): Promise<TransferRoot[]> {
    const transferRootHashes = await this.getTransferRootHashes()
    return await Promise.all(
      transferRootHashes.map(transferRootHash => {
        return this.getByTransferRootHash(transferRootHash)
      })
    )
  }

  async getUnsettledBondedTransferRoots (): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      return item.bonded && !item.settled
    })
  }

  async getUncommittedBondedTransferRoots (): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      return !item.commited
    })
  }
}

export default TransferRootsDb
