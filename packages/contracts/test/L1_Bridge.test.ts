import '@nomiclabs/hardhat-waffle'
import { expect } from 'chai'
import { Signer, Contract, BigNumber } from 'ethers'
import { fixture } from './shared/fixtures'
import {
  setUpDefaults,
  getChainIdFromName,
  expectBalanceOf
} from './shared/utils'
import {
  L2_NAMES,
  IFixture,
  USER_INITIAL_BALANCE,
  COMMITTEE_INITIAL_BALANCE,
  DEFAULT_AMOUNT_OUT_MIN,
  DEFAULT_DEADLINE
} from './shared/constants'

describe("L1_Bridge", () => {
  let _fixture: IFixture
  let l2ChainId: BigNumber

  let user: Signer
  let committee: Signer
  let l1_canonicalToken: Contract
  let l1_bridge: Contract
  let l2_canonicalToken: Contract
  let l2_bridge: Contract
  let l2_messenger: Contract

  beforeEach(async () => {
    const l2Name = L2_NAMES.OPTIMISM
    _fixture = await fixture(l2Name)
    l2ChainId = getChainIdFromName(l2Name)
    await setUpDefaults(_fixture, l2Name)

    ;({ 
      user,
      committee,
      l1_canonicalToken,
      l1_bridge,
      l2_canonicalToken,
      l2_bridge,
      l2_messenger
    } = _fixture);
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
    await l1_bridge.connect(user).sendToL2(l2ChainId.toString(), await user.getAddress(), tokenAmount)
    await l2_messenger.relayNextMessage()
    await expectBalanceOf(l2_bridge, user, tokenAmount)
  })

  it('Should send tokens across the bridge and swap', async () => {
    const tokenAmount = USER_INITIAL_BALANCE
    await l1_canonicalToken.connect(user).approve(l1_bridge.address, tokenAmount)
    await l1_bridge.connect(user).sendToL2AndAttemptSwap(
      l2ChainId.toString(),
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