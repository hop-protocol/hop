import { Contract } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import Bridge from './Bridge'

export default class L1Bridge extends Bridge {
  l1BridgeContract: Contract
  TransferRootBonded: string = 'TransferRootBonded'
  TransferRootConfirmed: string = 'TransferRootConfirmed'
  TransferBondChallenged: string = 'TransferBondChallenged'
  ChallengeResolved: string = 'ChallengeResolved'

  constructor (l1BridgeContract: Contract) {
    super(l1BridgeContract)
    this.l1BridgeContract = l1BridgeContract
    this.startListeners()
  }

  startListeners () {
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

  async bondTransferRoot (
    transferRootHash: string,
    chainId: string,
    totalAmount: number
  ) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    const credit = await this.getCredit()
    const debit = await this.getDebit()
    if (credit < debit) {
      throw new Error('not enough available credit to bond transfer root')
    }

    return this.l1BridgeContract.bondTransferRoot(
      transferRootHash,
      chainId,
      parsedTotalAmount,
      {
        //gasLimit: 1000000
      }
    )
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

  async getTransferBond (transferRootHash: string) {
    return this.l1BridgeContract.transferBonds(transferRootHash)
  }

  async challengeTransferRootBond (
    transferRootHash: string,
    totalAmount: string
  ) {
    return this.l1BridgeContract.challengeTransferBond(
      transferRootHash,
      totalAmount,
      {
        //gasLimit: 1000000
      }
    )
  }

  async resolveChallenge (transferRootHash: string, totalAmount: string) {
    return this.l1BridgeContract.resolveChallenge(
      transferRootHash,
      totalAmount,
      {
        //gasLimit: 1000000
      }
    )
  }
}
