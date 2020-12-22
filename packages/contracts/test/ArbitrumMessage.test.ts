import { expect } from 'chai'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import { BigNumber, BigNumberish, ContractFactory, Signer, Contract } from 'ethers'
import { setMessengerWrapperDefaults } from './utils'
import { L2_NAMES, ZERO_ADDRESS } from './constants'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
const SWAP_DEADLINE_BUFFER = BigNumber.from('3600')
const ARBITRUM_CHAIN_ID = 152709604825713

describe("ArbitrumMessage", () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  let committee: Signer

  // Factories
  let L1_Bridge: ContractFactory
  let L2_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let L1_MessengerWrapper: ContractFactory
  let MockMessenger: ContractFactory
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_messenger: Contract
  let l1_messengerWrapper: Contract
  let l1_bridge: Contract
  
  // L2
  let l2_messenger: Contract
  let l2_bridge: Contract
  let l2_poolToken: Contract
  let l2_uniswapFactory: Contract
  let l2_uniswapRouter: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]
    committee = accounts[2]

    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
    L2_Bridge = await ethers.getContractFactory('contracts/bridges/L2_ArbitrumBridge.sol:L2_ArbitrumBridge')
    L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
    MockMessenger = await ethers.getContractFactory('contracts/test/MockMessenger.sol:MockMessenger')
    UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')
  })

  beforeEach(async () => {
    // Deploy contracts
    const weth = await MockERC20.deploy('WETH', 'WETH')
    l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
    l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, weth.address)

    l1_poolToken = await MockERC20.deploy('Dai Stable Token', 'DAI')
    l1_bridge = await L1_Bridge.deploy(l1_poolToken.address, await committee.getAddress())
    l1_messenger = await MockMessenger.deploy()
    l1_messengerWrapper = await L1_MessengerWrapper.deploy()

    l2_poolToken = await MockERC20.deploy('L2 Dai Stable Token', 'L2DAI')
    l2_messenger = await MockMessenger.deploy()
    l2_bridge = await L2_Bridge.deploy(l2_messenger.address, l2_poolToken.address,  await committee.getAddress())

    // Initialize bridge wrapper
    const l2Name = L2_NAMES.ARBITRUM
    await setMessengerWrapperDefaults(l2Name, l1_messengerWrapper, l1_messenger.address, l2_bridge.address)

    // Set up bridge
    await l1_bridge.setCrossDomainMessengerWrapper(ARBITRUM_CHAIN_ID, l1_messengerWrapper.address)
    await l2_bridge.setL1BridgeAddress(l1_bridge.address)
    await l2_bridge.setExchangeAddress(l2_uniswapRouter.address)

    // Set up bridge
    await l1_messenger.setTargetMessengerAddress(l2_messenger.address)
    await l2_messenger.setTargetMessengerAddress(l1_messenger.address)
    await l1_messenger.setTargetBridgeAddress(l1_bridge.address)
    await l2_messenger.setTargetBridgeAddress(l2_bridge.address)

    // Distribute poolToken
    await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
    await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
  })

  it('Should send tokens across the bridge with Arbitrum', async () => {
    // liquidityProvider moves funds across the bridge
    await l1_poolToken.connect(liquidityProvider).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l1_bridge.connect(liquidityProvider).sendToL2(ARBITRUM_CHAIN_ID, await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_bridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
  })

  const expectBalanceOf = async (token: Contract, account: Signer | Contract, expectedBalance: BigNumberish) => {
    const accountAddress = account instanceof Signer ? await account.getAddress() : account.address
    const balance = await token.balanceOf(accountAddress)
    expect(balance.toString()).to.eq(BigNumber.from(expectedBalance).toString())
  }
})
