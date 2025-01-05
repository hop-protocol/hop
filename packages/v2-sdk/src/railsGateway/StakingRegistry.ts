import { Base, BaseConfig, TxOverrides } from '#common/index.js'
import { Contract, ethers, BigNumberish, providers } from 'ethers'
import { StakingRegistry__factory } from '#contracts/factories/StakingRegistry__factory.js'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { ConfigError, InputError, InsufficientBalanceError, InsufficientApprovalError } from '#error/index.js'

export type MinHopStakeInput = {
  chainId: BigNumberish
}

export type GetChallengesInput = {
  chainId: BigNumberish
  challengeId: string
}

export type StakeHopInput = {
  chainId: BigNumberish
  staker: string
  amount: BigNumberish
}

export type UnstakeHopInput = {
  chainId: BigNumberish
  amount: ethers.BigNumberish
}

export type WithdrawStakeInput = {
  chainId: BigNumberish
  staker: string
}

export type CreateChallengeInput = {
  chainId: BigNumberish
  staker: string
  penalty: BigNumberish
  slashingData: string
  challengeEth: BigNumberish // Ether value to send with the transaction
}

export type AddToChallengeInput = {
  chainId: BigNumberish
  staker: string
  challenger: string
  penalty: BigNumberish
  slashingData: string
  additionalEth: BigNumberish // Additional Ether value for the challenge
}

export type AddToAppealInput = {
  chainId: BigNumberish
  staker: string
  challenger: string
  penalty: BigNumberish
  slashingData: string
  appealEth: BigNumberish // Ether value for the appeal
}

export type OptimisticallySettleChallengeInput = {
  chainId: BigNumberish
  staker: string
  challenger: string
  penalty: ethers.BigNumberish
  slashingData: string // assuming slashingData is a bytes-like string
}

export type AcceptSlashInput = {
  chainId: BigNumberish
  challenger: string
  penalty: BigNumberish
  slashingData: string
  slashEth: BigNumberish
}

export type ForceSettleChallengeInput = {
  chainId: BigNumberish
  challengeId: string
  challengeWon: boolean
}

export type IsStakedInput = {
  chainId: BigNumberish
  staker: string
}

export type GetStakedBalanceInput = {
  chainId: BigNumberish
  staker: string
}

export type GetWithdrawableBalanceInput = {
  chainId: BigNumberish
  staker: string
}

export type WithdrawableEthInput = {
  chainId: BigNumberish
  address: string
}

export type GetChallengeIdInput = {
  chainId: BigNumberish
  staker: string
  penalty: BigNumberish
  challenger: string
  slashingData: string
}

export type SignalPreferenceInput = {
  chainId: BigNumberish
  pathId: string
  feeTier: BigNumberish
  liquidity: BigNumberish
}

export type HopTokenInput = {
  chainId: BigNumberish
}

export type StakingRegistryConstructorInput = BaseConfig

export class StakingRegistry extends Base {
  constructor ({ contractAddresses, signersOrProviders, network }: StakingRegistryConstructorInput) {
    super({
      network,
      contractAddresses,
      signersOrProviders
    })
  }

  getStakingRegistryAddress (chainId: BigNumberish): string {
    return this.getConfigAddress(chainId, 'stakingRegistry')
  }

  getStakingRegistryContract (chainId: BigNumberish): Contract {
    const address = this.getStakingRegistryAddress(chainId)
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId?.toString()}`)
    }
    return StakingRegistry__factory.connect(address, provider)
  }

  async challengePeriod (chainId: BigNumberish) {
    const contract = this.getStakingRegistryContract(chainId)
    return contract.challengePeriod()
  }

  async appealPeriod (chainId: BigNumberish) {
    const contract = this.getStakingRegistryContract(chainId)
    return contract.appealPeriod()
  }

  async minChallengeIncrease (chainId: BigNumberish) {
    const contract = this.getStakingRegistryContract(chainId)
    return contract.minChallengeIncrease()
  }

  async fullAppeal (chainId: BigNumberish) {
    const contract = this.getStakingRegistryContract(chainId)
    return contract.fullAppeal()
  }

  async challenges (chainId: BigNumberish, challengeId: string) {
    const contract = this.getStakingRegistryContract(chainId)
    return contract.challenges(challengeId)
  }

  async minHopStake (input: MinHopStakeInput) {
    const { chainId } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.minHopStake()
  }

  async stakeHopPopulatedTx (input: StakeHopInput) {
    const { chainId, staker, amount } = input
    const contract = this.getStakingRegistryContract(chainId)
    const txData = await contract.populateTransaction.stakeHop(staker, amount)
    return {
      ...txData,
      chainId: Number(chainId)
    }
  }

  async unstakeHopPopulatedTx (input: UnstakeHopInput) {
    const { chainId, amount } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.populateTransaction.unstakeHop(amount)
  }

  async withdrawStakePopulatedTx (input: WithdrawStakeInput) {
    const { chainId, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.populateTransaction.withdraw(staker)
  }

  async stakeHop (input: StakeHopInput) {
    const populatedTx = await this.stakeHopPopulatedTx(input)
    return this.sendTransaction(populatedTx)
  }

  async unstakeHop (input: UnstakeHopInput) {
    const populatedTx = await this.unstakeHopPopulatedTx(input)
    return this.sendTransaction(populatedTx)
  }

  async withdrawStake (input: WithdrawStakeInput) {
    const populatedTx = await this.withdrawStakePopulatedTx(input)
    return this.sendTransaction(populatedTx)
  }

  async signalPreferencePopulatedTx (input: SignalPreferenceInput) {
    const { chainId, pathId, feeTier, liquidity } = input
    const contract = this.getStakingRegistryContract(chainId)
    const txData = await contract.populateTransaction.signalPreference(pathId, feeTier, liquidity)
    return txData
  }

  async createChallenge (input: CreateChallengeInput) {
    const { chainId, staker, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.createChallenge(staker, penalty, slashingData, { value: input.challengeEth })
  }

  async addToChallenge (input: AddToChallengeInput) {
    const { chainId, staker, challenger, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.addToChallenge(staker, challenger, penalty, slashingData, { value: input.additionalEth })
  }

  async addToAppeal (input: AddToAppealInput) {
    const { chainId, staker, challenger, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.addToAppeal(staker, challenger, slashingData, { value: input.appealEth })
  }

  async optimisticallySettleChallenge (input: OptimisticallySettleChallengeInput) {
    const { chainId, staker, challenger, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.optimisticallySettleChallenge(staker, challenger, penalty, slashingData)
  }

  async acceptSlash (input: AcceptSlashInput) {
    const { chainId, challenger, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.acceptSlash(challenger, penalty, slashingData, { value: input.slashEth })
  }

  async forceSettleChallenge (input: ForceSettleChallengeInput) {
    const { chainId, challengeId, challengeWon } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.forceSettleChallenge(challengeId, challengeWon)
  }

  async isStaked (input: IsStakedInput) {
    const { chainId, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.isStaked(staker)
  }

  async getStakedBalance (input: GetStakedBalanceInput) {
    const { chainId, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.getStakedBalance(staker)
  }

  async getWithdrawableBalance (input: GetWithdrawableBalanceInput) {
    const { chainId, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.getWithdrawableBalance(staker)
  }

  async withdrawableEth (input: WithdrawableEthInput) {
    const { chainId, address } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.withdrawableEth(address)
  }

  async hopToken (input: HopTokenInput) {
    const { chainId } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.hopToken()
  }

  // Helper function to calculate challengeId which would typically be calculated off-chain
  async getChallengeId (input: GetChallengeIdInput) {
    const { chainId, staker, penalty, challenger, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.getChallengeId(staker, penalty, challenger, slashingData)
  }

  async signalPreference (input: SignalPreferenceInput) {
    const populatedTx = await this.signalPreferencePopulatedTx(input)
    return this.sendTransaction(populatedTx)
  }

  async getNeedsApprovalForStake ({ chainId, amount, account }: any): Promise<boolean> {
    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId?.toString()}`)
    }
    const tokenAddress = await this.hopToken({ chainId })
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const spender = this.getStakingRegistryAddress(chainId)
    account ??= (await this.getSignerAddress(chainId))!
    if (!account) {
      throw new InputError('signer not set')
    }
    const approved = await tokenContract.allowance(account, spender)
    return approved.lt(amount)
  }

  async approveStake (input: any, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.approveStakePopulatedTx(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async approveStakePopulatedTx ({ chainId, amount }: any, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> {
    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId?.toString()}`)
    }
    const tokenAddress = await this.hopToken({ chainId })
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const address = this.getStakingRegistryAddress(chainId)
    const txData = await tokenContract.populateTransaction.approve(address, amount)

    return {
      ...txData,
      ...txOverrides,
      chainId: Number(chainId)
    }
  }
}

