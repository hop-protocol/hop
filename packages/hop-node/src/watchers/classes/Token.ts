import ContractBase from './ContractBase'
import { BigNumber, constants, ethers, providers } from 'ethers'
import { ERC20 } from '@hop-protocol/core/contracts'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

export default class Token extends ContractBase {
  tokenContract: ERC20
  isEth: boolean
  _decimals: number

  constructor (tokenContract: ERC20) {
    super(tokenContract)
    this.tokenContract = tokenContract
    this.isEth = (this.tokenContract.address === constants.AddressZero)
  }

  override getBalance = async (): Promise<BigNumber> => {
    const address = await this.tokenContract.signer.getAddress()
    if (!address) {
      throw new Error('expected signer address')
    }
    if (this.isEth) {
      return this.tokenContract.signer.getBalance()
    }
    const balance = await this.tokenContract.balanceOf(address)
    return balance
  }

  decimals = async () => {
    if (!this._decimals) {
      if (this.isEth) {
        this._decimals = 18
      } else {
        const _decimals = await this.tokenContract.decimals()
        this._decimals = Number(_decimals.toString())
      }
    }
    return this._decimals
  }

  getAllowance = async (spender: string): Promise<BigNumber> => {
    if (this.isEth) {
      return constants.MaxUint256
    }
    const owner = await this.tokenContract.signer.getAddress()
    const allowance = await this.tokenContract.allowance(owner, spender)
    return allowance
  }

  approve = async (
    spender: string,
    amount: BigNumber = ethers.constants.MaxUint256
  ): Promise<providers.TransactionResponse | undefined> => {
    if (this.isEth) {
      return
    }
    const allowance = await this.getAllowance(spender)
    if (allowance.lt(amount)) {
      return this.tokenContract.approve(
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
    if (this.isEth) {
      const tx = {
        to: recipient,
        value: amount
      }
      return this.tokenContract.signer.sendTransaction(tx)
    }

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
