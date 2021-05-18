import { BigNumber } from 'ethers'
import BaseDb from './BaseDb'

export type TransferRoot = {
  destinationBridgeAddress?: string
  transferRootId?: string
  transferRootHash?: string
  totalAmount?: BigNumber
  chainId?: number
  sourceChainId?: number
  sentCommitTx?: boolean
  committed?: boolean
  committedAt?: number
  bonded?: boolean
  sentBondTx?: boolean
  transferIds?: string[]
  bonder?: string
}

class TransferRootsDb extends BaseDb {
  constructor (prefix: string = 'transferRoots') {
    super(prefix)
  }

  async update (transferRootHash: string, data: Partial<TransferRoot>) {
    return super.update(transferRootHash, data)
  }

  async getByTransferRootHash (
    transferRootHash: string
  ): Promise<TransferRoot> {
    const item = await this.getById(transferRootHash)
    if (item?.totalAmount && item?.totalAmount?.type === 'BigNumber') {
      item.totalAmount = BigNumber.from(item.totalAmount?.hex)
    }
    return item
  }

  async getByTransferRootId (transferRootId: string): Promise<TransferRoot> {
    const transferRootHashes = await this.getTransferRootHashes()
    const filtered = (
      await Promise.all(
        transferRootHashes.map(async (transferRootHash: string) => {
          const item = await this.getByTransferRootHash(transferRootHash)
          if (item.transferRootId === transferRootId) {
            return item
          }
        })
      )
    ).filter(x => x)
    return filtered?.[0]
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

  async getUncommittedBondedTransferRoots (): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      return !item.committed && item?.transferIds?.length
    })
  }

  async getUnbondedTransferRoots (): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      return (
        !item.bonded &&
        item.transferRootHash &&
        item.chainId &&
        item.committedAt
      )
    })
  }
}

export default TransferRootsDb
