require('dotenv').config()

import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Wallet, Contract } from 'ethers'
import { getL2CanonicalBridgeId, setBridgeWrapperDefaults } from '../../../test/utils'
import { L2_NAMES } from '../../../test/constants'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')

async function deployArbitrum () {
  let accounts: Signer[]
  let user: Signer | Wallet
  let liquidityProvider: Signer | Wallet
  let canonicalBridgeId: string

  // Factories
  let MockERC20: ContractFactory
  let L1_Bridge: ContractFactory
  let L1_BridgeWrapper: ContractFactory
  let GlobalInbox: ContractFactory
  let L2_Bridge: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_bridgeWrapper: Contract
  let l1_bridge: Contract
  let l1_arbitrumBridge: Contract
  
  // L2
  let l2_bridge: Contract

  // Instantiate the wallets
  accounts = await ethers.getSigners()
  user = accounts[0]
  liquidityProvider = accounts[1]

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L1_Bridge = await ethers.getContractFactory('contracts/L1_Bridge.sol:L1_Bridge')
  L1_BridgeWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
  GlobalInbox = await ethers.getContractFactory('contracts/test/arbitrum/inbox/GlobalInbox.sol:GlobalInbox')
  L2_Bridge = await ethers.getContractFactory('contracts/L2_Bridge.sol:L2_Bridge')

  /**
   * Deployments
   */

  // Connect Contracts
  l1_bridgeWrapper = L1_BridgeWrapper.attach('0xaE254AC0EA0aA32bBdEb207C1F58e1bA98F0cF26')
  l1_arbitrumBridge = GlobalInbox.attach('0xE681857DEfE8b454244e701BA63EfAa078d7eA85')
  l1_bridge = L1_Bridge.attach('0x1652a11C406d6Ea407967370B492f85BeCE96c29')
  l1_poolToken = MockERC20.attach('0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9')

  l2_bridge = L2_Bridge.attach('0xFbf9AB2A295a7c6f01f667C4fd326Df20bEa30e3')

  // Initialize bridge wrapper
  const l2Name = L2_NAMES.ARBITRUM
  await setBridgeWrapperDefaults(l2Name, l1_bridgeWrapper, l1_arbitrumBridge.address, l2_bridge.address)

  // Set up bridges
  canonicalBridgeId = getL2CanonicalBridgeId('arbitrum')
  await l1_bridge.setL1BridgeWrapper(canonicalBridgeId, l1_bridgeWrapper.address)

  // Distribute poolToken
  await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
  await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()