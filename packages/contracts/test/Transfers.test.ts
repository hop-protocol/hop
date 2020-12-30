import '@nomiclabs/hardhat-waffle'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'
import MerkleTree from '../lib/MerkleTree'
import Transfer from '../lib/Transfer'

import { setMessengerWrapperDefaults, expectBalanceOf } from './shared/utils'
import { L2_NAMES, DEFAULT_L2_GAS_LIMIT } from './shared/constants'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
const SWAP_DEADLINE_BUFFER = BigNumber.from('3600')
const RELAYER_FEE = BigNumber.from('1000000000000000000')


const MAINNET_CHAIN_ID = BigNumber.from('1')
const OPTIMISM_1_CHAIN_ID = BigNumber.from('420')
const OPTIMISM_2_CHAIN_ID = BigNumber.from('422')
const ARBITRUM_CHAIN_ID = BigNumber.from('152709604825713')

describe("Transfers", () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  let committee: Signer
  let challenger: Signer

  // Factories
  let L1_Bridge: ContractFactory
  let L2_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let L1_MessengerWrapper: ContractFactory
  let CrossDomainMessenger: ContractFactory
  let L1_OVMTokenBridge: ContractFactory
  let L2_OVMTokenBridge: ContractFactory
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_bridge: Contract

  let l1_ovm1_messengerWrapper: Contract
  let l1_ovm1_messenger: Contract
  let l1_ovm1_ovmBridge: Contract

  let l1_ovm2_messengerWrapper: Contract
  let l1_ovm2_messenger: Contract
  let l1_ovm2_ovmBridge: Contract
  
  // Optimism 1
  let l2_ovm1_bridge: Contract
  let l2_ovm1_ovmBridge: Contract
  let l2_ovm1_messenger: Contract
  let l2_ovm1_uniswapFactory: Contract
  let l2_ovm1_uniswapRouter: Contract

  // Optimism 2
  let l2_ovm2_bridge: Contract
  let l2_ovm2_ovmBridge: Contract
  let l2_ovm2_messenger: Contract
  let l2_ovm2_uniswapFactory: Contract
  let l2_ovm2_uniswapRouter: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]
    committee = accounts[3]
    challenger = accounts[4]

    L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Optimism.sol:Optimism')
    L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
    L2_Bridge = await ethers.getContractFactory('contracts/test/Mock_L2_OptimismBridge.sol:Mock_L2_OptimismBridge')
    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    CrossDomainMessenger = await ethers.getContractFactory('contracts/test/mockOVM_CrossDomainMessenger.sol:mockOVM_CrossDomainMessenger')
    L1_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L1_OVMTokenBridge.sol:L1_OVMTokenBridge')
    L2_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L2_OVMTokenBridge.sol:L2_OVMTokenBridge')
    // UniswapRouter = await ethers.getContractFactory('@uniswap/v2-periphery/contracts/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')
  })

  beforeEach(async () => {
    /**
     * Setup  L1 contracts
     */
    l1_poolToken = await MockERC20.deploy('Dai Stable Token', 'DAI')
    l1_bridge = await L1_Bridge.deploy(l1_poolToken.address, await committee.getAddress())
  
    // Optimism 1
    l1_ovm1_messenger = await CrossDomainMessenger.deploy(0)
    l1_ovm1_ovmBridge = await L1_OVMTokenBridge.deploy(l1_ovm1_messenger.address, l1_poolToken.address)
    l1_ovm1_messengerWrapper = await L1_MessengerWrapper.deploy()

    // Optimism 2
    l1_ovm2_messenger = await CrossDomainMessenger.deploy(0)
    l1_ovm2_ovmBridge = await L1_OVMTokenBridge.deploy(l1_ovm2_messenger.address, l1_poolToken.address)
    l1_ovm2_messengerWrapper = await L1_MessengerWrapper.deploy()

    /**
     * Setup Optimism 1 contracts
     */

    // Deploy  L2 contracts
    l2_ovm1_messenger = await CrossDomainMessenger.deploy(0)
    l2_ovm1_ovmBridge = await L2_OVMTokenBridge.deploy(l2_ovm1_messenger.address)
    l2_ovm1_bridge = await L2_Bridge.deploy(OPTIMISM_1_CHAIN_ID, l2_ovm1_messenger.address, l2_ovm1_ovmBridge.address, await committee.getAddress())

    // Initialize bridge wrapper
    await setMessengerWrapperDefaults(L2_NAMES.OPTIMISM_1, l1_ovm1_messengerWrapper, l1_ovm1_messenger.address, l2_ovm1_bridge.address)
    await l1_ovm1_messengerWrapper.setL1MessengerAddress(l1_ovm1_messenger.address)
    await l1_ovm1_messengerWrapper.setL2BridgeAddress(l2_ovm1_bridge.address)
    await l1_ovm1_messengerWrapper.setDefaultGasLimit(DEFAULT_L2_GAS_LIMIT)

    // Uniswap
    l2_ovm1_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
    l2_ovm1_uniswapRouter = await UniswapRouter.deploy(l2_ovm1_uniswapFactory.address, '0x0000000000000000000000000000000000000000')

    /**
     * Setup Optimism 2 contracts
     */

    l2_ovm2_messenger = await CrossDomainMessenger.deploy(0)
    l2_ovm2_ovmBridge = await L2_OVMTokenBridge.deploy(l2_ovm2_messenger.address)
    l2_ovm2_bridge = await L2_Bridge.deploy(OPTIMISM_2_CHAIN_ID, l2_ovm2_messenger.address, l2_ovm2_ovmBridge.address, await committee.getAddress())

    // Initialize bridge wrapper
    await setMessengerWrapperDefaults(L2_NAMES.OPTIMISM_2, l1_ovm2_messengerWrapper, l2_ovm2_messenger.address, l2_ovm2_bridge.address)
    await l1_ovm2_messengerWrapper.setL1MessengerAddress(l1_ovm2_messenger.address)
    await l1_ovm2_messengerWrapper.setL2BridgeAddress(l2_ovm2_bridge.address)
    await l1_ovm2_messengerWrapper.setDefaultGasLimit(DEFAULT_L2_GAS_LIMIT)

    // Uniswap
    l2_ovm2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
    l2_ovm2_uniswapRouter = await UniswapRouter.deploy(l2_ovm2_uniswapFactory.address, '0x0000000000000000000000000000000000000000')

    // Set up Optimism 1 Cross Domain Messengers
    await l1_ovm1_messenger.setTargetMessengerAddress(l2_ovm1_messenger.address)
    await l2_ovm1_messenger.setTargetMessengerAddress(l1_ovm1_messenger.address)

    // Set up Optimism 2 Cross Domain Messengers
    await l1_ovm2_messenger.setTargetMessengerAddress(l2_ovm2_messenger.address)
    await l2_ovm2_messenger.setTargetMessengerAddress(l1_ovm2_messenger.address)

    // Set up Optimism 1 bridges
    l1_ovm1_ovmBridge.setCrossDomainBridgeAddress(l2_ovm1_ovmBridge.address)
    l2_ovm1_ovmBridge.setCrossDomainBridgeAddress(l1_ovm1_ovmBridge.address)

    // Set up Optimism 2 bridges
    l1_ovm2_ovmBridge.setCrossDomainBridgeAddress(l2_ovm2_ovmBridge.address)
    l2_ovm2_ovmBridge.setCrossDomainBridgeAddress(l1_ovm2_ovmBridge.address)

    // Set up Optimism 1 liquidity bridge
    await l1_bridge.setCrossDomainMessengerWrapper(OPTIMISM_1_CHAIN_ID, l1_ovm1_messengerWrapper.address)
    await l2_ovm1_bridge.setL1BridgeAddress(l1_bridge.address)
    await l2_ovm1_bridge.setExchangeAddress(l2_ovm1_uniswapRouter.address)

    // Set up Optimism 2 liquidity bridge
    await l1_bridge.setCrossDomainMessengerWrapper(OPTIMISM_2_CHAIN_ID, l1_ovm2_messengerWrapper.address)
    await l2_ovm2_bridge.setL1BridgeAddress(l1_bridge.address)
    await l2_ovm2_bridge.setExchangeAddress(l2_ovm2_uniswapRouter.address)

    // Distribute poolToken
    await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
    await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_poolToken.mint(await committee.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_poolToken.mint(await challenger.getAddress(), BigNumber.from('10'))
  })

  it('Should bond and settle a withdrawal ', async () => {

    await l1_poolToken.connect(liquidityProvider).approve(l1_ovm1_ovmBridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await l1_poolToken.connect(liquidityProvider).approve(l1_ovm2_ovmBridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await l1_poolToken.connect(liquidityProvider).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))

    /**
     * Liquidity provider adds liquidity to Optimism 1
     */

    // liquidityProvider moves funds across the messenger
    await l1_ovm1_ovmBridge.connect(liquidityProvider).xDomainTransfer(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await l2_ovm1_messenger.relayNextMessage()
    await expectBalanceOf(l2_ovm1_ovmBridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))

    // liquidityProvider moves funds across the liquidity bridge
    await l1_bridge.connect(liquidityProvider).sendToL2(OPTIMISM_1_CHAIN_ID, await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await l2_ovm1_messenger.relayNextMessage()
    await expectBalanceOf(l2_ovm1_bridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))

    // liquidityProvider adds liquidity to the pool on L2
    await l2_ovm1_ovmBridge.connect(liquidityProvider).approve(l2_ovm1_uniswapRouter.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await l2_ovm1_bridge.connect(liquidityProvider).approve(l2_ovm1_uniswapRouter.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await l2_ovm1_uniswapRouter.connect(liquidityProvider).addLiquidity(
      l2_ovm1_ovmBridge.address,
      l2_ovm1_bridge.address,
      LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4),
      LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4),
      '0',
      '0',
      await liquidityProvider.getAddress(),
      '999999999999'
    )
    await expectBalanceOf(l2_ovm1_ovmBridge, liquidityProvider, '0')
    await expectBalanceOf(l2_ovm1_bridge, liquidityProvider, '0')

    const ovm1UniswapPairAddress: string = await l2_ovm1_uniswapFactory.getPair(l2_ovm1_ovmBridge.address, l2_ovm1_bridge.address)
    const ovm1UniswapPair = await ethers.getContractAt('@uniswap/v2-core/contracts/UniswapV2Pair.sol:UniswapV2Pair', ovm1UniswapPairAddress)
    await expectBalanceOf(ovm1UniswapPair, liquidityProvider, '249000')
    await expectBalanceOf(l2_ovm1_ovmBridge, ovm1UniswapPair, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await expectBalanceOf(l2_ovm1_bridge, ovm1UniswapPair, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))

    /**
     * Liquidity provider adds liquidity to Optimism 2
     */

    // liquidityProvider moves funds across the messenger
    await l1_ovm2_ovmBridge.connect(liquidityProvider).xDomainTransfer(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await l2_ovm2_messenger.relayNextMessage()
    await expectBalanceOf(l2_ovm2_ovmBridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))

    // liquidityProvider moves funds across the liquidity bridge
    await l1_bridge.connect(liquidityProvider).sendToL2(OPTIMISM_2_CHAIN_ID, await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await l2_ovm2_messenger.relayNextMessage()
    await expectBalanceOf(l2_ovm2_bridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    
    // liquidityProvider adds liquidity to the pool on L2
    await l2_ovm2_ovmBridge.connect(liquidityProvider).approve(l2_ovm2_uniswapRouter.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await l2_ovm2_bridge.connect(liquidityProvider).approve(l2_ovm2_uniswapRouter.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await l2_ovm2_uniswapRouter.connect(liquidityProvider).addLiquidity(
      l2_ovm2_ovmBridge.address,
      l2_ovm2_bridge.address,
      LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4),
      LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4),
      '0',
      '0',
      await liquidityProvider.getAddress(),
      '999999999999'
    )
    await expectBalanceOf(l2_ovm2_ovmBridge, liquidityProvider, '0')
    await expectBalanceOf(l2_ovm2_bridge, liquidityProvider, '0')

    const ovm2UniswapPairAddress: string = await l2_ovm1_uniswapFactory.getPair(l2_ovm1_ovmBridge.address, l2_ovm1_bridge.address)
    const ovm2UniswapPair = await ethers.getContractAt('@uniswap/v2-core/contracts/UniswapV2Pair.sol:UniswapV2Pair', ovm2UniswapPairAddress)
    await expectBalanceOf(ovm2UniswapPair, liquidityProvider, '249000')
    await expectBalanceOf(l2_ovm1_ovmBridge, ovm2UniswapPair, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))
    await expectBalanceOf(l2_ovm1_bridge, ovm2UniswapPair, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(4))

    // User moves funds across the Optimism 1 hop bridge
    await l1_poolToken.connect(user).approve(l1_bridge.address, USER_INITIAL_BALANCE)
    await l1_bridge.connect(user).sendToL2(OPTIMISM_1_CHAIN_ID, user.getAddress(), USER_INITIAL_BALANCE)
    await l2_ovm1_messenger.relayNextMessage()
    await expectBalanceOf(l2_ovm1_bridge, user, USER_INITIAL_BALANCE)

    // Send from Optimism 1 to Optimism 2
    // await l2_ovm1_ovmBridge.approve(l2_ovm1_bridge.address, USER_INITIAL_BALANCE)
    await l2_ovm1_bridge.send(OPTIMISM_2_CHAIN_ID, user.getAddress(), USER_INITIAL_BALANCE, 0, 0, 0, 0)
    const transferSentEvent = (await l2_ovm1_bridge.queryFilter(l2_ovm1_bridge.filters.TransferSent()))[0]
    const transferHash = transferSentEvent.args.transferHash

    // Committee moves funds to Optimism 2
    await l1_poolToken.connect(committee).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l1_bridge.connect(committee).sendToL2(OPTIMISM_2_CHAIN_ID, committee.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_ovm2_messenger.relayNextMessage()
    await expectBalanceOf(l2_ovm2_bridge, committee, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))

    // Committee stakes on Optimism 2
    await l2_ovm2_bridge.connect(committee).approve(l2_ovm2_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_ovm2_bridge.connect(committee).stake(LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))


    // Bond the withdrawal
    await l2_ovm2_bridge.connect(committee).bondWithdrawal(user.getAddress(), user.getAddress(), USER_INITIAL_BALANCE, 0, 0)
    await expectBalanceOf(l2_ovm2_bridge, user, USER_INITIAL_BALANCE)

    // commit the transfer root
    await l2_ovm1_bridge.commitTransfers()
    const transfersCommittedEvent = (await l2_ovm1_bridge.queryFilter(l2_ovm1_bridge.filters.TransfersCommitted()))[0]
    const transferRootHash = transfersCommittedEvent.args.root

    // Committee stakes on L1 Hop Bridge
    await l1_poolToken.connect(committee).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l1_bridge.connect(committee).stake(LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))

    // Bond the transfer root on L1
    await l1_bridge.connect(committee).bondTransferRoot(transferRootHash, [OPTIMISM_2_CHAIN_ID], [USER_INITIAL_BALANCE])
    await l2_ovm2_messenger.relayNextMessage()

    // Settle the withdrawal bond
    await l2_ovm2_bridge.settleBondedWithdrawal(transferHash, transferRootHash, [])

    await l2_ovm2_bridge.connect(committee).unstake(LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await expectBalanceOf(l2_ovm2_bridge, committee, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
  })
})