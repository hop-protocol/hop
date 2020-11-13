require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Contract } from 'ethers'

// const SWAP_DEADLINE_BUFFER = BigNumber.from('3600')

async function deployArbitrum () {
  // Factories
  let L2_Bridge: ContractFactory
  let L1_MessengerWrapper: ContractFactory
  let MockMessenger: ContractFactory
  // let UniswapRouter: ContractFactory

  // L1
  let l1_messenger: Contract
  let l1_messengerWrapper: Contract
  
  // L2
  let l2_messenger: Contract
  let l2_bridge: Contract
  // let l2_uniswapRouter: Contract
  // let l2_oDai: Contract

  // Get the contract Factories
  L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
  MockMessenger = await ethers.getContractFactory('contracts/test/MockMessenger.sol:MockMessenger')
  L2_Bridge = await ethers.getContractFactory('contracts/L2_Bridge.sol:L2_Bridge')
  // UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')

  /**
   * Deployments
   */

  // Connect Contracts
  l1_messenger = MockMessenger.attach('0x7b542e47Bf4aeC075cC2a3bB1871890AAfB0D5d9')
  l1_messengerWrapper = L1_MessengerWrapper.attach('0xaE254AC0EA0aA32bBdEb207C1F58e1bA98F0cF26')

  l2_bridge = L2_Bridge.attach('0xFbf9AB2A295a7c6f01f667C4fd326Df20bEa30e3')
  l2_messenger = MockMessenger.attach('0xDc08a1D8b62f02F55149D51F68504412fdF2Ce3c')
  // l2_uniswapRouter = UniswapRouter.attach('0x958F7a85E32e948Db30F7332ee809ED26B43298a')
  // l2_oDai = MockMessenger.attach('0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9')

  // Set up bridges
  await l2_bridge.setL1Messenger(l1_messengerWrapper.address)

  // Set up messenger
  await l2_messenger.setTargetMessengerAddress(l1_messenger.address)
  await l2_messenger.setTargetBridgeAddress(l2_bridge.address)

  // Set up Uniswap
  // add liquidity
  // get exchange address


  // Finalize messenger
  // await l2_bridge.setExchangeValues(SWAP_DEADLINE_BUFFER, exchange_address, l2_oDai.address)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()