import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import { VaultInterface } from './VaultInterface'

export class DefaultVault implements VaultInterface {
  chain: Chain
  token: string
  signer: any

  constructor (chain: Chain, token: string, signer: any) {
    this.chain = chain
    this.token = token
    this.signer = signer
  }

  async getBalance (account?: string): Promise<BigNumber> {
    return BigNumber.from(0)
  }

  async deposit (amount: BigNumber): Promise<any> {
    throw new Error('not implemented')
  }

  async withdraw (amount: BigNumber): Promise<any> {
    throw new Error('not implemented')
  }

  formatUnits (amount: BigNumber): number {
    return 0
  }

  parseUnits (amount: string | number): BigNumber {
    return BigNumber.from(0)
  }
}
