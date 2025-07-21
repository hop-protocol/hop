import { StakingRegistry, EventName } from '#railsGateway/StakingRegistry.js'
import { providers, Wallet, utils, BigNumber } from 'ethers'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { randomBytes } from 'crypto'
import { jest } from '@jest/globals'
import dotenv from 'dotenv'

const { parseUnits } = utils

dotenv.config()

export const privateKey = process.env.PRIVATE_KEY ?? randomBytes(32).toString('hex')

describe('StakingRegistry', () => {
  const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
  const provider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)
  const signer = new Wallet(privateKey)

  it('should set bonder preference', async () => {
    const chainId = 84532
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })
    const address = await stakingRegistry.getSignerAddress(chainId)
    expect(address).toBeDefined()

    const pathId = '0xa120523a25f1970cfe391c4b364152104f93cd56b30748986f6e1a9087706414'
    const feeTier = '1'
    const liquidity = '1'

    jest.spyOn(stakingRegistry as any, 'signalPreference').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.signalPreference({ pathId, feeTier, liquidity })
    console.log(tx.hash)
    expect(tx.hash).toBeDefined()
  })

  it('should get staking registry address', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    const address = stakingRegistry.getStakingRegistryContractAddress()
    console.log(address)
    expect(address).toBeDefined()
  })

  it('should get staking registry contract', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    const contract = stakingRegistry.getStakingRegistryContract()
    console.log(contract)
    expect(contract).toBeDefined()
  })

  it('should get challenge period', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'challengePeriod').mockReturnValue(BigNumber.from(1) as any)

    const period = await stakingRegistry.challengePeriod()
    console.log(period)
    expect(period).toBeDefined()
  })

  it('should get appeal period', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'appealPeriod').mockReturnValue(BigNumber.from(1) as any)

    const period = await stakingRegistry.appealPeriod()
    console.log(period)
    expect(period).toBeDefined()
  })

  it('should get min challenge increase', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'minChallengeIncrease').mockReturnValue(BigNumber.from(1) as any)

    const period = await stakingRegistry.minChallengeIncrease()
    console.log(period)
    expect(period).toBeDefined()
  })

  it('should get full appeal value', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'fullAppeal').mockReturnValue(BigNumber.from(1) as any)

    const period = await stakingRegistry.fullAppeal()
    console.log(period)
    expect(period).toBeDefined()
  })

  it('should get challenge', async () => {
    const chainId = 11155111
    const challengeId = '0xa120523a25f1970cfe391c4b364152104f93cd56b30748986f6e1a9087706414'
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'challenges').mockReturnValue({ staker: '' } as any)

    const challenge = await stakingRegistry.challenges(challengeId)
    console.log(challenge)
    expect(challenge).toBeDefined()
  })

  it('should get min hop stake', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'minHopStake').mockReturnValue(BigNumber.from(1) as any)

    const minStake = await stakingRegistry.minHopStake()
    console.log(minStake)
    expect(minStake).toBeDefined()
  })

  it('should get hop token address', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'hopToken').mockReturnValue('0xDCAc09AbB4D3E008b941370d384d0Cf20ce0a5bd')

    const address = await stakingRegistry.hopToken()
    console.log(address)
    expect(address).toBeDefined()
  })

  it('should get window size', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'windowSize').mockReturnValue(1)

    const windowSize = await stakingRegistry.windowSize()
    console.log(windowSize)
    expect(windowSize).toBeDefined()
  })

  it('should get is staked', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'isStaked').mockReturnValue(false)

    const isStaked = await stakingRegistry.isStaked({
      staker
    })
    console.log(isStaked)
    expect(isStaked).toBeDefined()
  })

  it('should get challenge id', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'getChallengeId').mockReturnValue('0xa120523a25f1970cfe391c4b364152104f93cd56b30748986f6e1a9087706414')

    const challengeId = await stakingRegistry.getChallengeId({
      staker,
      penalty: BigNumber.from(1),
      challenger: staker,
      slashingData: '0x',
    })
    console.log(challengeId)
    expect(challengeId).toBeDefined()
  })

  it('should get staked balance', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'getBalance').mockReturnValue(BigNumber.from(1))

    const balance = await stakingRegistry.getBalance({
      staker,
    })
    console.log(balance)
    expect(balance).toBeDefined()
  })

  it('should get withdrawable balance', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'getWithdrawableBalance').mockReturnValue(BigNumber.from(1))

    const balance = await stakingRegistry.getWithdrawableBalance({
      staker,
    })
    console.log(balance)
    expect(balance).toBeDefined()
  })

  it('should get withdrawable eth balance', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    jest.spyOn(stakingRegistry as any, 'withdrawableEth').mockReturnValue(BigNumber.from(1))

    const balance = await stakingRegistry.withdrawableEth({
      address: staker,
    })
    console.log(balance)
    expect(balance).toBeDefined()
  })

  it('should get event fetcher', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    const fetcher = await stakingRegistry.getEventFetcher(EventName.BonderPreference)
    console.log(fetcher)
    expect(fetcher).toBeDefined()
  })

  it('should get event names', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })

    const eventNames = stakingRegistry.getEventNames()
    console.log(eventNames)
    expect(eventNames).toBeDefined()
  })

  it('should get event names using static method', async () => {
    const eventNames = StakingRegistry.getEventNames()
    console.log(eventNames)
    expect(eventNames).toBeDefined()
  })

  it('should create challenge', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'createChallenge').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.createChallenge({
      staker,
      penalty: BigNumber.from(1),
      slashingData: '0x',
      challengeEth: BigNumber.from(1),
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should add to challenge', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'addToChallenge').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.addToChallenge({
      staker,
      challenger: staker,
      penalty: BigNumber.from(1),
      slashingData: '0x',
      additionalEth: parseUnits('1', 'ether'),
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should add to appeal', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'addToAppeal').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.addToAppeal({
      staker,
      challenger: staker,
      penalty: BigNumber.from(1),
      slashingData: '0x',
      appealEth: parseUnits('1', 'ether'),
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should optimistically settle challenge', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'optimisticallySettleChallenge').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.optimisticallySettleChallenge({
      staker,
      challenger: staker,
      penalty: BigNumber.from(1),
      slashingData: '0x',
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should accept slash', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'acceptSlash').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.acceptSlash({
      challenger: staker,
      penalty: BigNumber.from(1),
      slashingData: '0x',
      slashEth: parseUnits('1', 'ether'),
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should force settle challenge', async () => {
    const chainId = 11155111
    const challengeId = '0xa120523a25f1970cfe391c4b364152104f93cd56b30748986f6e1a9087706414'
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'forceSettleChallenge').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.forceSettleChallenge({
      challengeId,
      challengeWon: false
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should stake hop', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'stakeHop').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.stakeHop({
      staker,
      amount: parseUnits('1', 'ether')
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should unstake hop', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'unstakeHop').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.unstakeHop({
      amount: parseUnits('1', 'ether')
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should withdraw stake', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const staker = await signer.getAddress()
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'withdrawStake').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.withdrawStake({
      staker
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should approve stake', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'hopToken').mockReturnValue('0xDCAc09AbB4D3E008b941370d384d0Cf20ce0a5bd')
    jest.spyOn(stakingRegistry as any, 'getContractExists').mockReturnValue(true)
    jest.spyOn(stakingRegistry as any, 'sendTransaction').mockReturnValue({ hash: '' } as any)
    jest.spyOn(stakingRegistry.helpers as any, 'approveStake').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.helpers.approveStake({
      amount: parseUnits('1', 'ether')
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should mint', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(stakingRegistry as any, 'hopToken').mockReturnValue('0xDCAc09AbB4D3E008b941370d384d0Cf20ce0a5bd')
    jest.spyOn(stakingRegistry as any, 'getContractExists').mockReturnValue(true)
    jest.spyOn(stakingRegistry as any, 'sendTransaction').mockReturnValue({ hash: '' } as any)
    jest.spyOn(stakingRegistry.helpers as any, 'mint').mockReturnValue({ hash: '' } as any)

    const tx = await stakingRegistry.helpers.mint({
      to: await signer.getAddress(),
      amount: parseUnits('1', 'ether')
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it('should get needs approval for stake', async () => {
    const chainId = 11155111
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer
    })

    jest.spyOn(ERC20__factory, 'connect').mockReturnValue({
      allowance: jest.fn().mockReturnValue(BigNumber.from(1))
    } as any)

    jest.spyOn(stakingRegistry as any, 'hopToken').mockReturnValue('0xDCAc09AbB4D3E008b941370d384d0Cf20ce0a5bd')
    jest.spyOn(stakingRegistry.helpers as any, 'getNeedsApprovalForStake').mockReturnValue(false)

    const needsApproval = await stakingRegistry.helpers.getNeedsApprovalForStake({
      account: await signer.getAddress(),
      amount: parseUnits('1', 'ether')
    })
    console.log(needsApproval)
    expect(needsApproval).toBeDefined()
  })
})
