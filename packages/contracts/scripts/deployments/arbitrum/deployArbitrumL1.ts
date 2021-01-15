require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Contract } from 'ethers'

async function deployArbitrum () {
  // Factories
  let L1_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let MessengerWrapper: ContractFactory

  // L1
  let l1_poolToken: Contract
  let messengerWrapper: Contract
  let l1_bridge: Contract

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
  MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/ArbitrumMessengerWrapper.sol:ArbitrumMessengerWrapper')

  const DAI_ADDRESS = '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9'
  l1_poolToken = MockERC20.attach(DAI_ADDRESS)

  const COMMITTEE_ADDRESS = '0x02b260F6f47FF328496Be632678d06a564B8c4AB'

  /**
   * Deployments
   */

  l1_bridge = await L1_Bridge.deploy(l1_poolToken.address, COMMITTEE_ADDRESS)
  await l1_bridge.deployed()
  messengerWrapper = await MessengerWrapper.deploy()
  await messengerWrapper.deployed()

  console.log('L1 Bridge            :', l1_bridge.address)
  console.log('L1 Messenger Wrapper :', messengerWrapper.address)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()