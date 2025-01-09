export interface TokenAddresses {
  MOCK: string
  USDC: string
}

export interface ChainConfig {
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
