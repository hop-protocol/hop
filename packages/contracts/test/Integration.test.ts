import { expect } from 'chai'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import { BigNumber, BigNumberish, ContractFactory, Signer, Contract } from 'ethers'
import MerkleTree from '../lib/MerkleTree'
import Transfer from '../lib/Transfer'
import { getL2MessengerId, setMessengerWrapperDefaults } from './utils'
import { L2_NAMES } from './constants'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
const AMOUNT = BigNumber.from('123')

describe("Full story", () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  // let withdrawals: Withdrawal[]
  let messengerId: string

  // Factories
  let L1_Wormhole: ContractFactory
  let L2_Wormhole: ContractFactory
  let MockERC20: ContractFactory
  // let CrossDomainMessenger: ContractFactory
  let L1_MessengerWrapper: ContractFactory
  // let L1_OVMTokenBridge: ContractFactory
  // let L2_OVMTokenBridge: ContractFactory
  let UniswapRouter: ContractFactory
  let UniswapFactory: ContractFactory
  let MockMessenger: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_messenger: Contract
  let l1_messengerWrapper: Contract
  let l1_wormhole: Contract
  // let l1_ovmBridge: Contract
  
  // L2
  let l2_messenger: Contract
  // let l2_ovmBridge: Contract
  let l2_wormhole: Contract
  let l2_uniswapFactory: Contract
  let l2_uniswapRouter: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]

    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    L1_Wormhole = await ethers.getContractFactory('contracts/L1_Wormhole.sol:L1_Wormhole')
    L2_Wormhole = await ethers.getContractFactory('contracts/L2_Wormhole.sol:L2_Wormhole')
    L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
    MockMessenger = await ethers.getContractFactory('contracts/test/MockMessenger.sol:MockMessenger')
    // UniswapRouter = await ethers.getContractFactory('@uniswap/v2-periphery/contracts/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapRouter = await ethers.getContractFactory('contracts/uniswap/UniswapV2Router02.sol:UniswapV2Router02')
    UniswapFactory = await ethers.getContractFactory('@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory')
  })

  beforeEach(async () => {
    // Deploy contracts
    l1_poolToken = await MockERC20.deploy('Dai Stable Token', 'DAI')
    l1_wormhole = await L1_Wormhole.deploy(l1_poolToken.address)
    l1_messenger = await MockMessenger.deploy()
    l1_messengerWrapper = await L1_MessengerWrapper.deploy()

    l2_messenger = await MockMessenger.deploy()
    l2_wormhole = await L2_Wormhole.deploy(l2_messenger.address)

    // Initialize messenger wrapper
    const l2Name = L2_NAMES.ARBITRUM
    await setMessengerWrapperDefaults(l2Name, l1_messengerWrapper, l1_messenger.address, l2_messenger.address)

    // Uniswap
    l2_uniswapFactory = await UniswapFactory.deploy(await user.getAddress())
    const weth = await MockERC20.deploy('WETH', 'WETH')
    l2_uniswapRouter = await UniswapRouter.deploy(l2_uniswapFactory.address, weth.address)//'0x0000000000000000000000000000000000000000')

    // Set up wormholes
    messengerId = getL2MessengerId('arbitrum')
    await l1_wormhole.setL1Messenger(messengerId, l1_messengerWrapper.address)
    await l2_wormhole.setL1Messenger(l1_messengerWrapper.address)

    // Set up messenger
    await l1_messenger.setTargetMessengerAddress(l2_messenger.address)
    await l2_messenger.setTargetMessengerAddress(l1_messenger.address)
    await l1_messenger.setTargetWormholeAddress(l1_wormhole.address)
    await l2_messenger.setTargetWormholeAddress(l2_wormhole.address)

    // Distribute poolToken
    await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
    await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
  })

  it('Should complete the full story', async () => {
    /**
     * Liquidity provider adds liquidity
     */

    // liquidityProvider moves funds across the canonical bridge
    // await l1_poolToken.connect(liquidityProvider).approve(l2_messenger.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    // await l2_messenger.connect(liquidityProvider).sendToL2(messengerId, await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    // await l2_wormhole.relayNextMessage()
    // await expectBalanceOf(l2_ovmBridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))

    // liquidityProvider moves funds across the liquidity bridge
    await l1_poolToken.connect(liquidityProvider).approve(l1_wormhole.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l1_wormhole.connect(liquidityProvider).sendToL2(messengerId, await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_wormhole, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))

    // liquidityProvider adds liquidity to the pool on L2
    // console.log('888')
    // await l2_ovmBridge.connect(liquidityProvider).approve(l2_uniswapRouter.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    // console.log('999')
    // await l2_messenger.connect(liquidityProvider).approve(l2_uniswapRouter.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    // console.log('aaa')
    // await l2_uniswapRouter.connect(liquidityProvider).addLiquidity(
    //   l2_ovmBridge.address,
    //   l2_messenger.address,
    //   LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2),
    //   LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2),
    //   '0',
    //   '0',
    //   await liquidityProvider.getAddress(),
    //   '999999999999'
    // )
    // console.log('bbb')
    // await expectBalanceOf(l2_ovmBridge, liquidityProvider, '0')
    // console.log('ccc')
    // await expectBalanceOf(l2_messenger, liquidityProvider, '0')
    // console.log('ddd')

    // const uniswapPairAddress: string = await l2_uniswapFactory.getPair(l2_ovmBridge.address, l2_messenger.address)
    // console.log('eee')
    // const uniswapPair = await ethers.getContractAt('@uniswap/v2-core/contracts/UniswapV2Pair.sol:UniswapV2Pair', uniswapPairAddress)
    // console.log('fff')
    // await expectBalanceOf(uniswapPair, liquidityProvider, '499000')
    // console.log('ggg')
    // await expectBalanceOf(l2_ovmBridge, uniswapPair, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    // console.log('hhh')
    // await expectBalanceOf(l2_messenger, uniswapPair, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))

    // /**
    //  * User moves funds from L1 to L2 on the canonical bridge and back to L1 on the liquidity bridge
    //  */

    // // User moves funds across the canonical bridge
    // console.log('iii')
    // await l1_poolToken.connect(user).approve(l1_ovmBridge.address, USER_INITIAL_BALANCE)
    // console.log('jjj')
    // await l1_ovmBridge.connect(user).xDomainTransfer(await user.getAddress(), USER_INITIAL_BALANCE)
    // console.log('kkk')
    // await l2_wormhole.relayNextMessage()
    // console.log('lll')
    // await expectBalanceOf(l2_ovmBridge, user, USER_INITIAL_BALANCE)

    // // User sells ovm token for bridge token
    // console.log('mmm')
    // await l2_ovmBridge.connect(user).approve(l2_uniswapRouter.address, USER_INITIAL_BALANCE)
    // console.log('nnn')
    // await l2_uniswapRouter.connect(user).swapExactTokensForTokens(
    //   USER_INITIAL_BALANCE,
    //   '0',
    //   [
    //     l2_ovmBridge.address,
    //     l2_messenger.address
    //   ],
    //   await user.getAddress(),
    //   '999999999999'
    // )
    // console.log('ooo')
    // await expectBalanceOf(l2_ovmBridge, user, '0')
    // console.log('ppp')
    // await expectBalanceOf(l2_messenger, user, '99')

    // console.log('qqq')
    // const transfer = new Transfer({
    //   amount: BigNumber.from('99'),
    //   nonce: 0,
    //   sender: await user.getAddress(),
    // })

    // // User moves funds back to L1 across the liquidity bridge
    // console.log('rrr')
    // await l2_messenger.connect(user).sendToMainnet(transfer.sender, transfer.amount, transfer.nonce)
    // console.log('sss')
    // await l2_messenger.commitTransfers()
    // console.log('ttt')
    // await l1_wormhole.relayNextMessage()

    // // User withdraws from L1 bridge
    // console.log('uuu')
    // const tree = new MerkleTree([ transfer.getTransferHash() ])
    // console.log('vvv')
    // const proof = tree.getProof(transfer.getTransferHash())
    // console.log('www')
    // await l2_messenger.withdraw(
    //   transfer.amount,
    //   transfer.nonce,
    //   tree.getRoot(),
    //   proof
    // )

    // console.log('xxx')
    // await expectBalanceOf(l1_poolToken, user, '99')
  })

  const expectBalanceOf = async (token: Contract, account: Signer | Contract, expectedBalance: BigNumberish) => {
    const accountAddress = account instanceof Signer ? await account.getAddress() : account.address
    const balance = await token.balanceOf(accountAddress)
    expect(balance.toString()).to.eq(BigNumber.from(expectedBalance).toString())
  }
})
