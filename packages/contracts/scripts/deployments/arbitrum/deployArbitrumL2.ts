require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Signer, Wallet, Contract } from 'ethers'

import { ZERO_ADDRESS, MAINNET_CHAIN_ID } from '../../../test/shared/constants'

async function deployArbitrum () {
  let accounts: Signer[]
  let user: Signer | Wallet

  // Factories
  let MockERC20: ContractFactory
  let L1_Bridge: ContractFactory
  let L2_Bridge: ContractFactory
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory

  // L2
  let l2_oDai: Contract
  let l1_bridge: Contract
  let l2_bridge: Contract
  let l2_uniswapFactory: Contract
  let l2_uniswapRouter: Contract

  // Instantiate the wallets
  accounts = await ethers.getSigners()
  user = accounts[0]

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
  L2_Bridge = await ethers.getContractFactory('contracts/bridges/L2_ArbitrumBridge.sol:L2_ArbitrumBridge')
  UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
  UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')

  l1_bridge = L1_Bridge.attach('0xe74EFb19BBC46DbE28b7BaB1F14af6eB7158B4BE')
  l2_oDai = MockERC20.attach('0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9')

  /**
   * Deployments
   */

  // Uniswap
  l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
  await l2_uniswapFactory.deployed()
  l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, ZERO_ADDRESS)
  await l2_uniswapRouter.deployed()

  // Deploy contracts
  const l2_messengerAddress = '0x0000000000000000000000000000000000000064'
  const COMMITTEE_ADDRESS = '0x02b260F6f47FF328496Be632678d06a564B8c4AB'

  l2_bridge = await L2_Bridge.deploy(
    l2_messengerAddress,
    await user.getAddress(),
    l2_oDai.address,
    l1_bridge.address,
    [MAINNET_CHAIN_ID],
    COMMITTEE_ADDRESS
  )
  await l2_bridge.deployed()

  console.log('L2 Bridge           :', l2_bridge.address)
  console.log('L2 Uniswap Factory  :', l2_uniswapFactory.address)
  console.log('L2 Uniswap Router   :', l2_uniswapRouter.address)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()