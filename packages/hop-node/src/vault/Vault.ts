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

  abstract getBalance (account?: string): Promise<BigNumber>
  abstract deposit (amount: BigNumber): Promise<any>
  abstract withdraw (amount: BigNumber): Promise<any>
  abstract formatUnits (amount: BigNumber): number
  abstract parseUnits (amount: string | number): BigNumber
}
