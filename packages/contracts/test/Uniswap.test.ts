import { expect } from 'chai'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'

describe("Uniswap", () => {
  let accounts: Signer[]
  let user: Signer

  // Factories
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory
  let UniswapPair: ContractFactory
  let MockERC20: ContractFactory

  // L1
  let router: Contract
  let factory: Contract
  let uniswap: Contract
  let weth: Contract
  let token: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]

    // UniswapRouter = await ethers.getContractFactory('@uniswap/v2-periphery/contracts/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')
    UniswapPair = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Pair.sol:UniswapV2Pair')
    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  })

  beforeEach(async () => {
    // Deploy contracts
    weth = await MockERC20.deploy('WETH', 'WETH')
    token = await MockERC20.deploy('DAI', 'DAI')

    factory = await UniswapFactory.deploy(await user.getAddress())

    router = await UniswapRouter.deploy(factory.address, weth.address)
  })

  it('Should complete a swap', async () => {

  })

})
