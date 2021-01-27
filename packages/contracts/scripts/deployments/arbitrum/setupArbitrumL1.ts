require('dotenv').config()

import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Wallet, Contract } from 'ethers'
import { ARB_CHAIN_ADDRESS, CHAIN_IDS } from '../../../test/shared/constants'

const USER_INITIAL_BALANCE = BigNumber.from('500000000000000000000')
const LARGE_APPROVAL = BigNumber.from('999999999999999999999999999999999999')

async function deployArbitrum () {
  let accounts: Signer[]
  let user: Signer | Wallet

  // Factories
  let MockERC20: ContractFactory
  let L1_Bridge: ContractFactory
  let MessengerWrapper: ContractFactory
  let GlobalInbox: ContractFactory
  let L2_Bridge: ContractFactory

  // L1
  let l1_poolToken: Contract
  let messengerWrapper: Contract
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
  MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/OptimismMessengerWrapper.sol:OptimismMessengerWrapper')
  GlobalInbox = await ethers.getContractFactory('contracts/test/Arbitrum/GlobalInbox.sol:GlobalInbox')
  L2_Bridge = await ethers.getContractFactory('contracts/bridges/L2_ArbitrumBridge.sol:L2_ArbitrumBridge')

  /**
   * Deployments
   */

  // Connect Contracts
  l1_arbitrumBridge = GlobalInbox.attach('0xA6e9F1409fe85c84CEACD5936800A12d721009cE')
  l1_poolToken = MockERC20.attach('0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9')

  l1_bridge = L1_Bridge.attach('0xe74EFb19BBC46DbE28b7BaB1F14af6eB7158B4BE')
  messengerWrapper = MessengerWrapper.attach('0x2673a37B287b9896fbc9fB8E29Ed1d899BD4281E')

  l2_bridge = L2_Bridge.attach('0x6d2f304CFF4e0B67dA4ab38C6A5C8184a2424D05')

  // Set up bridges
  const l2ChainId: BigNumber = CHAIN_IDS.OPTIMISM_HOP_TESTNET
  await l1_bridge.setCrossDomainMessengerWrapper(l2ChainId, messengerWrapper.address)

  // Send canonical token to the user on L2
  console.log('000')
  // await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE.mul(2))
  console.log('111')
  // await l1_poolToken.approve(l1_arbitrumBridge.address, LARGE_APPROVAL)
  console.log('222')
  // await l1_arbitrumBridge.deposit(await user.getAddress(), USER_INITIAL_BALANCE, true)
  // await l1_arbitrumBridge.depositERC20Message(ARB_CHAIN_ADDRESS, l1_poolToken.address, await user.getAddress(), USER_INITIAL_BALANCE)

  // Mint our token on L2
  console.log('333')
  await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE.mul(2))
  await l1_poolToken.approve(l1_bridge.address, USER_INITIAL_BALANCE)
  console.log('444')
  await l1_bridge.sendToL2(l2ChainId,  await user.getAddress(), USER_INITIAL_BALANCE)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()