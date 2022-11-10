import { Network } from '@ethersproject/networks'
import { providers } from 'ethers'

export interface IProvider extends providers.Provider {
  getAvatar?: (nameOrAddress: string) => Promise<string>
  getResolver?: (nameOrAddress: string) => Promise<string>
  detectNetwork?: () => Promise<Network>
  connection?: any
}
