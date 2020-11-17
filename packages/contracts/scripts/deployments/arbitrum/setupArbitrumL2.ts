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
  l1_bridge = L1_Bridge.attach('0xC9898E162b6a43dc665B033F1EF6b2bc7B0157B4')

  l2_bridge = L2_Bridge.attach('0xf8E96392b1Ba3B2FD88041894a93e089E93C0dcd')
  l2_oDai = MockERC20.attach('0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9')
  l2_uniswapRouter = UniswapRouter.attach('0xBae19197DFa25105E832b8fAfeAB88aCa275385F')
  l2_uniswapFactory = UniswapFactory.attach('0xEaAec7a29B6ccE9e831C8d07e989fa4163026177')

  // Set up bridges
  await l2_bridge.setL1BridgeAddress(l1_bridge.address)

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

  // Finalize bridge
  const uniswapPairAddress: string = await l2_uniswapFactory.getPair(l2_oDai.address, l2_bridge.address)
  await l2_bridge.setExchangeValues(SWAP_DEADLINE_BUFFER, uniswapPairAddress, l2_oDai.address)

}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()