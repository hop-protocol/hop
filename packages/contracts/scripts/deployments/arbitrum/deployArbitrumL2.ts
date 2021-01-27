require('dotenv').config()

import { ethers, l2ethers } from 'hardhat'
import { ContractFactory, Signer, Wallet, Contract } from 'ethers'

import { ZERO_ADDRESS, CHAIN_IDS } from '../../../test/shared/constants'

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
  let l2_dai: Contract
  let l1_bridge: Contract
  // let l2_bridge: Contract
  let l2_uniswapFactory: Contract
  let l2_uniswapRouter: Contract

  let Pair: ContractFactory
  let pair: Contract

  // Instantiate the wallets
  accounts = await ethers.getSigners()
  user = accounts[0]

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
  L2_Bridge = await l2ethers.getContractFactory('contracts/bridges/L2_OptimismBridge.sol:L2_OptimismBridge', {
    signer: (await ethers.getSigners())[0]
  })
  // UniswapRouter = await l2ethers.getContractFactory('contracts/test/UniswapRouterFlat.sol:UniswapV2Router02', {
  //   signer: (await ethers.getSigners())[0]
  // })
  // UniswapFactory = await l2ethers.getContractFactory('contracts/test/UniswapFactoryFlat.sol:UniswapV2Factory', {
  //   signer: (await ethers.getSigners())[0]
  // })
  UniswapRouter = await l2ethers.getContractFactory('contracts/test/UniswapRouterFlat.sol:UniswapV2Router02', {
    signer: (await ethers.getSigners())[0]
  })
  UniswapFactory = await l2ethers.getContractFactory('contracts/test/UniswapFactoryFlat.sol:UniswapV2Factory', {
  // UniswapFactory = await l2ethers.getContractFactory('contracts/test/UniswapFactoryFlat.sol:UniswapV2Factory', {
    signer: (await ethers.getSigners())[0]
  })
  Pair = await l2ethers.getContractFactory('contracts/uniswap/core/UniswapV2Pair.sol:UniswapV2Pair', {
    signer: (await ethers.getSigners())[0]
  })

  l1_bridge = L1_Bridge.attach('0xe74EFb19BBC46DbE28b7BaB1F14af6eB7158B4BE')
  l2_dai = MockERC20.attach('0x57eaeE3D9C99b93D8FD1b50EF274579bFEC8e14B')

  const l2_messengerAddress = '0x61cBe9766fe7392A4DE03A54b2069c103AE674eb'
  const COMMITTEE_ADDRESS = '0x023ffdc1530468eb8c8eebc3e38380b5bc19cc5d'


  /**
   * Deployments
   */

  // Uniswap
  l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
  await l2_uniswapFactory.deployed()
  await verifyDeployment('L2 Uniswap Factory', l2_uniswapFactory, ethers)

  l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, ZERO_ADDRESS)
  await l2_uniswapRouter.deployed()
  await verifyDeployment('L2 Uniswap Router', l2_uniswapRouter, ethers)

  pair = await Pair.deploy(l2_uniswapFactory.address)
  pair.deployed()
  verifyDeployment('Pair', pair, ethers)

  await l2_uniswapFactory.setPair(pair.address)
  const realPair = await l2_uniswapFactory.realPair()
  if (pair.address !== realPair) {
    throw new Error('Pair did not get set on the factory.')
  }
  
    // Deploy contracts
  const l2_bridge = await L2_Bridge.deploy(
    l2_messengerAddress,
    await user.getAddress(),
    l2_dai.address,
    l1_bridge.address,
    [
      CHAIN_IDS.MAINNET,
      CHAIN_IDS.KOVAN
    ],
    COMMITTEE_ADDRESS
  )
  await l2_bridge.deployed()
  await verifyDeployment('L2 Bridge', l2_bridge, ethers)

  console.log('L2 Bridge           :', l2_bridge.address)
  console.log('L2 Uniswap Factory  :', l2_uniswapFactory.address)
  console.log('L2 Uniswap Router   :', l2_uniswapRouter.address)
}

async function verifyDeployment (name: string, contract: Contract, ethers) {
  const isCodeAtAddress = (await ethers.provider.getCode(contract.address)).length > 100
  console.log(name, '::', isCodeAtAddress, '::', contract.address)
  if (!isCodeAtAddress) {
    throw new Error('Did not deploy correctly')
  }
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()