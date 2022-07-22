import { AaveVault } from './AaveVault'
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

    // TODO: determine what tokens and chain to use aave vault for
    const aaveVaultTokens = new Set(['USDC'])
    const useAaveVault = chain === Chain.Arbitrum && aaveVaultTokens.has(token)
    if (useAaveVault) {
      return new AaveVault(chain, token, chain)
    }
  }

  abstract getBalance (account?: string): Promise<BigNumber>
  abstract deposit (amount: BigNumber): Promise<any>
  abstract withdraw (amount: BigNumber): Promise<any>
  abstract formatUnits (amount: BigNumber): number
  abstract parseUnits (amount: string | number): BigNumber
}
