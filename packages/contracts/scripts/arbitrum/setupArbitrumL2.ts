require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Contract } from 'ethers'


async function deployArbitrum () {
  // Factories
  let L2_Bridge: ContractFactory
  let L1_MessengerWrapper: ContractFactory
  let MockMessenger: ContractFactory

  // L1
  let l1_messenger: Contract
  let l1_messengerWrapper: Contract
  
  // L2
  let l2_messenger: Contract
  let l2_bridge: Contract

  // Get the contract Factories
  L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
  MockMessenger = await ethers.getContractFactory('contracts/test/MockMessenger.sol:MockMessenger')

  /**
   * Deployments
   */

  // Connect Contracts
  l1_messenger = MockMessenger.attach('0x')
  l1_messengerWrapper = L1_MessengerWrapper.attach('0x')

  l2_bridge = L2_Bridge.attach('0x')
  l2_messenger = MockMessenger.attach('0x')

  // Set up bridges
  await l2_bridge.setL1Messenger(l1_messengerWrapper.address)

  // Set up messenger
  await l2_messenger.setTargetMessengerAddress(l1_messenger.address)
  await l2_messenger.setTargetBridgeAddress(l2_bridge.address)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()