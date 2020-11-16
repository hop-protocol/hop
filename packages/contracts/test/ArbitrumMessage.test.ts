import { expect } from 'chai'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import { BigNumber, BigNumberish, ContractFactory, Signer, Contract } from 'ethers'
import { getL2CanonicalBridgeId, setBridgeWrapperDefaults } from './utils'
import { L2_NAMES } from './constants'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
const SWAP_DEADLINE_BUFFER = BigNumber.from('3600')

describe("Full story", () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  let canonicalBridgeId: string

  // Factories
  let L1_Bridge: ContractFactory
  let L2_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let L1_BridgeWrapper: ContractFactory
  let MockCanonicalBridge: ContractFactory
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_canonicalBridge: Contract
  let l1_bridgeWrapper: Contract
  let l1_bridge: Contract
  
  // L2
  let l2_canonicalBridge: Contract
  let l2_bridge: Contract
  let l2_uniswapFactory: Contract
  let l2_uniswapRouter: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]

    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
    L2_Bridge = await ethers.getContractFactory('contracts/bridges/L2_ArbitrumBridge.sol:L2_ArbitrumBridge')
    L1_BridgeWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
    MockCanonicalBridge = await ethers.getContractFactory('contracts/test/MockCanonicalBridge.sol:MockCanonicalBridge')
    UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')
  })

  beforeEach(async () => {
    // Deploy contracts
    const weth = await MockERC20.deploy('WETH', 'WETH')
    l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
    l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, weth.address)

    l1_poolToken = await MockERC20.deploy('Dai Stable Token', 'DAI')
    l1_bridge = await L1_Bridge.deploy(l1_poolToken.address)
    l1_canonicalBridge = await MockCanonicalBridge.deploy()
    l1_bridgeWrapper = await L1_BridgeWrapper.deploy()

    l2_canonicalBridge = await MockCanonicalBridge.deploy()
    l2_bridge = await L2_Bridge.deploy(l2_canonicalBridge.address)

    // Initialize bridge wrapper
    const l2Name = L2_NAMES.ARBITRUM
    await setBridgeWrapperDefaults(l2Name, l1_bridgeWrapper, l1_canonicalBridge.address, l2_bridge.address)

    // Set up bridges
    canonicalBridgeId = getL2CanonicalBridgeId('arbitrum')
    await l1_bridge.setL1BridgeWrapper(canonicalBridgeId, l1_bridgeWrapper.address)
    await l2_bridge.setL1BridgeAddress(l1_bridge.address)
    await l2_bridge.setExchangeValues(SWAP_DEADLINE_BUFFER, l2_uniswapRouter.address, weth.address)

    // Set up bridge
    await l1_canonicalBridge.setTargetCanonicalBridgeAddress(l2_canonicalBridge.address)
    await l2_canonicalBridge.setTargetCanonicalBridgeAddress(l1_canonicalBridge.address)
    await l1_canonicalBridge.setTargetBridgeAddress(l1_bridge.address)
    await l2_canonicalBridge.setTargetBridgeAddress(l2_bridge.address)

    // Distribute poolToken
    await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
    await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
  })

  it('Should send tokens across the bridge with Arbitrum', async () => {
    // liquidityProvider moves funds across the bridge
    await l1_poolToken.connect(liquidityProvider).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l1_bridge.connect(liquidityProvider).sendToL2(canonicalBridgeId, await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_canonicalBridge.relayNextMessage()
    await expectBalanceOf(l2_bridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
  })

  it('Should return the correct bridge hash', async () => {
    const actualCanonicalBridgeId = getL2CanonicalBridgeId('arbitrum')
    const l2Name = L2_NAMES.ARBITRUM
    const expectedCanonicalBridgeId = await l1_bridge.getCanonicalBridgeId(l2Name)
    expect(actualCanonicalBridgeId).to.eq(expectedCanonicalBridgeId)
  })

  const expectBalanceOf = async (token: Contract, account: Signer | Contract, expectedBalance: BigNumberish) => {
    const accountAddress = account instanceof Signer ? await account.getAddress() : account.address
    const balance = await token.balanceOf(accountAddress)
    expect(balance.toString()).to.eq(BigNumber.from(expectedBalance).toString())
  }
})
