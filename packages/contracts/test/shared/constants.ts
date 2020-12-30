import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'

import Transfer from '../../lib/Transfer'

export const L2_NAMES = {
  ARBITRUM: 'arbitrum',
  OPTIMISM: 'optimism',
  OPTIMISM_1: 'optimism1',
  OPTIMISM_2: 'optimism2',
}

export const USER_INITIAL_BALANCE = BigNumber.from('100')
export const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
export const COMMITTEE_INITIAL_BALANCE = BigNumber.from('1000000')
export const CHALLENGER_INITIAL_BALANCE = BigNumber.from('10')

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const MOCK_ADDRESS = '0x0000000000000000000000000000000000001234'
export const ARB_CHAIN_ADDRESS = '0xC34Fd04E698dB75f8381BFA7298e8Ae379bFDA71'
export const DEFAULT_L2_GAS_LIMIT = 2000000

export const RELAYER_FEE = BigNumber.from('1000000000000000000')

export const MAINNET_CHAIN_ID = BigNumber.from('1')
export const OPTIMISM_CHAIN_ID = BigNumber.from('420')
export const ARBITRUM_CHAIN_ID = BigNumber.from('152709604825713')

export interface IFixture {
  // Users
  accounts: Signer[]
  user: Signer
  liquidityProvider: Signer
  committee: Signer
  challenger: Signer

  // Factories
  L1_Bridge: ContractFactory
  L2_Bridge: ContractFactory
  MockERC20: ContractFactory
  L1_MessengerWrapper: ContractFactory
  MockMessenger: ContractFactory
  CrossDomainMessenger: ContractFactory
  L1_OVMTokenBridge: ContractFactory
  L2_OVMTokenBridge: ContractFactory
  UniswapRouter: ContractFactory
  UniswapFactory: ContractFactory

  // L1
  l1_poolToken: Contract
  l1_messenger: Contract
  l1_messengerWrapper: Contract
  l1_bridge: Contract
  
  // L2
  l2_messenger: Contract
  l2_bridge: Contract
  l2_poolToken: Contract
  l2_uniswapFactory: Contract
  l2_uniswapRouter: Contract

  // Other
  transfers: Transfer[]
}
