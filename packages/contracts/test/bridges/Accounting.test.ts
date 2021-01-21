import '@nomiclabs/hardhat-waffle'
import { expect } from 'chai'
import { Signer, Contract, BigNumber } from 'ethers'
import { fixture } from '../shared/fixtures'
import {
  setUpDefaults
} from '../shared/utils'
import {
  L2_CHAIN_IDS,
  IFixture
} from '../shared/constants'

describe("Accounting", () => {
  let _fixture: IFixture

  let committee: Signer

  let accounting: Contract

  beforeEach(async () => {
    const l2ChainId: BigNumber = L2_CHAIN_IDS.OPTIMISM_TESTNET_1
    _fixture = await fixture(l2ChainId)
    await setUpDefaults(_fixture, l2ChainId)

    ;({ 
      committee,
      accounting
    } = _fixture);
  })

  /**
   * Happy Path
   */

  it('Should get the correct committee address', async () => {
    const expectedCommitteeAddress = await accounting.getCommittee()
    const committeeAddress = await committee.getAddress()
    expect(committeeAddress).to.eq(expectedCommitteeAddress)
  })

  it('Should get the correct credit', async () => {
    const expectedCredit = BigNumber.from(0)
    const credit = await accounting.getCredit()
    expect(credit).to.eq(expectedCredit)
  })

  it('Should get the correct debit', async () => {
    const expectedDebit = BigNumber.from(0)
    const debit = await accounting.getDebit()
    expect(debit).to.eq(expectedDebit)
  })

  it('Should stake and increase the credit', async () => {
    const stakeAmount = BigNumber.from(10)

    await accounting.stake(stakeAmount)
    let credit = await accounting.getCredit()
    let debit = await accounting.getDebit()
    expect(credit).to.eq(stakeAmount)
    expect(debit).to.eq(0)

    await accounting.stake(stakeAmount)
    credit = await accounting.getCredit()
    debit = await accounting.getDebit()
    expect(credit).to.eq(stakeAmount.mul(2))
    expect(debit).to.eq(0)
  })

  it('Should stake to increase the credit and subsequently unstake to increase the debit', async () => {
    const stakeAmount = BigNumber.from(10)

    await accounting.stake(stakeAmount)
    let credit = await accounting.getCredit()
    let debit = await accounting.getDebit()
    expect(credit).to.eq(stakeAmount)
    expect(debit).to.eq(0)

    await accounting.connect(committee).unstake(stakeAmount)
    credit = await accounting.getCredit()
    debit = await accounting.getDebit()
    expect(credit).to.eq(stakeAmount)
    expect(debit).to.eq(stakeAmount)

    await accounting.stake(stakeAmount.mul(2))
    credit = await accounting.getCredit()
    debit = await accounting.getDebit()
    expect(credit).to.eq(stakeAmount.mul(3))
    expect(debit).to.eq(stakeAmount)

    await accounting.connect(committee).unstake(stakeAmount)
    credit = await accounting.getCredit()
    debit = await accounting.getDebit()
    expect(credit).to.eq(stakeAmount.mul(3))
    expect(debit).to.eq(stakeAmount.mul(2))
  })

  /**
   * Non-Happy Path
   */

  it('Should not allow a higher debit than credit', async () => {
    const expectedError = 'ACT: Not enough available credit'
    const stakeAmount = BigNumber.from(10)

    await expect(
      accounting.connect(committee).unstake(stakeAmount)
    ).to.be.revertedWith(expectedError)
  })

  it('Should not allow someone outside of the committee to unstake', async () => {
    const expectedError = 'ACT: Caller is not committee'
    const stakeAmount = BigNumber.from(10)

    await accounting.stake(stakeAmount)
    await expect(
      accounting.unstake(stakeAmount)
    ).to.be.revertedWith(expectedError)
  })
})