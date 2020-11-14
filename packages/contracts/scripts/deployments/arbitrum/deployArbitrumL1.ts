require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Contract } from 'ethers'

async function deployArbitrum () {
  // Factories
  let L1_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let L1_BridgeWrapper: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_bridgeWrapper: Contract
  let l1_bridge: Contract

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L1_Bridge = await ethers.getContractFactory('contracts/L1_Bridge.sol:L1_Bridge')
  L1_BridgeWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')

  const DAI_ADDRESS = '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9'
  l1_poolToken = MockERC20.attach(DAI_ADDRESS)

  /**
   * Deployments
   */

  l1_bridge = await L1_Bridge.deploy(l1_poolToken.address)
  await l1_bridge.deployed()
  l1_bridgeWrapper = await L1_BridgeWrapper.deploy()
  await l1_bridgeWrapper.deployed()

  console.log('L1 Pool Token       :', l1_poolToken.address)
  console.log('L1 Bridge           :', l1_bridge.address)
  console.log('L1 Bridge Wrapper   :', l1_bridgeWrapper.address)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()