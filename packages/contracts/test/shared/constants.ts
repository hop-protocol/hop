import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'

import Transfer from '../../lib/Transfer'

export const CHAIN_IDS = {
  MAINNET: BigNumber.from(1),
  GOERLI: BigNumber.from(5),
  KOVAN: BigNumber.from(42),
  OPTIMISM_SYNTHETIX_DEMO: BigNumber.from(10),
  OPTIMISM_TESTNET_1: BigNumber.from(420),
  ARBITRUM_TESTNET_2: BigNumber.from(152709604825713),
  ARBITRUM_TESTNET_3: BigNumber.from(79377087078960)
}

export const USER_INITIAL_BALANCE = BigNumber.from('100')
export const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
export const LIQUIDITY_PROVIDER_UNISWAP_BALANCE = LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2)
export const COMMITTEE_INITIAL_BALANCE = BigNumber.from('1000000')
export const CHALLENGER_INITIAL_BALANCE = BigNumber.from('10')

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ONE_ADDRESS = '0x0000000000000000000000000000000000000001'
export const ARB_CHAIN_ADDRESS = '0x2e8aF9f74046D3E55202Fcfb893348316B142230'

export const DEFAULT_MESSENGER_WRAPPER_GAS_LIMIT = 8000000
export const DEFAULT_MESSENGER_WRAPPER_GAS_PRICE = 0
export const DEFAULT_MESSENGER_WRAPPER_GAS_CALL_VALUE = 0
export const DEFAULT_MESSENGER_WRAPPER_SUB_MESSAGE_TYPE = '0x01'

export const TRANSFER_AMOUNT = BigNumber.from('10')
export const RELAYER_FEE = BigNumber.from('1')

export const DEFAULT_AMOUNT_OUT_MIN = 0
export const DEFAULT_DEADLINE = 9999999999

export interface IFixture {
  // Users
  accounts: Signer[]
  user: Signer
  liquidityProvider: Signer
  bonder: Signer
  challenger: Signer
  governance: Signer
  relayer: Signer
  otherAccount: Signer

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
  MockBridge: ContractFactory

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
  bridge: Contract

  // Other
  transfers: Transfer[]
}

export type IGetMessengerWrapperDefaults = string | number | undefined