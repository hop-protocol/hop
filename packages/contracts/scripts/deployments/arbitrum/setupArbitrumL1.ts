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
  L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
  L1_BridgeWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
  GlobalInbox = await ethers.getContractFactory('contracts/test/arbitrum/inbox/GlobalInbox.sol:GlobalInbox')
  L2_Bridge = await ethers.getContractFactory('contracts/bridges/L2_ArbitrumBridge.sol:L2_ArbitrumBridge')

  /**
   * Deployments
   */

  // Connect Contracts
  l1_arbitrumBridge = GlobalInbox.attach('0xE681857DEfE8b454244e701BA63EfAa078d7eA85')
  l1_poolToken = MockERC20.attach('0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9')

  l1_bridge = L1_Bridge.attach('0xC9898E162b6a43dc665B033F1EF6b2bc7B0157B4')
  l1_bridgeWrapper = L1_BridgeWrapper.attach('0xb5cAC377180fcE007664Cc65ff044d685e0F1A3b')

  l2_bridge = L2_Bridge.attach('0xf8E96392b1Ba3B2FD88041894a93e089E93C0dcd')

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