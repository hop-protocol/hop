import { Contract } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import Bridge from './Bridge'
import queue from './queue'

export default class L1Bridge extends Bridge {
  l1BridgeContract: Contract
  TransferRootBonded: string = 'TransferRootBonded'
  TransferRootConfirmed: string = 'TransferRootConfirmed'
  TransferBondChallenged: string = 'TransferBondChallenged'
  ChallengeResolved: string = 'ChallengeResolved'

  constructor (l1BridgeContract: Contract) {
    super(l1BridgeContract)
    this.l1BridgeContract = l1BridgeContract
    this.l1StartListeners()
  }

  l1StartListeners () {
    this.l1BridgeContract
      .on(
        this.l1BridgeContract.filters.TransferRootBonded(),
        (...args: any[]) => this.emit(this.TransferRootBonded, ...args)
      )
      .on(
        this.l1BridgeContract.filters.TransferRootConfirmed(),
        (...args: any[]) => this.emit(this.TransferRootConfirmed, ...args)
      )
      .on(
        this.l1BridgeContract.filters.TransferBondChallenged(),
        (...args: any[]) => this.emit(this.TransferBondChallenged, ...args)
      )
      .on(this.l1BridgeContract.filters.ChallengeResolved(), (...args: any[]) =>
        this.emit(this.ChallengeResolved, ...args)
      )
      .on('error', err => {
        this.emit('error', err)
      })
  }

  async decodeBondTransferRootData (data: string) {
    const decoded = await this.l1BridgeContract.interface.decodeFunctionData(
      'bondTransferRoot',
      data
    )
    const transferRootHash = decoded.rootHash.toString()
    const destinationChainId = decoded.destinationChainId.toString()
    const totalAmount = decoded.totalAmount.toString()
    return {
      transferRootHash,
      destinationChainId,
      totalAmount
    }
  }

  async getTransferBond (transferRootId: string) {
    return this.l1BridgeContract.transferBonds(transferRootId)
  }

  async getTransferRootBondedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ) {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootBonded(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getTransferRootConfirmedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ) {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootConfirmed(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getTransferRootCommitedAt (transferRootId: string) {
    const commitedAt = await this.bridgeContract.transferRootCommittedAt(
      transferRootId
    )
    return Number(commitedAt.toString())
  }

  async getMinTransferRootBondDelaySeconds () {
    // MIN_TRANSFER_ROOT_BOND_DELAY
    return 15 * 60
  }

  @queue
  async bondTransferRoot (
    transferRootHash: string,
    chainId: string,
    totalAmount: number
  ) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    const [credit, debit] = await Promise.all([
      this.getCredit(),
      this.getDebit()
    ])
    if (credit - debit - totalAmount < 0) {
      throw new Error(
        `not enough available credit to bond transfer root. Have ${credit -
          debit}, need ${totalAmount}`
      )
    }

    const tx = await this.l1BridgeContract.bondTransferRoot(
      transferRootHash,
      chainId,
      parsedTotalAmount,
      {
        // gasLimit: 1000000
      }
    )

    await tx.wait()
    return tx
  }

  @queue
  async challengeTransferRootBond (
    transferRootHash: string,
    totalAmount: string
  ) {
    const tx = await this.l1BridgeContract.challengeTransferBond(
      transferRootHash,
      totalAmount,
      {
        //gasLimit: 1000000
      }
    )

    await tx.wait()
    return tx
  }

  @queue
  async resolveChallenge (transferRootHash: string, totalAmount: string) {
    const tx = await this.l1BridgeContract.resolveChallenge(
      transferRootHash,
      totalAmount,
      {
        //gasLimit: 1000000
      }
    )

    await tx.wait()
    return tx
  }
}
