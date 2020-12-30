import '@nomiclabs/hardhat-waffle'
import { BigNumber, Signer, Contract } from 'ethers'
import { fixture } from './shared/fixtures'
import { setUpL1Bridge } from './shared/utils'

const USER_INITIAL_BALANCE = BigNumber.from('100')
const LIQUIDITY_PROVIDER_INITIAL_BALANCE = BigNumber.from('1000000')
const CHALLENGER_INITIAL_BALANCE = BigNumber.from('10')

const OPTIMISM_CHAIN_ID = BigNumber.from('420')
const MOCK_ADDRESS = '0x0000000000000000000000000000000000001234'

describe("L1_Bridge", () => {
  let committee: Signer
  let l1_poolToken: Contract
  let l1_bridge: Contract
  let _fixture: any

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
      challengerInitialBalance: CHALLENGER_INITIAL_BALANCE
    }
    await setUpL1Bridge(_fixture, l1BridgeOpts)
  })

  it('Should allow committee to deposit bond and then withdraw bond', async () => {
    await l1_poolToken.connect(committee).approve(l1_bridge.address, LIQUIDITY_PROVIDER_INITIAL_BALANCE)
    await l1_bridge.connect(committee).stake(LIQUIDITY_PROVIDER_INITIAL_BALANCE)

    await l1_bridge.connect(committee).unstake(LIQUIDITY_PROVIDER_INITIAL_BALANCE)
  })
})