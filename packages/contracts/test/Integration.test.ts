import '@nomiclabs/hardhat-waffle'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber, BigNumberish, ContractFactory, Signer, Contract } from 'ethers'
import MerkleTree from '../lib/MerkleTree'
import Transfer from '../lib/Transfer'

import { getL2MessengerId, setMessengerWrapperDefaults } from './utils'
import { L2_NAMES } from './constants'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
const SWAP_DEADLINE_BUFFER = BigNumber.from('3600')
const RELAYER_FEE = BigNumber.from('1000000000000000000')

describe("Full story", () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  let messengerId: string
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
  let l1_messengerWrapper: Contract
  let l1_messenger: Contract
  let l1_ovmBridge: Contract
  
  // L2
  let l2_bridge: Contract
  let l2_ovmBridge: Contract
  let l2_messenger: Contract
  let l2_uniswapFactory: Contract
  let l2_uniswapRouter: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]
    committee = accounts[3]
    challenger = accounts[4]

    L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Optimism.sol:Optimism')
    L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
    L2_Bridge = await ethers.getContractFactory('contracts/bridges/L2_OptimismBridge.sol:L2_OptimismBridge')
    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    CrossDomainMessenger = await ethers.getContractFactory('contracts/test/mockOVM_CrossDomainMessenger.sol:mockOVM_CrossDomainMessenger')
    L1_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L1_OVMTokenBridge.sol:L1_OVMTokenBridge')
    L2_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L2_OVMTokenBridge.sol:L2_OVMTokenBridge')
    // UniswapRouter = await ethers.getContractFactory('@uniswap/v2-periphery/contracts/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')
  })

  beforeEach(async () => {
    // Deploy  L1 contracts
    l1_poolToken = await MockERC20.deploy('Dai Stable Token', 'DAI')
    l1_messenger = await CrossDomainMessenger.deploy(0)
    l1_bridge = await L1_Bridge.deploy(l1_poolToken.address)
    l1_ovmBridge = await L1_OVMTokenBridge.deploy(l1_messenger.address, l1_poolToken.address)
    l1_messengerWrapper = await L1_MessengerWrapper.deploy()

    // Deploy  L2 contracts
    l2_messenger = await CrossDomainMessenger.deploy(0)
    l2_bridge = await L2_Bridge.deploy(l2_messenger.address)
    l2_ovmBridge = await L2_OVMTokenBridge.deploy(l2_messenger.address)

    // Initialize bridge wrapper
    const l2Name = L2_NAMES.OPTIMISM
    await setMessengerWrapperDefaults(l2Name, l1_messengerWrapper, l1_messenger.address, l2_bridge.address)

    // Uniswap
    l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
    const weth = await MockERC20.deploy('WETH', 'WETH')
    l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, weth.address)//'0x0000000000000000000000000000000000000000')

    // Set up Cross Domain Messengers
    await l1_messenger.setTargetMessengerAddress(l2_messenger.address)
    await l2_messenger.setTargetMessengerAddress(l1_messenger.address)

    // Set up OVM bridges
    l1_ovmBridge.setCrossDomainBridgeAddress(l2_ovmBridge.address)
    l2_ovmBridge.setCrossDomainBridgeAddress(l1_ovmBridge.address)

    // Set up liquidity bridge
    messengerId = getL2MessengerId('optimism')
    await l1_bridge.setL1MessengerWrapper(messengerId, l1_messengerWrapper.address)
    await l2_bridge.setL1BridgeAddress(l1_bridge.address)
    await l2_bridge.setExchangeValues(SWAP_DEADLINE_BUFFER, l2_uniswapRouter.address, weth.address)

    // Distribute poolToken
    await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
    await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_poolToken.mint(await committee.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_poolToken.mint(await challenger.getAddress(), BigNumber.from('10'))
  })

  it('Should complete the full story', async () => {
    /**
     * Liquidity provider adds liquidity
     */

    // liquidityProvider moves funds across the messenger
    await l1_poolToken.connect(liquidityProvider).approve(l1_ovmBridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l1_ovmBridge.connect(liquidityProvider).xDomainTransfer(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_ovmBridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))

    // liquidityProvider moves funds across the liquidity bridge
    await l1_poolToken.connect(liquidityProvider).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l1_bridge.connect(liquidityProvider).sendToL2(messengerId, await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_bridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))

    // liquidityProvider adds liquidity to the pool on L2
    await l2_ovmBridge.connect(liquidityProvider).approve(l2_uniswapRouter.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_bridge.connect(liquidityProvider).approve(l2_uniswapRouter.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_uniswapRouter.connect(liquidityProvider).addLiquidity(
      l2_ovmBridge.address,
      l2_bridge.address,
      LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2),
      LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2),
      '0',
      '0',
      await liquidityProvider.getAddress(),
      '999999999999'
    )
    await expectBalanceOf(l2_ovmBridge, liquidityProvider, '0')
    await expectBalanceOf(l2_bridge, liquidityProvider, '0')

    const uniswapPairAddress: string = await l2_uniswapFactory.getPair(l2_ovmBridge.address, l2_bridge.address)
    const uniswapPair = await ethers.getContractAt('@uniswap/v2-core/contracts/UniswapV2Pair.sol:UniswapV2Pair', uniswapPairAddress)
    await expectBalanceOf(uniswapPair, liquidityProvider, '499000')
    await expectBalanceOf(l2_ovmBridge, uniswapPair, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await expectBalanceOf(l2_bridge, uniswapPair, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))

    /**
     * User moves funds from L1 to L2 on the messenger and back to L1 on the liquidity bridge
     */

    // User moves funds across the messenger
    await l1_poolToken.connect(user).approve(l1_ovmBridge.address, USER_INITIAL_BALANCE)
    await l1_ovmBridge.connect(user).xDomainTransfer(await user.getAddress(), USER_INITIAL_BALANCE)
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_ovmBridge, user, USER_INITIAL_BALANCE)

    // User sells ovm token for bridge token
    await l2_ovmBridge.connect(user).approve(l2_uniswapRouter.address, USER_INITIAL_BALANCE)
    await l2_uniswapRouter.connect(user).swapExactTokensForTokens(
      USER_INITIAL_BALANCE,
      '0',
      [
        l2_ovmBridge.address,
        l2_bridge.address
      ],
      await user.getAddress(),
      '999999999999'
    )
    await expectBalanceOf(l2_ovmBridge, user, '0')
    await expectBalanceOf(l2_bridge, user, '99')

    const transfer = new Transfer({
      layerId: getL2MessengerId('kovan'),
      amount: BigNumber.from('99'),
      nonce: 0,
      recipient: await user.getAddress(),
      relayerFee: BigNumber.from('0')
    })

    // User moves funds back to L1 across the liquidity bridge
    await l2_bridge.connect(user).sendToMainnet(transfer.layerId, transfer.recipient, transfer.amount, transfer.nonce, transfer.relayerFee)

    await l2_bridge.commitTransfers()
    await l1_messenger.relayNextMessage()

    const transfersCommittedEvent = (await l2_bridge.queryFilter(l2_bridge.filters.TransfersCommitted()))[0]

    await l1_poolToken.connect(committee).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_bridge.connect(committee).committeeStake(LIQUIDITY_PROVIDER_INITIAL_BALANCE)

    await l1_bridge.bondTransferRoot(transfersCommittedEvent.args.root, [getL2MessengerId('kovan')], [transfer.amount.add(transfer.relayerFee)])

    // User withdraws from L1 bridge
    const tree = new MerkleTree([ transfer.getTransferHash() ])
    const proof = tree.getProof(transfer.getTransferHash())
    await l1_bridge.withdraw(
      transfer.recipient,
      transfer.amount,
      transfer.nonce,
      transfer.relayerFee,
      tree.getRoot(),
      proof
    )

    await expectBalanceOf(l1_poolToken, user, '99')
  })

  it('Should not allow a transfer root that exceeds the committee bond', async () => {
    const transfer = new Transfer({
      layerId: getL2MessengerId('kovan'),
      recipient: await user.getAddress(),
      amount: BigNumber.from('98'),
      nonce: 0,
      relayerFee: RELAYER_FEE
    })

    // User withdraws from L1 bridge
    const tree = new MerkleTree([ transfer.getTransferHash() ])

    await l1_poolToken.connect(committee).approve(l1_bridge.address, '1')
    await l1_bridge.connect(committee).committeeStake('1')

    await expect(
      l1_bridge.bondTransferRoot(tree.getRoot(), transfer.amount.add(transfer.relayerFee))
    ).to.be.reverted
  })

  it('Should successfully challenge a malicious transfer root', async () => {
    const transfer = new Transfer({
      layerId: getL2MessengerId('kovan'),
      recipient: await user.getAddress(),
      amount: BigNumber.from('100'),
      nonce: 0,
      relayerFee: BigNumber.from('0')
    })

    // User withdraws from L1 bridge
    const tree = new MerkleTree([ transfer.getTransferHash() ])

    await l1_poolToken.connect(committee).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_bridge.connect(committee).committeeStake(LIQUIDITY_PROVIDER_INITIAL_BALANCE)

    await l1_bridge.bondTransferRoot(tree.getRoot(), [transfer.layerId], [transfer.amount.add(transfer.relayerFee)])

    await l1_poolToken.connect(challenger).approve(l1_bridge.address, BigNumber.from('10'))
    await l1_bridge.connect(challenger).challengeTransferRoot(tree.getRoot())

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 9]) // 9 days

    await l1_bridge.connect(challenger).resolveChallenge(tree.getRoot())
  })

  it('Should complete and l2 to l2 transfer', async () => {
    /**
     * User moves funds from L1 to L2 on the liquidity bridge and then L2 to L2 on the liquidity bridge
     */

    // User moves funds across the messenger
    await l1_poolToken.connect(user).approve(l1_bridge.address, USER_INITIAL_BALANCE)
    await l1_bridge.connect(user).sendToL2(messengerId, await user.getAddress(), USER_INITIAL_BALANCE)
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_bridge, user, USER_INITIAL_BALANCE)

    const transfer = new Transfer({
      layerId: messengerId,
      amount: BigNumber.from('99'),
      nonce: 0,
      recipient: await user.getAddress(),
      relayerFee: BigNumber.from('0')
    })

    // User moves funds to an L2 across the liquidity bridge
    // For testing purposes, they are sending to the L2 they are currently on which makes no sense in the real world.
    await l2_bridge.connect(user).sendToMainnet(transfer.layerId, transfer.recipient, transfer.amount, transfer.nonce, transfer.relayerFee)

    await l2_bridge.commitTransfers()
    await l1_messenger.relayNextMessage()

    const transfersCommittedEvent = (await l2_bridge.queryFilter(l2_bridge.filters.TransfersCommitted()))[0]

    await l1_poolToken.connect(committee).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_bridge.connect(committee).committeeStake(LIQUIDITY_PROVIDER_INITIAL_BALANCE)

    await l1_bridge.bondTransferRoot(transfersCommittedEvent.args.root, [transfer.layerId], [transfer.amount.add(transfer.relayerFee)])
    await l2_messenger.relayNextMessage()

    // User withdraws from L1 bridge
    const tree = new MerkleTree([ transfer.getTransferHash() ])
    const proof = tree.getProof(transfer.getTransferHash())
    await l2_bridge.withdraw(
      transfer.recipient,
      transfer.amount,
      transfer.nonce,
      transfer.relayerFee,
      tree.getRoot(),
      proof
    )

    await expectBalanceOf(l2_bridge, user, USER_INITIAL_BALANCE)
  })

  const expectBalanceOf = async (token: Contract, account: Signer | Contract, expectedBalance: BigNumberish) => {
    const accountAddress = account instanceof Signer ? await account.getAddress() : account.address
    const balance = await token.balanceOf(accountAddress)
    expect(balance.toString()).to.eq(BigNumber.from(expectedBalance).toString())
  }
})