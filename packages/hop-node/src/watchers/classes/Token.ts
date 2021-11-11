import ContractBase from './ContractBase'
import { BigNumber, constants, ethers, providers } from 'ethers'
import { ERC20 } from '@hop-protocol/core/contracts'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

export default class Token extends ContractBase {
  tokenContract: ERC20
  _decimals: number

  constructor (tokenContract: ERC20) {
    super(tokenContract)
    this.tokenContract = tokenContract
  }

  getBalance = async (): Promise<BigNumber> => {
    const address = await this.tokenContract.signer.getAddress()
    if (!address) {
      throw new Error('expected signer address')
    }
    if (this.tokenContract.address === constants.AddressZero) {
      return this.tokenContract.signer.getBalance(address)
    }
    const balance = await this.tokenContract.balanceOf(address)
    return balance
  }

  decimals = async () => {
    if (!this._decimals) {
      const _decimals = await this.tokenContract.decimals()
      this._decimals = Number(_decimals.toString())
    }
    return this._decimals
  }

  getAllowance = async (spender: string): Promise<BigNumber> => {
    const owner = await this.tokenContract.signer.getAddress()
    const allowance = await this.tokenContract.allowance(owner, spender)
    return allowance
  }

  approve = async (
    spender: string,
    amount: BigNumber = ethers.constants.MaxUint256
  ): Promise<providers.TransactionResponse | undefined> => {
    if (this.tokenContract.address === constants.AddressZero) {
      return
    }
    const allowance = await this.getAllowance(spender)
    if (allowance.lt(amount)) {
      return await this.tokenContract.approve(
        spender,
        amount,
        await this.txOverrides()
      )
    }
  }

  transfer = async (
    recipient: string,
    amount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    if (this.tokenContract.address === constants.AddressZero) {
      throw new Error('token is ETH')
    }
    return await this.tokenContract.transfer(
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
