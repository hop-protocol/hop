import '@nomiclabs/hardhat-waffle'
// import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber, ContractFactory, Signer, Contract } from 'ethers'

// import { setMessengerWrapperDefaults, expectBalanceOf } from './utils'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')

// const MAINNET_CHAIN_ID = BigNumber.from('1')
const OPTIMISM_CHAIN_ID = BigNumber.from('420')

const MOCK_ADDRESS = '0x0000000000000000000000000000000000001234'

describe("L1_Bridge", () => {
  let accounts: Signer[]
  let user: Signer
  let liquidityProvider: Signer
  let committee: Signer
  let challenger: Signer

  // Factories
  let L1_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let L1_MessengerWrapper: ContractFactory
  let CrossDomainMessenger: ContractFactory

  // L1
  let l1_poolToken: Contract
  let l1_bridge: Contract
  let l1_messengerWrapper: Contract
  let l1_messenger: Contract

  before(async () => {
    accounts = await ethers.getSigners()
    user = accounts[0]
    liquidityProvider = accounts[1]
    committee = accounts[3]
    challenger = accounts[4]

    L1_MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/Optimism.sol:Optimism')
    L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
    MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
    CrossDomainMessenger = await ethers.getContractFactory('contracts/test/mockOVM_CrossDomainMessenger.sol:mockOVM_CrossDomainMessenger')
  })

  beforeEach(async () => {
    // Deploy  L1 contracts
    l1_poolToken = await MockERC20.deploy('Dai Stable Token', 'DAI')
    l1_messenger = await CrossDomainMessenger.deploy(0)
    l1_bridge = await L1_Bridge.deploy(l1_poolToken.address, await committee.getAddress())
    l1_messengerWrapper = await L1_MessengerWrapper.deploy()

    // Set up Cross Domain Messengers
    await l1_messenger.setTargetMessengerAddress(MOCK_ADDRESS)

    // Set up liquidity bridge
    await l1_bridge.setL1MessengerWrapper(OPTIMISM_CHAIN_ID, l1_messengerWrapper.address)

    // Distribute poolToken
    await l1_poolToken.mint(await user.getAddress(), USER_INITIAL_BALANCE)
    await l1_poolToken.mint(await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_poolToken.mint(await committee.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_poolToken.mint(await challenger.getAddress(), BigNumber.from('10'))
  })

  it('Should allow committee to deposit bond and then withdraw bond', async () => {
    await l1_poolToken.connect(committee).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_bridge.connect(committee).stake(LIQUIDITY_PROVIDER_INITIAL_BALANCE)

    await l1_bridge.connect(committee).startUnstake(LIQUIDITY_PROVIDER_INITIAL_BALANCE)

    const unstakeStartedEvent = (await l1_bridge.queryFilter(l1_bridge.filters.UnstakeStarted()))[0]

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 100]) // 10 days
    
    await l1_bridge.connect(committee).completeUnstake(unstakeStartedEvent.args.unstakeId)
  })
})