require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Signer, Wallet, Contract } from 'ethers'

async function deployArbitrum () {
  let accounts: Signer[]
  let user: Signer | Wallet

  // Factories
  let L2_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let MockMessenger: ContractFactory
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory

  // L2
  let l2_messenger: Contract
  let l2_bridge: Contract
  let l2_uniswapFactory: Contract
  let l2_uniswapRouter: Contract

  // Instantiate the wallets
  accounts = await ethers.getSigners()
  user = accounts[0]

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L2_Bridge = await ethers.getContractFactory('contracts/L2_Bridge.sol:L2_Bridge')
  MockMessenger = await ethers.getContractFactory('contracts/test/MockMessenger.sol:MockMessenger')
  UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
  UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')

  /**
   * Deployments
   */

  // Deploy contracts
  l2_messenger = await MockMessenger.deploy()
  await l2_messenger.deployed()
  l2_bridge = await L2_Bridge.deploy(l2_messenger.address)
  await l2_bridge.deployed()

  // Uniswap
  l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
  await l2_uniswapFactory.deployed()
  const weth = await MockERC20.deploy('WETH', 'WETH')
  await weth.deployed()
  l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, weth.address)
  await l2_uniswapRouter.deployed()

  console.log('L2 Messenger        :', l2_messenger.address)
  console.log('L2 Bridge           :', l2_bridge.address)
  console.log('L2 Uniswap Factory  :', l2_uniswapFactory.address)
  // console.log('Weth                :', weth.address)
  console.log('L2 Uniswap Router   :', l2_uniswapRouter.address)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()