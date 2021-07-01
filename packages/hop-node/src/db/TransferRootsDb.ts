import { BigNumber, Transaction } from 'ethers'
import BaseDb from './BaseDb'
import { normalizeBigNumber } from './utils'

type TxInfo = {
  transactionHash?: string
  timestamp?: number 
}

export type TransferRoot = {
  destinationBridgeAddress?: string
  transferRootId?: string
  transferRootHash?: string
  totalAmount?: BigNumber
  destinationChainId?: number
  sourceChainId?: number
  sentCommitTx?: boolean
  sentCommitTxAt: number
  committed?: boolean
  committedAt?: number
  commitTxHash?: string
  confirmed?: boolean
  confirmedAt?: number
  confirmTxHash?: string
  rootSetTxHashes?: { [key: number]: TxInfo }
  sentConfirmTx?: boolean
  sentConfirmTxAt?: number
  bonded?: boolean
  sentBondTx?: boolean
  sentBondTxAt?: number
  bondTxHash?: string
  transferIds?: string[]
  bonder?: string
  checkpointAttemptedAt?: number
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
    let item = (await this.getById(transferRootHash)) as TransferRoot
    item = normalizeBigNumber(item, 'totalAmount')
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
    const transferRoots = await Promise.all(
      transferRootHashes.map(transferRootHash => {
        return this.getByTransferRootHash(transferRootHash)
      })
    )

    return transferRoots
      .sort((a, b) => a?.committedAt - b?.committedAt)
      .filter(x => x)
  }

  async getUncommittedBondedTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      return !item.committed && item?.transferIds?.length
    })
  }

  async getUnbondedTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      return (
        !item.sentBondTx &&
        !item.bonded &&
        item.transferRootHash &&
        item.destinationChainId &&
        item.committedAt &&
        !item.confirmed &&
        item.commitTxHash &&
        item.sourceChainId
      )
    })
  }

  async getUnconfirmedTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      if (filter?.sourceChainId) {
        if (filter.sourceChainId !== item.sourceChainId) {
          return false
        }
      }

      return (
        !item.confirmed &&
        !item.sentConfirmTx &&
        item.transferRootHash &&
        item.destinationChainId &&
        item.committed &&
        item.committedAt
      )
    })
  }

  // TODO: This should be a new DB for a TransferBond, not a TransferRoot
  // This will add new requirements to this return statement
  async getChallengeableTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      return (
        !item.confirmed &&
        !item.confirmedAt &&
        item.bonded &&
        !item.sentConfirmTx &&
        !item.sentConfirmTxAt
      )
    })
  }

  // TODO: This should be a new DB for a TransferBond, not a TransferRoot
  // This will add new requirements to this return statement
  async getResolvableTransferRoots (): Promise<TransferRoot[]> {
    const transfers = await this.getTransferRoots()
    return transfers.filter(item => {
      return (
        !item.confirmed &&
        !item.confirmedAt &&
        item.bonded &&
        !item.sentConfirmTx &&
        !item.sentConfirmTxAt
      )
    })
  }
}

export default TransferRootsDb
