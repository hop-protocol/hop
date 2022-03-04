import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'

export interface VaultInterface {
  getBalance (account?: string): Promise<BigNumber>
  deposit (amount: BigNumber): any
  withdraw (amount: BigNumber): any
  formatUnits (amount: BigNumber): number
  parseUnits (amount: string | number): BigNumber
}

export type VaultConstructor = new (chain: Chain, token: string, signer: any) => VaultInterface

declare var VaultInterface: VaultConstructor // eslint-disable-line
