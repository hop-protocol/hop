import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import ContractBase from './ContractBase'
import queue from './queue'

export default class Bridge extends ContractBase {
  WithdrawalBonded: string = 'WithdrawalBonded'

  constructor (public bridgeContract: Contract) {
    super(bridgeContract)
    this.bridgeContract = bridgeContract
    this.bridgeStartListeners()
  }

  bridgeStartListeners () {
    this.bridgeContract
      .on(this.bridgeContract.filters.WithdrawalBonded(), (...args: any[]) =>
        this.emit(this.WithdrawalBonded, ...args)
      )
      .on('error', err => {
        this.emit('error', err)
      })
  }

  async getBonderAddress () {
    return this.bridgeContract.signer.getAddress()
  }

  async isBonder () {
    const bonder = await this.getBonderAddress()
    return this.bridgeContract.getIsBonder(bonder)
  }

  async getCredit () {
    const bonder = await this.getBonderAddress()
    const credit = (await this.bridgeContract.getCredit(bonder)).toString()
    return Number(formatUnits(credit, 18))
  }

  async getDebit () {
    const bonder = await this.getBonderAddress()
    const debit = (
      await this.bridgeContract.getDebitAndAdditionalDebit(bonder)
    ).toString()
    return Number(formatUnits(debit, 18))
  }

  async hasPositiveBalance () {
    const [credit, debit] = await Promise.all([
      this.getCredit(),
      this.getDebit()
    ])
    return credit >= debit && credit > 0
  }

  getAddress () {
    return this.bridgeContract.address
  }

  async getBondedWithdrawalAmount (transferHash: string) {
    const bonder = await this.getBonderAddress()
    const bondedBn = await this.bridgeContract.getBondedWithdrawalAmount(
      bonder,
      transferHash
    )
    return Number(formatUnits(bondedBn.toString(), 18))
  }

  isTransferHashSpent (transferHash: string) {
    return this.bridgeContract.isTransferIdSpent(transferHash)
  }

  async getWithdrawalBondedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ) {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBonded(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getWithdrawalBondeSettledvents (
    startBlockNumber: number,
    endBlockNumber: number
  ) {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBondSettled(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getTransferRootId (transferRootHash: string, totalAmount: number) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    return this.bridgeContract.getTransferRootId(
      transferRootHash,
      parsedTotalAmount
    )
  }

  async getTransferRoot (transferRootHash: string, totalAmount: number) {
    const parsedTotalAmount = parseUnits(totalAmount.toString(), 18)
    return this.bridgeContract.getTransferRoot(
      transferRootHash,
      parsedTotalAmount
    )
  }

  @queue
  async stake (amount: string) {
    const parsedAmount = parseUnits(amount, 18)
    const bonder = await this.getBonderAddress()
    const tx = await this.bridgeContract.stake(bonder, parsedAmount)
    await tx.wait()
    return tx
  }

  @queue
  async bondWithdrawal (
    recipient: string,
    amount: string,
    transferNonce: string,
    bonderFee: string
  ) {
    const tx = await this.bridgeContract.bondWithdrawal(
      recipient,
      amount,
      transferNonce,
      bonderFee,
      {
        //  gasLimit: 1000000
      }
    )

    await tx.wait()
    return tx
  }

  @queue
  async settleBondedWithdrawals (
    bonder: string,
    transferHashes: string[],
    parsedAmount: string
  ) {
    const tx = await this.bridgeContract.settleBondedWithdrawals(
      bonder,
      transferHashes,
      parsedAmount,
      {
        //gasLimit: 1000000
      }
    )

    await tx.wait()
    return tx
  }
}
