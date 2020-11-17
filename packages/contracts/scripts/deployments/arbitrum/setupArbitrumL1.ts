require('dotenv').config()

import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Wallet, Contract } from 'ethers'
import { getL2MessengerId, setMessengerWrapperDefaults } from '../../../test/utils'
import { L2_NAMES, ARB_CHAIN_ADDRESS } from '../../../test/constants'

const USER_INITIAL_BALANCE = BigNumber.from('1000000000000000000')
const LARGE_APPROVAL = BigNumber.from('999999999999999999999999999999999999')

async function deployArbitrum () {
  let accounts: Signer[]
  let user: Signer | Wallet
  let messengerId: string

  // Factories
  let MockERC20: ContractFactory
  let L1_Bridge: ContractFactory
  let L1_MessengerWrapper: ContractFactory
  let GlobalInbox: ContractFactory
  let L2_Bridge: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_messengerWrapper: Contract
  let l1_bridge: Contract
  let l1_arbitrumBridge: Contract
  
  // L2
  let l2_bridge: Contract

  // Instantiate the wallets
  accounts = await ethers.getSigners()
  user = accounts[0]

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
  L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
  GlobalInbox = await ethers.getContractFactory('contracts/test/arbitrum/inbox/GlobalInbox.sol:GlobalInbox')
  L2_Bridge = await ethers.getContractFactory('contracts/bridges/L2_ArbitrumBridge.sol:L2_ArbitrumBridge')

  /**
   * Deployments
   */

  // Connect Contracts
  l1_arbitrumBridge = GlobalInbox.attach('0xE681857DEfE8b454244e701BA63EfAa078d7eA85')
  l1_poolToken = MockERC20.attach('0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9')

  l1_bridge = L1_Bridge.attach('0xC9898E162b6a43dc665B033F1EF6b2bc7B0157B4')
  l1_messengerWrapper = L1_MessengerWrapper.attach('0xb5cAC377180fcE007664Cc65ff044d685e0F1A3b')

  l2_bridge = L2_Bridge.attach('0xf8E96392b1Ba3B2FD88041894a93e089E93C0dcd')

  // Initialize bridge wrapper
  const l2Name = L2_NAMES.ARBITRUM
  await setMessengerWrapperDefaults(l2Name, l1_messengerWrapper, l1_arbitrumBridge.address, l2_bridge.address)

  // Set up bridges
  messengerId = getL2MessengerId('arbitrum')
  await l1_bridge.setL1MessengerWrapper(messengerId, l1_messengerWrapper.address)

  // Send canonical token to the user on L2
  await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE.mul(2))
  await l1_poolToken.approve(l1_arbitrumBridge.address, LARGE_APPROVAL)
  await l1_arbitrumBridge.depositERC20Message(ARB_CHAIN_ADDRESS, l1_poolToken.address, await user.getAddress(), USER_INITIAL_BALANCE)

  // Mint our token on L2
  await l1_poolToken.approve(l1_bridge.address, USER_INITIAL_BALANCE)
  await l1_bridge.sendToL2(messengerId, await user.getAddress(), USER_INITIAL_BALANCE)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()