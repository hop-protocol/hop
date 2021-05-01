import { Contract } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { UINT256 } from 'src/constants'
import ContractBase from './ContractBase'
import queue from './queue'

export default class Token extends ContractBase {
  tokenContract: Contract
  _decimals: number

  constructor (tokenContract: Contract) {
    super(tokenContract)
    this.tokenContract = tokenContract
  }

  async getBalance () {
    const address = await this.tokenContract.signer.getAddress()
    const balance = await this.tokenContract.balanceOf(address)
    return Number(formatUnits(balance, await this.decimals()))
  }

  async decimals () {
    if (!this._decimals) {
      const _decimals = await this.tokenContract.decimals()
      this._decimals = Number(_decimals.toString())
    }
    return this._decimals
  }

  // RPC error if too many requests so need to queue
  @queue
  async getAllowance (spender: string) {
    const owner = await this.tokenContract.signer.getAddress()
    const allowance = await this.tokenContract.allowance(owner, spender)
    return Number(formatUnits(allowance, await this.decimals()))
  }

  @queue
  async approve (spender: string) {
    return this.tokenContract.approve(
      spender,
      UINT256,
      await this.txOverrides()
    )
  }
}
