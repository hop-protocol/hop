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
export const LIQUIDITY_PROVIDER_UNISWAP_BALANCE = LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2)
export const COMMITTEE_INITIAL_BALANCE = BigNumber.from('1000000')
export const CHALLENGER_INITIAL_BALANCE = BigNumber.from('10')

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ARB_CHAIN_ADDRESS = '0x2e8aF9f74046D3E55202Fcfb893348316B142230'
export const DEFAULT_L2_GAS_LIMIT = 8000000

export const RELAYER_FEE = BigNumber.from('1000000000000000000')

export const MAINNET_CHAIN_ID = BigNumber.from('1')
export const OPTIMISM_CHAIN_ID = BigNumber.from('420')
export const ARBITRUM_CHAIN_ID = BigNumber.from('152709604825713')

export const DEFAULT_AMOUNT_OUT_MIN = 0
export const DEFAULT_DEADLINE = 9999999999

export interface IFixture {
  // Users
  accounts: Signer[]
  user: Signer
  liquidityProvider: Signer
  committee: Signer
  challenger: Signer
  governance: Signer

  // Factories
  L1_CanonicalBridge: ContractFactory
  L1_Bridge: ContractFactory
  L2_Bridge: ContractFactory
  L1_Messenger: ContractFactory
  MessengerWrapper: ContractFactory
  L2_Messenger: ContractFactory
  UniswapRouter: ContractFactory
  UniswapFactory: ContractFactory

  // Mock Factories
  MockERC20: ContractFactory
  MockAccounting: ContractFactory

  // L1
  l1_canonicalBridge: Contract
  l1_canonicalToken: Contract
  l1_messenger: Contract
  l1_bridge: Contract
  messengerWrapper: Contract
  
  // L2
  l2_canonicalToken: Contract
  l2_messenger: Contract
  l2_bridge: Contract
  l2_uniswapFactory: Contract
  l2_uniswapRouter: Contract

  // Mocks
  accounting: Contract

  // Other
  transfers: Transfer[]
}
