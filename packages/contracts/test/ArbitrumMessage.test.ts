import { expect } from 'chai'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import { BigNumber, BigNumberish, ContractFactory, Signer, Contract } from 'ethers'
import { getL2MessengerId, setMessengerWrapperDefaults } from './utils'
import { L2_NAMES } from './constants'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')

describe("Full story", () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  let messengerId: string

  // Factories
  let L1_Wormhole: ContractFactory
  let L2_Wormhole: ContractFactory
  let MockERC20: ContractFactory
  let L1_MessengerWrapper: ContractFactory
  let MockMessenger: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_messenger: Contract
  let l1_messengerWrapper: Contract
  let l1_wormhole: Contract
  
  // L2
  let l2_messenger: Contract
  let l2_wormhole: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]

    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    L1_Wormhole = await ethers.getContractFactory('contracts/L1_Wormhole.sol:L1_Wormhole')
    L2_Wormhole = await ethers.getContractFactory('contracts/L2_Wormhole.sol:L2_Wormhole')
    L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Arbitrum.sol:Arbitrum')
    MockMessenger = await ethers.getContractFactory('contracts/test/MockMessenger.sol:MockMessenger')
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

  it('Should send tokens across the wormhole with Arbitrum', async () => {
    // liquidityProvider moves funds across the wormhole
    await l1_poolToken.connect(liquidityProvider).approve(l1_wormhole.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l1_wormhole.connect(liquidityProvider).sendToL2(messengerId, await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_wormhole, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
  })

  const expectBalanceOf = async (token: Contract, account: Signer | Contract, expectedBalance: BigNumberish) => {
    const accountAddress = account instanceof Signer ? await account.getAddress() : account.address
    const balance = await token.balanceOf(accountAddress)
    expect(balance.toString()).to.eq(BigNumber.from(expectedBalance).toString())
  }
})
