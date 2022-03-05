import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'

export interface VaultInterface {
  chain: Chain
  token: string
  signer: any

  getBalance (account?: string): Promise<BigNumber>
  deposit (amount: BigNumber): Promise<any>
  withdraw (amount: BigNumber): Promise<any>
  formatUnits (amount: BigNumber): number
  parseUnits (amount: string | number): BigNumber
}

export type VaultConstructor = new (chain: Chain, token: string, signer: any) => VaultInterface

declare var VaultInterface: VaultConstructor // eslint-disable-line
