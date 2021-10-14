import ContractBase from './ContractBase'
import rateLimitRetry from 'src/utils/rateLimitRetry'
import { BigNumber, ethers, providers } from 'ethers'
import { ERC20 } from '@hop-protocol/core/contracts'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

export default class Token extends ContractBase {
  tokenContract: ERC20
  _decimals: number

  constructor (tokenContract: ERC20) {
    super(tokenContract)
    this.tokenContract = tokenContract
  }

  getBalance = rateLimitRetry(async (): Promise<BigNumber> => {
    const address = await this.tokenContract.signer.getAddress()
    const balance = await this.tokenContract.balanceOf(address)
    return balance
  })

  decimals = rateLimitRetry(async () => {
    if (!this._decimals) {
      const _decimals = await this.tokenContract.decimals()
      this._decimals = Number(_decimals.toString())
    }
    return this._decimals
  })

  getAllowance = rateLimitRetry(async (spender: string): Promise<BigNumber> => {
    const owner = await this.tokenContract.signer.getAddress()
    const allowance = await this.tokenContract.allowance(owner, spender)
    return allowance
  })

  approve = rateLimitRetry(async (
    spender: string,
    amount: BigNumber = ethers.constants.MaxUint256
  ): Promise<providers.TransactionResponse | undefined> => {
    const allowance = await this.getAllowance(spender)
    if (allowance.lt(amount)) {
      return await this.tokenContract.approve(
        spender,
        amount,
        await this.txOverrides()
      )
    }
  })

  transfer = rateLimitRetry(async (
    recipient: string,
    amount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    return await this.tokenContract.transfer(
      recipient,
      amount,
      await this.txOverrides()
    )
  })

  async formatUnits (value: BigNumber) {
    return Number(formatUnits(value.toString(), await this.decimals()))
  }

  async parseUnits (value: string | number) {
    return parseUnits(value.toString(), await this.decimals())
  }
}
