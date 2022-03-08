import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import { YearnVault } from './YearnVault'

export abstract class Vault {
  static from (chain: Chain, token: string, signer: any) {
    const yearnVaultTokens = new Set(['ETH', 'USDC', 'USDT', 'DAI'])
    const useYearnVault = chain === Chain.Ethereum && yearnVaultTokens.has(token)
    if (useYearnVault) {
      return new YearnVault(chain, token, signer)
    }
  }

  async getBalance (account?: string): Promise<BigNumber> {
    throw new Error('not implemented')
  }

  async deposit (amount: BigNumber): Promise<any> {
    throw new Error('not implemented')
  }

  async withdraw (amount: BigNumber): Promise<any> {
    throw new Error('not implemented')
  }

  formatUnits (amount: BigNumber): number {
    throw new Error('not implemented')
  }

  parseUnits (amount: string | number): BigNumber {
    throw new Error('not implemented')
  }
}
