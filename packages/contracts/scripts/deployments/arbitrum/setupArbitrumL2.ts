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
  L2_Bridge = await ethers.getContractFactory('contracts/L2_Bridge.sol:L2_Bridge')

  /**
   * Deployments
   */

  // Connect Contracts
  l1_messenger = MockMessenger.attach('0x8aca015FAA06F22bE661D04Aa3606DAbDB0Aaf64')
  l1_messengerWrapper = L1_MessengerWrapper.attach('0xe3F62e3c2f454720423ad4d8E76632358749387D')

  l2_bridge = L2_Bridge.attach('0x1e5FC4836e7d177200C61e757B5aAb0a699fc98e')
  l2_messenger = MockMessenger.attach('0xd888161Cf0651f50d9BbfaA7DE2A8F50609B6437')

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