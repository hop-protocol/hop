import { Chain } from 'src/constants'
import { DefaultVault } from './DefaultVault'
import { VaultInterface } from './VaultInterface'
import { YearnVault } from './YearnVault'

export class Vault extends DefaultVault implements VaultInterface {
  static from (chain: Chain, token: string, signer: any): VaultInterface {
    const yearnVaultTokens = new Set(['ETH', 'USDC', 'USDT', 'DAI'])
    const useYearnVault = chain === Chain.Ethereum && yearnVaultTokens.has(token)
    if (useYearnVault) {
      return new YearnVault(chain, token, signer)
    }

    return new DefaultVault(chain, token, signer)
  }
}
