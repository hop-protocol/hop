import BaseDb from './BaseDb'
import { BigNumber } from 'ethers'
import { normalizeDbItem } from './utils'

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
  commitTxBlockNumber?: number
  confirmed?: boolean
  confirmedAt?: number
  confirmTxHash?: string
  rootSetTxHash?: string
  rootSetTimestamp?: number
  sentConfirmTx?: boolean
  sentConfirmTxAt?: number
  bonded?: boolean
  sentBondTx?: boolean
  sentBondTxAt?: number
  bondTxHash?: string
  bondedAt?: number
  transferIds?: string[]
  bonder?: string
  checkpointAttemptedAt?: number
  withdrawalBondSettleTxSentAt?: number
  bondTotalAmount?: BigNumber
  bondTransferRootId?: string
  challenged?: boolean
  challengeExpired?: boolean
}

class TransferRootsDb extends BaseDb {
  async update (transferRootHash: string, data: Partial<TransferRoot>) {
    return super.update(transferRootHash, data)
  }

  async getByTransferRootHash (
    transferRootHash: string
  ): Promise<TransferRoot> {
    const item = (await this.getById(transferRootHash)) as TransferRoot
    if (!item) {
      return item
    }
    if (!item?.transferRootHash) {
      item.transferRootHash = transferRootHash
    }
    return normalizeDbItem(item)
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
    const transferRoots: TransferRoot[] = await this.getTransferRoots()
    return transferRoots.filter(item => {
      return !item.committed && item?.transferIds?.length
    })
  }

  async getUnbondedTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRoots()
    return transferRoots.filter(item => {
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
        item.commitTxBlockNumber &&
        item.sourceChainId
      )
    })
  }

  async getUnconfirmedTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRoots()
    return transferRoots.filter(item => {
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

  async getChallengeableTransferRoots (
    filter: Partial<TransferRoot> = {}
  ): Promise<TransferRoot[]> {
    const transferRoots: TransferRoot[] = await this.getTransferRoots()
    return transferRoots.filter(item => {
      // Do not check if a rootHash has been committed. A rootHash can be committed and bonded,
      // but if the bond uses a different totalAmount then it is fraudulent. Instead, use the
      // transferRootId. If transferRootIds do not match then we know the bond is fraudulent.
      const isTransferRootIdValid = item.bondTransferRootId === item.transferRootId
      return (
        item.transferRootHash &&
        item.bonded &&
        !isTransferRootIdValid &&
        !item.challenged &&
        !item.challengeExpired
      )
    })
  }
}

export default TransferRootsDb
