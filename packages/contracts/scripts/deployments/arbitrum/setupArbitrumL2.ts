require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Contract } from 'ethers'

// const SWAP_DEADLINE_BUFFER = BigNumber.from('3600')

async function deployArbitrum () {
  // Factories
  let L2_Bridge: ContractFactory
  let GlobalInbox: ContractFactory
  // let MockERC20: ContractFactory
  // let UniswapRouter: ContractFactory

  // L1
  let l1_canonicalBridge: Contract

  // L2
  let l2_bridge: Contract
  // let l2_uniswapRouter: Contract
  // let l2_oDai: Contract

  // Get the contract Factories
  // MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L2_Bridge = await ethers.getContractFactory('contracts/L2_Bridge.sol:L2_Bridge')
  GlobalInbox = await ethers.getContractFactory('contracts/test/arbitrum/inbox/GlobalInbox.sol:GlobalInbox')
  // UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')

  /**
   * Deployments
   */

  // Connect Contracts
  l1_canonicalBridge = GlobalInbox.attach('0xE681857DEfE8b454244e701BA63EfAa078d7eA85')

  l2_bridge = L2_Bridge.attach('0xFbf9AB2A295a7c6f01f667C4fd326Df20bEa30e3')
  // l2_uniswapRouter = UniswapRouter.attach('0x958F7a85E32e948Db30F7332ee809ED26B43298a')
  // l2_oDai = MockERC20.attach('0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9')

  // Set up bridges
  await l2_bridge.setL1CanonicalBridgeAddress(l1_canonicalBridge.address)

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