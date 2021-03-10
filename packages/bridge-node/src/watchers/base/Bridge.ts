import { EventEmitter } from 'events'
import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'

export default class Bridge extends EventEmitter {
  constructor (public bridgeContract: Contract) {
    super()
    this.bridgeContract = bridgeContract
  }

  getTransaction (txHash: string) {
    return this.bridgeContract.provider.getTransaction(txHash)
  }

  getBlockNumber () {
    return this.bridgeContract.provider.getBlockNumber()
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

  async stake (amount: string) {
    const parsedAmount = parseUnits(amount, 18)
    const bonder = await this.getBonderAddress()
    return this.bridgeContract.stake(bonder, parsedAmount)
  }

  getAddress () {
    return this.bridgeContract.address
  }

  async getBondedAmount (transferHash: string) {
    const bonder = await this.getBonderAddress()
    const bondedBn = await this.bridgeContract.getBondedWithdrawalAmount(
      bonder,
      transferHash
    )
    return Number(formatUnits(bondedBn.toString(), 18))
  }
}
