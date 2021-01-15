require('dotenv').config()

import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Contract, Signer, Wallet } from 'ethers'

const SWAP_DEADLINE_BUFFER = BigNumber.from('3600')
const USER_INITIAL_BALANCE = BigNumber.from('1000000000000000000')

async function deployArbitrum () {
  let accounts: Signer[]
  let user: Signer | Wallet

  // Factories
  let L1_Bridge: ContractFactory
  let L2_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory

  // L1
  let l1_bridge: Contract

  // L2
  let l2_bridge: Contract
  let l2_uniswapRouter: Contract
  let l2_uniswapFactory: Contract
  let l2_oDai: Contract

  // Instantiate the wallets
  accounts = await ethers.getSigners()
  user = accounts[0]

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
  L2_Bridge = await ethers.getContractFactory('contracts/bridges/L2_ArbitrumBridge.sol:L2_ArbitrumBridge')
  UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
  UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')

  /**
   * Deployments
   */

  // Connect Contracts
  l1_bridge = L1_Bridge.attach('0xe74EFb19BBC46DbE28b7BaB1F14af6eB7158B4BE')

  l2_bridge = L2_Bridge.attach('0xf3af9B1Edc17c1FcA2b85dd64595F914fE2D3Dde')
  l2_oDai = MockERC20.attach('0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9')
  l2_uniswapRouter = UniswapRouter.attach('0xd28B241aB439220b85b8B90B912799DefECA8CCe')
  l2_uniswapFactory = UniswapFactory.attach('0x2B6812d2282CF676044cBdE2D0222c08e6E1bdb2')

  // Set up bridges
  await l2_bridge.setL1BridgeAddress(l1_bridge.address)
  await l2_bridge.setExchangeAddress(l2_uniswapRouter.address)

  // Set up Uniswap
  await l2_oDai.approve(l2_uniswapRouter.address, USER_INITIAL_BALANCE.div(2))
  await l2_bridge.approve(l2_uniswapRouter.address, USER_INITIAL_BALANCE.div(2))
  await l2_uniswapRouter.addLiquidity(
    l2_oDai.address,
    l2_bridge.address,
    USER_INITIAL_BALANCE.div(2),
    USER_INITIAL_BALANCE.div(2),
    '0',
    '0',
    await user.getAddress(),
    '999999999999'
  )
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()