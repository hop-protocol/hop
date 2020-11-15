require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Signer, Wallet, Contract } from 'ethers'

import { ZERO_ADDRESS } from '../../../test/constants'

async function deployArbitrum () {
  let accounts: Signer[]
  let user: Signer | Wallet

  // Factories
  let L2_Bridge: ContractFactory
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory

  // L2
  let l2_bridge: Contract
  let l2_uniswapFactory: Contract
  let l2_uniswapRouter: Contract

  // Instantiate the wallets
  accounts = await ethers.getSigners()
  user = accounts[0]

  // Get the contract Factories
  L2_Bridge = await ethers.getContractFactory('contracts/L2_Bridge.sol:L2_Bridge')
  UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
  UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')

  /**
   * Deployments
   */

  // Uniswap
  l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
  await l2_uniswapFactory.deployed()
  l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, ZERO_ADDRESS)
  await l2_uniswapRouter.deployed()

  // Deploy contracts
  const l2_canonicalBridgeAddress = '0x0000000000000000000000000000000000000064'
  l2_bridge = await L2_Bridge.deploy(l2_canonicalBridgeAddress)
  await l2_bridge.deployed()

  console.log('L2 Bridge           :', l2_bridge.address)
  console.log('L2 Uniswap Factory  :', l2_uniswapFactory.address)
  console.log('L2 Uniswap Router   :', l2_uniswapRouter.address)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()