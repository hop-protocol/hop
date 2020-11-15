require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Contract } from 'ethers'

// const SWAP_DEADLINE_BUFFER = BigNumber.from('3600')

async function deployArbitrum () {
  // Factories
  let L1_Bridge: ContractFactory
  let L2_Bridge: ContractFactory
  // let MockERC20: ContractFactory
  // let UniswapRouter: ContractFactory

  // L1
  let l1_bridge: Contract

  // L2
  let l2_bridge: Contract
  // let l2_uniswapRouter: Contract
  // let l2_oDai: Contract

  // Get the contract Factories
  // MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L1_Bridge = await ethers.getContractFactory('contracts/L1_Bridge.sol:L1_Bridge')
  L2_Bridge = await ethers.getContractFactory('contracts/L2_Bridge.sol:L2_Bridge')
  // UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')

  /**
   * Deployments
   */

  // Connect Contracts

  l1_bridge = L1_Bridge.attach('0xC9898E162b6a43dc665B033F1EF6b2bc7B0157B4')
  l2_bridge = L2_Bridge.attach('0xf8E96392b1Ba3B2FD88041894a93e089E93C0dcd')
  // l2_uniswapRouter = UniswapRouter.attach('0x958F7a85E32e948Db30F7332ee809ED26B43298a')
  // l2_oDai = MockERC20.attach('0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9')

  // Set up bridges
  await l2_bridge.setL1BridgeAddress(l1_bridge.address)


  // Set up Uniswap
  // add liquidity
  // get exchange address

  // Finalize bridge
  // await l2_bridge.setExchangeValues(SWAP_DEADLINE_BUFFER, exchange_address, l2_oDai.address)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()