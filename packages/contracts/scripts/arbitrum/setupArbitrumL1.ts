require('dotenv').config()

import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Wallet, Contract } from 'ethers'
import { getL2MessengerId, setMessengerWrapperDefaults } from '../../test/utils'
import { L2_NAMES } from '../../test/constants'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')

async function deployArbitrum () {
  let accounts: Signer[]
  let user: Signer | Wallet
  let liquidityProvider: Signer | Wallet
  let messengerId: string

  // Factories
  let L1_Bridge: ContractFactory
  let L1_MessengerWrapper: ContractFactory
  let MockMessenger: ContractFactory
  let GlobalInbox: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_messenger: Contract
  let l1_messengerWrapper: Contract
  let l1_bridge: Contract
  let l1_arbitrumBridge: Contract
  
  // L2
  let l2_messenger: Contract

  // Instantiate the wallets
  accounts = await ethers.getSigners()
  user = accounts[0]
  liquidityProvider = accounts[1]

  // Get the contract Factories
  L1_Bridge = await ethers.getContractFactory('contracts/L1_Bridge.sol:L1_Bridge')
  L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
  MockMessenger = await ethers.getContractFactory('contracts/test/MockMessenger.sol:MockMessenger')
  GlobalInbox = await ethers.getContractFactory('contracts/test/arbitrum/inbox/GlobalInbox.sol:GlobalInbox')

  /**
   * Deployments
   */

  // Connect Contracts
  l1_messenger = MockMessenger.attach('0x')
  l1_messengerWrapper = L1_MessengerWrapper.attach('0x')
  l1_arbitrumBridge = GlobalInbox.attach('0x')
  l1_bridge = L1_Bridge.attach('0x')

  l2_messenger = MockMessenger.attach('0x')

  // Initialize messenger wrapper
  const l2Name = L2_NAMES.ARBITRUM
  await setMessengerWrapperDefaults(l2Name, l1_messengerWrapper, l1_arbitrumBridge.address, l2_messenger.address)

  // Set up bridges
  messengerId = getL2MessengerId('arbitrum')
  await l1_bridge.setL1Messenger(messengerId, l1_messengerWrapper.address)

  // Set up messenger
  await l1_messenger.setTargetMessengerAddress(l2_messenger.address)
  await l1_messenger.setTargetBridgeAddress(l1_bridge.address)

  // Distribute poolToken
  await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
  await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()