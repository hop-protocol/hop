// import { expect } from 'chai'
// import { ethers } from '@nomiclabs/buidler'
// import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'

// describe("Uniswap", () => {
//   let accounts: Signer[]
//   let user: Signer

//   // Factories
//   let UniswapRouter: ContractFactory
//   let UniswapFactory: ContractFactory
//   let UniswapPair: ContractFactory
//   let MockERC20: ContractFactory

//   // L1
//   let router: Contract
//   let factory: Contract
//   let uniswap: Contract
//   let weth: Contract
//   let token: Contract
  

//   before(async () => {
//     accounts = await ethers.getSigners()
//     user = accounts[0]

//     UniswapRouter = await ethers.getContractFactory('UniswapV2Router02')
//     UniswapFactory = await ethers.getContractFactory('UniswapV2Factory')
//     UniswapPair = await ethers.getContractFactory('UniswapV2Pair')
//     MockERC20 = await ethers.getContractFactory('MockERC20')
//   })

//   beforeEach(async () => {
//     // Deploy contracts
//     weth = await MockERC20.deploy('WETH', 'WETH')
//     token = await MockERC20.deploy('DAI', 'DAI')

//     factory = await UniswapFactory.deploy(0)

//     router = await UniswapRouter.deploy(factory.address, weth.address)
//     // uniswap = await UniswapPair.deploy()
//   })

//   it('Should complete a swap', async () => {

//   })

// })
