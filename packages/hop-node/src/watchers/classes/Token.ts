import ContractBase from './ContractBase'
import delay from 'src/decorators/delay'
import queue from 'src/decorators/queue'
import rateLimitRetry from 'src/decorators/rateLimitRetry'
import { BigNumber, Contract, ethers, providers } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

export default class Token extends ContractBase {
  tokenContract: Contract
  _decimals: number

  constructor (tokenContract: Contract) {
    super(tokenContract)
    this.tokenContract = tokenContract
  }

  @rateLimitRetry
  async getBalance (): Promise<BigNumber> {
    const address = await this.tokenContract.signer.getAddress()
    const balance = await this.tokenContract.balanceOf(address)
    return balance
  }

  @rateLimitRetry
  async decimals () {
    if (!this._decimals) {
      const _decimals = await this.tokenContract.decimals()
      this._decimals = Number(_decimals.toString())
    }
    return this._decimals
  }

  @rateLimitRetry
  async getAllowance (spender: string): Promise<BigNumber> {
    const owner = await this.tokenContract.signer.getAddress()
    const allowance = await this.tokenContract.allowance(owner, spender)
    return allowance
  }

  @queue
  @delay
  @rateLimitRetry
  async approve (
    spender: string,
    amount: BigNumber = ethers.constants.MaxUint256
  ): Promise<providers.TransactionResponse> {
    const allowance = await this.getAllowance(spender)
    if (allowance.lt(amount)) {
      return this.tokenContract.approve(
        spender,
        amount,
        await this.txOverrides()
      )
    }
  }

  @queue
  @delay
  @rateLimitRetry
  async transfer (
    recipient: string,
    amount: BigNumber
  ): Promise<providers.TransactionResponse> {
    return this.tokenContract.transfer(
      recipient,
      amount,
      await this.txOverrides()
    )
  }

  async formatUnits (value: BigNumber) {
    return Number(formatUnits(value.toString(), await this.decimals()))
  }

  async parseUnits (value: string | number) {
    return parseUnits(value.toString(), await this.decimals())
  }
}
