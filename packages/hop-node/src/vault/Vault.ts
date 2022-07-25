import { AaveVault } from './AaveVault'
import { BigNumber, Signer } from 'ethers'
import { Chain } from 'src/constants'
import { YearnVault } from './YearnVault'

export enum Strategy {
  Yearn = 'yearn',
  Aaave = 'aave'
}

export abstract class Vault {
  static from (strategy: Strategy, chain: Chain, token: string, signer: Signer) {
    if (!strategy) {
      throw new Error('vault strategy is required')
    }
    if (!chain) {
      throw new Error('vault chain is required')
    }
    if (!token) {
      throw new Error('vault token is required')
    }
    if (!signer) {
      throw new Error('vault signer is required')
    }
    if (strategy === Strategy.Yearn) {
      return new YearnVault(chain, token, signer)
    } else if (strategy === Strategy.Aaave) {
      return new AaveVault(chain, token, signer)
    }
    throw new Error(`strategy ${strategy} is invalid`)
  }

  abstract getBalance (account?: string): Promise<BigNumber>
  abstract deposit (amount: BigNumber): Promise<any>
  abstract withdraw (amount: BigNumber): Promise<any>
  abstract formatUnits (amount: BigNumber): number
  abstract parseUnits (amount: string | number): BigNumber
}
