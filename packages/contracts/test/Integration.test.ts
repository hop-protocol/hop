import { expect } from 'chai'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import { BigNumber, BigNumberish, ContractFactory, Signer, Contract } from 'ethers'
import MerkleTree from '../lib/MerkleTree'
import Transfer from '../lib/Transfer'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
const AMOUNT = BigNumber.from('123')
const SWAP_DEADLINE_BUFFER = BigNumber.from('3600')

describe("Full story", () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  // let withdrawals: Withdrawal[]

  // Factories
  let L1_Bridge: ContractFactory
  let L2_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let CrossDomainMessenger: ContractFactory
  let L1_OVMTokenBridge: ContractFactory
  let L2_OVMTokenBridge: ContractFactory
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_bridge: Contract
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
    L1_Bridge = await ethers.getContractFactory('contracts/L1_Bridge.sol:L1_Bridge')
    L2_Bridge = await ethers.getContractFactory('contracts/L2_Bridge.sol:L2_Bridge')
    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    CrossDomainMessenger = await ethers.getContractFactory('contracts/test/mockOVM_CrossDomainMessenger.sol:mockOVM_CrossDomainMessenger')
    L1_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L1_OVMTokenBridge.sol:L1_OVMTokenBridge')
    L2_OVMTokenBridge = await ethers.getContractFactory('contracts/test/L2_OVMTokenBridge.sol:L2_OVMTokenBridge')
    // UniswapRouter = await ethers.getContractFactory('@uniswap/v2-periphery/contracts/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')
  })

  beforeEach(async () => {
    // Uniswap
    l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
    const weth = await MockERC20.deploy('WETH', 'WETH')
    l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, weth.address)//'0x0000000000000000000000000000000000000000')

    // Deploy  L1 contracts
    l1_poolToken = await MockERC20.deploy('Dai Stable Token', 'DAI')
    l1_messenger = await CrossDomainMessenger.deploy(0)
    l1_bridge = await L1_Bridge.deploy(l1_messenger.address, l1_poolToken.address)
    l1_ovmBridge = await L1_OVMTokenBridge.deploy(l1_messenger.address, l1_poolToken.address)

     // Deploy  L2 contracts
    l2_messenger = await CrossDomainMessenger.deploy(0)
    l2_ovmBridge = await L2_OVMTokenBridge.deploy(l2_messenger.address)
    l2_bridge = await L2_Bridge.deploy(l2_messenger.address, SWAP_DEADLINE_BUFFER, l2_uniswapRouter.address, l2_ovmBridge.address)

    // Set up Cross Domain Messengers
    await l1_messenger.setTargetMessengerAddress(l2_messenger.address)
    await l2_messenger.setTargetMessengerAddress(l1_messenger.address)

    // Set up OVM bridges
    l1_ovmBridge.setCrossDomainBridgeAddress(l2_ovmBridge.address)
    l2_ovmBridge.setCrossDomainBridgeAddress(l1_ovmBridge.address)

    // Set up liquidity bridge
    await l1_bridge.setL2Bridge(l2_bridge.address)
    await l2_bridge.setL1Bridge(l1_bridge.address)

    // Distribute poolToken
    await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
    await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
  })

  it('Should complete the full story', async () => {
    /**
     * Liquidity provider adds liquidity
     */

    // liquidityProvider moves funds across the canonical bridge
    await l1_poolToken.connect(liquidityProvider).approve(l1_ovmBridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l1_ovmBridge.connect(liquidityProvider).xDomainTransfer(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_ovmBridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))

    // liquidityProvider moves funds across the liquidity bridge
    await l1_poolToken.connect(liquidityProvider).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l1_bridge.connect(liquidityProvider).sendToL2(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
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
     * User moves funds from L1 to L2 on the canonical bridge and back to L1 on the liquidity bridge
     */

    // User moves funds across the canonical bridge
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
      amount: BigNumber.from('99'),
      nonce: 0,
      sender: await user.getAddress()
    })

    // User moves funds back to L1 across the liquidity bridge
    await l2_bridge.connect(user).sendToMainnet(transfer.sender, transfer.amount, transfer.nonce)
    await l2_bridge.commitTransfers()
    await l1_messenger.relayNextMessage()

    // User withdraws from L1 bridge
    const tree = new MerkleTree([ transfer.getTransferHash() ])
    const proof = tree.getProof(transfer.getTransferHash())
    await l1_bridge.withdraw(
      transfer.amount,
      transfer.nonce,
      tree.getRoot(),
      proof
    )

    await expectBalanceOf(l1_poolToken, user, '99')
  })

  const expectBalanceOf = async (token: Contract, account: Signer | Contract, expectedBalance: BigNumberish) => {
    const accountAddress = account instanceof Signer ? await account.getAddress() : account.address
    const balance = await token.balanceOf(accountAddress)
    expect(balance.toString()).to.eq(BigNumber.from(expectedBalance).toString())
  }
})
