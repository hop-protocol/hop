import { BigNumber } from 'ethers'
import BaseDb from './BaseDb'

export type TransferRoot = {
  transferRootHash?: string
  totalAmount?: BigNumber
  chainId?: number
  sourceChainId?: number
  sentCommitTx?: boolean
  commited?: boolean
  commitedAt?: number
  bonded?: boolean
  settled?: boolean
  sentSettleTx?: boolean
  sentBondTx?: boolean
  transferHashes?: string[]
  bonder?: string
}

class TransferRootsDb extends BaseDb {
  constructor (prefix: string = 'transferRoots') {
    super(prefix)
  }

  async getByTransferRootHash (
    transferRootHash: string
  ): Promise<TransferRoot> {
    const item = await this.getById(transferRootHash)
    if (item.totalAmount && item.totalAmount?.type === 'BigNumber') {
      item.totalAmount = BigNumber.from(item.totalAmount?.hex)
    }
    return item
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
      return (
        !item.sentSettleTx &&
        item.bonded &&
        !item.settled &&
        item?.transferHashes?.length
      )
    })
  }

  async getUncommittedBondedTransferRoots (): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      return !item.commited && item?.transferHashes?.length
    })
  }

  async getUnbondedTransferRoots (): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      return (
        !item.bonded && item.transferRootHash && item.chainId && item.commitedAt
      )
    })
  }
}

export default TransferRootsDb
