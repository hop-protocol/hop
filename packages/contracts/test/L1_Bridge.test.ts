import '@nomiclabs/hardhat-waffle'
import { expect } from 'chai'
import { Signer, Contract, BigNumber } from 'ethers'
import { fixture } from './shared/fixtures'
import {
  setUpL1Bridge,
  setUpL2Bridge,
  setUpL1AndL2Messengers,
  distributePoolTokens,
  expectBalanceOf
} from './shared/utils'
import {
  IFixture,
  ARBITRUM_CHAIN_ID,
  MOCK_ADDRESS,
  USER_INITIAL_BALANCE,
  LIQUIDITY_PROVIDER_INITIAL_BALANCE,
  COMMITTEE_INITIAL_BALANCE,
  CHALLENGER_INITIAL_BALANCE,
  L2_NAMES,
  DEFAULT_AMOUNT_OUT_MIN,
  DEFAULT_DEADLINE
} from './shared/constants'

describe("L1_Bridge", () => {
  let liquidityProvider: Signer
  let committee: Signer
  let l1_poolToken: Contract
  let l1_bridge: Contract
  let l2_bridge: Contract
  let l2_messenger: Contract

  let _fixture: IFixture

  before(async () => {
    _fixture = await fixture()
    liquidityProvider = _fixture.liquidityProvider
    committee = _fixture.committee
    l1_poolToken = _fixture.l1_poolToken
    l1_bridge = _fixture.l1_bridge
    l2_bridge = _fixture.l2_bridge
    l2_messenger = _fixture.l2_messenger
  })

  beforeEach(async () => {
    const setUpL1BridgeOpts = {
      messengerAddress: MOCK_ADDRESS,
      messengerWrapperChainId: ARBITRUM_CHAIN_ID
    }

    const setUpL2BridgeOpts = {
      l2Name: L2_NAMES.ARBITRUM
    }

    const distributePoolTokensOpts = {
      userInitialBalance: USER_INITIAL_BALANCE,
      liquidityProviderInitialBalance: LIQUIDITY_PROVIDER_INITIAL_BALANCE,
      committeeInitialBalance: COMMITTEE_INITIAL_BALANCE,
      challengerInitialBalance: CHALLENGER_INITIAL_BALANCE
    }

    await setUpL1Bridge(_fixture, setUpL1BridgeOpts)
    await setUpL2Bridge(_fixture, setUpL2BridgeOpts)
    await setUpL1AndL2Messengers(_fixture)
    await distributePoolTokens(_fixture, distributePoolTokensOpts)
  })

  /**
   * End to end tests
   */

  it('Should allow committee to deposit bond and then withdraw bond', async () => {
    await l1_poolToken.connect(committee).approve(l1_bridge.address, COMMITTEE_INITIAL_BALANCE)
    await l1_bridge.connect(committee).stake(COMMITTEE_INITIAL_BALANCE)
    await l1_bridge.connect(committee).unstake(COMMITTEE_INITIAL_BALANCE)
  })

  /**
   * Unit tests
   */

  it('Should set the collateral token address and the committee address in the constructor', async () => {
    const collateralTokenAddress = await l1_bridge.getCollateralToken()
    const committeeAddress = await l1_bridge.getCommittee()
    expect(collateralTokenAddress).to.eq(l1_poolToken.address)
    expect(committeeAddress).to.eq(await committee.getAddress())
  })

  it('Should send tokens across the bridge', async () => {
    const liquidityProviderBalance: BigNumber = LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2)

    await l1_poolToken.connect(liquidityProvider).approve(l1_bridge.address, liquidityProviderBalance)
    await l1_bridge.connect(liquidityProvider).sendToL2(ARBITRUM_CHAIN_ID, await liquidityProvider.getAddress(), liquidityProviderBalance)
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_bridge, liquidityProvider, liquidityProviderBalance)
  })

  it('Should send tokens across the bridge and attempt to swap', async () => {
    const liquidityProviderBalance: BigNumber = LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2)

    await l1_poolToken.connect(liquidityProvider).approve(l1_bridge.address, liquidityProviderBalance)
    await l1_bridge.connect(liquidityProvider).sendToL2AndAttemptSwap(
      ARBITRUM_CHAIN_ID,
      await liquidityProvider.getAddress(),
      liquidityProviderBalance,
      DEFAULT_AMOUNT_OUT_MIN,
      DEFAULT_DEADLINE
    )

    let t = await l2_bridge.balanceOf(l2_bridge.address)
    console.log('t', t)
    await l2_messenger.relayNextMessage()
    t = await l2_bridge.balanceOf(l2_bridge.address)
    console.log('t', t)
    
    // await expectBalanceOf(l2_bridge, liquidityProvider, liquidityProviderBalance)
  })
})