import { Contract } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { UINT256 } from 'src/constants'
import ContractBase from './ContractBase'
import queue from './queue'

export default class Token extends ContractBase {
  tokenContract: Contract

  constructor (tokenContract: Contract) {
    super(tokenContract)
    this.tokenContract = tokenContract
  }

  async getBalance () {
    const address = await this.tokenContract.signer.getAddress()
    const balance = await this.tokenContract.balanceOf(address)
    return Number(formatUnits(balance, 18))
  }

  @queue
  async getAllowance (spender: string) {
    const owner = await this.tokenContract.signer.getAddress()
    const allowance = await this.tokenContract.allowance(owner, spender)
    return Number(formatUnits(allowance, 18))
  }

  async approve (spender: string) {
    return this.tokenContract.approve(spender, UINT256)
  }
}
