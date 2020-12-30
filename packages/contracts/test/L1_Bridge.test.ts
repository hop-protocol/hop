import '@nomiclabs/hardhat-waffle'
import { expect } from 'chai'
import { Signer, Contract } from 'ethers'
import { fixture } from './shared/fixtures'
import { setUpL1Bridge, expectBalanceOf } from './shared/utils'
import {
  IFixture,
  OPTIMISM_CHAIN_ID,
  MOCK_ADDRESS,
  USER_INITIAL_BALANCE,
  LIQUIDITY_PROVIDER_INITIAL_BALANCE,
  COMMITTEE_INITIAL_BALANCE,
  CHALLENGER_INITIAL_BALANCE,
} from './shared/constants'

describe("L1_Bridge", () => {
  let committee: Signer
  let l1_poolToken: Contract
  let l1_bridge: Contract
  let _fixture: IFixture

  before(async () => {
    _fixture = await fixture()
    committee = _fixture.committee
    l1_poolToken = _fixture.l1_poolToken
    l1_bridge = _fixture.l1_bridge
  })

  beforeEach(async () => {
    const l1BridgeOpts = {
      messengerAddress: MOCK_ADDRESS,
      messengerWrapperChainId: OPTIMISM_CHAIN_ID,
      userInitialBalance: USER_INITIAL_BALANCE,
      liquidityProviderInitialBalance: LIQUIDITY_PROVIDER_INITIAL_BALANCE,
      committeeInitialBalance: COMMITTEE_INITIAL_BALANCE,
      challengerInitialBalance: CHALLENGER_INITIAL_BALANCE
    }
    await setUpL1Bridge(_fixture, l1BridgeOpts)
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
    // await l1_poolToken.connect(liquidityProvider).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    // await l1_bridge.connect(liquidityProvider).sendToL2(ARBITRUM_CHAIN_ID, await liquidityProvider.getAddress(), LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
    // await l2_messenger.relayNextMessage()
    // await expectBalanceOf(l2_bridge, liquidityProvider, LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2))
  })
})