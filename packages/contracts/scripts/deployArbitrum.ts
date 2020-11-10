// require('dotenv').config()
// import * as child from 'child_process'
// import path from 'path'

import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
// const AMOUNT = BigNumber.from('123')
// const RELAYER_FEE = BigNumber.from('1000000000000000000')

async function deployArbitrum () {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer

  // Factories
  let L1_Bridge: ContractFactory
  let L2_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let CrossDomainMessenger: ContractFactory
  let L1_OVMTokenBridge: ContractFactory
  let L2_OVMTokenBridge: ContractFactory
  // let UniswapRouter: ContractFactory
  // let UniswapFactory: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_bridge: Contract
  let l1_messenger: Contract
  let l1_ovmBridge: Contract
  
  // L2
  let l2_bridge: Contract
  let l2_ovmBridge: Contract
  let l2_messenger: Contract
  // let l2_uniswapFactory: Contract
  // let l2_uniswapRouter: Contract

  accounts = await ethers.getSigners()
  user = accounts[0]
  liquidityProvider = accounts[1]
  L1_Bridge = await ethers.getContractFactory('contracts/L1_Bridge.sol:L1_Bridge')
  L2_Bridge = await ethers.getContractFactory('contracts/L2_Bridge.sol:L2_Bridge')
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  CrossDomainMessenger = await ethers.getContractFactory('contracts/test/mockOVM_CrossDomainMessenger.sol:mockOVM_CrossDomainMessenger')
  L1_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L1_OVMTokenBridge.sol:L1_OVMTokenBridge')
  L2_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L2_OVMTokenBridge.sol:L2_OVMTokenBridge')
  // UniswapRouter = await ethers.getContractFactory('@uniswap/v2-periphery/contracts/UniswapV2Router02.sol:UniswapV2Router02')
  // UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
  // UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')

  // Deploy  L1 contracts
  l1_poolToken = await MockERC20.deploy('Dai Stable Token', 'DAI')
  l1_messenger = await CrossDomainMessenger.deploy(0)
  l1_bridge = await L1_Bridge.deploy(l1_messenger.address, l1_poolToken.address)
  l1_ovmBridge = await L1_OVMTokenBridge.deploy(l1_messenger.address, l1_poolToken.address)

    // Deploy  L2 contracts
  l2_messenger = await CrossDomainMessenger.deploy(0)
  l2_bridge = await L2_Bridge.deploy(l2_messenger.address)
  l2_ovmBridge = await L2_OVMTokenBridge.deploy(l2_messenger.address)

  // Uniswap
  // l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
  // const weth = await MockERC20.deploy('WETH', 'WETH')
  // l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, weth.address)//'0x0000000000000000000000000000000000000000')

  // Set up Cross Domain Messengers
  await l1_messenger.setTargetMessengerAddress(l2_messenger.address)
  await l2_messenger.setTargetMessengerAddress(l1_messenger.address)

  // Set up OVM bridges
  l1_ovmBridge.setCrossDomainBridgeAddress(l2_ovmBridge.address)
  l2_ovmBridge.setCrossDomainBridgeAddress(l1_ovmBridge.address)

  // Set up liquidity bridge
  await l1_bridge.setL2Bridge(l2_bridge.address)
  await l2_bridge.setL1Bridge(l1_bridge.address)

  // Distribute poolToken
  await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
  await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()
