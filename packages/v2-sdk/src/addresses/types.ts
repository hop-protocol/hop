import { BigNumber } from 'ethers'

export interface TokenConfig {
  address: string
  railsPaths: Record<string, { pathId: string }>
}

export type TokenAddresses = {
  [token: string]: TokenConfig
}

export interface ChainConfig {
  initialReserves: Record<string, BigNumber>
  chainId: string
  startBlock?: number
  hubCoreMessenger?: string
  spokeCoreMessenger?: string
  ethFeeDistributor?: string
  railsGateway?: string
  dispatcher?: string
  executor?: string
  transporter?: string
  stakingRegistry?: string
  hopToken?: string
  tokens?: TokenAddresses
}

export interface Addresses {
  [chainId: string]: ChainConfig
}
