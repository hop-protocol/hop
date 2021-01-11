import '@nomiclabs/hardhat-waffle'
import { expect } from 'chai'
import { Signer, Contract, BigNumber } from 'ethers'
import { fixture } from './shared/fixtures'
import {
  setUpL1AndL2Bridges,
  setUpL1AndL2Messengers,
  setUpL1MessengerWrapper,
  distributeCanonicalTokens,
  setUpL2UniswapMarket,
  expectBalanceOf
} from './shared/utils'
import {
  IFixture,
  ARBITRUM_CHAIN_ID,
  USER_INITIAL_BALANCE,
  LIQUIDITY_PROVIDER_INITIAL_BALANCE,
  COMMITTEE_INITIAL_BALANCE,
  CHALLENGER_INITIAL_BALANCE,
  L2_NAMES,
  DEFAULT_AMOUNT_OUT_MIN,
  DEFAULT_DEADLINE
} from './shared/constants'

describe("L1_Bridge", () => {
  let user: Signer
  let committee: Signer
  let l1_canonicalToken: Contract
  let l1_bridge: Contract
  let l2_canonicalToken: Contract
  let l2_bridge: Contract
  let l2_messenger: Contract

  let liquidityProvider: Signer
  let l2_uniswapRouter: Contract
  let l1_messenger: Contract

  let _fixture: IFixture

  beforeEach(async () => {
    _fixture = await fixture()
    user = _fixture.user
    committee = _fixture.committee
    l1_canonicalToken = _fixture.l1_canonicalToken
    l1_bridge = _fixture.l1_bridge
    l2_canonicalToken = _fixture.l2_canonicalToken
    l2_bridge = _fixture.l2_bridge
    l2_messenger = _fixture.l2_messenger

    liquidityProvider = _fixture.liquidityProvider
    l2_uniswapRouter = _fixture.l2_uniswapRouter
    l1_messenger = _fixture.l1_messenger

    const setUpL1AndL2BridgesOpts = {
      messengerWrapperChainId: ARBITRUM_CHAIN_ID
    }

    const setUpL1MessengerWrapperOpts = {
      l2Name: L2_NAMES.ARBITRUM
    }

    const distributeCanonicalTokensOpts = {
      userInitialBalance: USER_INITIAL_BALANCE,
      liquidityProviderInitialBalance: LIQUIDITY_PROVIDER_INITIAL_BALANCE,
      committeeInitialBalance: COMMITTEE_INITIAL_BALANCE,
      challengerInitialBalance: CHALLENGER_INITIAL_BALANCE
    }

    const setUpL2UniswapMarketOpts = {
      l2ChainId: ARBITRUM_CHAIN_ID,
      liquidityProviderBalance: LIQUIDITY_PROVIDER_INITIAL_BALANCE.div(2)
    }

    await setUpL1AndL2Bridges(_fixture, setUpL1AndL2BridgesOpts)
    await setUpL1AndL2Messengers(_fixture)
    await setUpL1MessengerWrapper(_fixture, setUpL1MessengerWrapperOpts)
    await distributeCanonicalTokens(_fixture, distributeCanonicalTokensOpts)
    await setUpL2UniswapMarket(_fixture, setUpL2UniswapMarketOpts)
  })

  /**
   * End to end tests
   */

  it('Should allow committee to deposit bond and then withdraw bond', async () => {
    await l1_canonicalToken.connect(committee).approve(l1_bridge.address, COMMITTEE_INITIAL_BALANCE)
    await l1_bridge.connect(committee).stake(COMMITTEE_INITIAL_BALANCE)
    await l1_bridge.connect(committee).unstake(COMMITTEE_INITIAL_BALANCE)
  })

  /**
   * Unit tests
   */

  it('Should set the collateral token address and the committee address in the constructor', async () => {
    const collateralTokenAddress = await l1_bridge.l1CanonicalToken()
    const committeeAddress = await l1_bridge.getCommittee()
    expect(collateralTokenAddress).to.eq(l1_canonicalToken.address)
    expect(committeeAddress).to.eq(await committee.getAddress())
  })

  it('Should send tokens across the bridge', async () => {
    const tokenAmount = USER_INITIAL_BALANCE
    await l1_canonicalToken.connect(user).approve(l1_bridge.address, tokenAmount)
    await l1_bridge.connect(user).sendToL2(ARBITRUM_CHAIN_ID, await user.getAddress(), tokenAmount)
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_bridge, user, tokenAmount)
  })

  it.only('Should send tokens across the bridge and attempt to swap', async () => {
    const tokenAmount = USER_INITIAL_BALANCE
    await l1_canonicalToken.connect(user).approve(l1_bridge.address, tokenAmount)
    await l1_bridge.connect(user).sendToL2AndAttemptSwap(
      ARBITRUM_CHAIN_ID,
      await user.getAddress(),
      tokenAmount,
      DEFAULT_AMOUNT_OUT_MIN,
      DEFAULT_DEADLINE
    )
    await l2_messenger.relayNextMessage()

    const amountAfterSlippage = tokenAmount.sub(1)
    await expectBalanceOf(l2_canonicalToken, user, amountAfterSlippage)
  })
})