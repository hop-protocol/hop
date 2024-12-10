import { Base, BaseConfig } from '#common/index.js'
import { Contract, ethers, BigNumberish } from 'ethers'
import { StakingRegistry__factory } from '#contracts/factories/StakingRegistry__factory.js'

export type MinHopStakeInput = {
  chainId: BigNumberish
}

export type GetChallengesInput = {
  chainId: BigNumberish
  challengeId: string
}

export type RegistryStakeHopInput = {
  chainId: BigNumberish
  staker: string
  amount: BigNumberish
}

export type RegistryUnstakeHopInput = {
  chainId: BigNumberish
  amount: ethers.BigNumberish
}

export type RegistryWithdrawInput = {
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

export type StakingRegistryConstructorInput = BaseConfig

export class StakingRegistry extends Base {
  constructor ({ contractAddresses, signersOrProviders }: StakingRegistryConstructorInput) {
    super({
      contractAddresses,
      signersOrProviders
    })
  }

  getStakingRegistryAddress (chainId: BigNumberish): string {
    return this.getConfigAddress(chainId, 'railsGateway')
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

  async registryStakeHopPopulatedTx (input: RegistryStakeHopInput) {
    const { chainId, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    const txData = await contract.populateTransaction.stakeHop(staker)
    return txData
  }

  async registryUnstakeHopPopulatedTx (input: RegistryUnstakeHopInput) {
    const { chainId, amount } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.populateTransaction.unstakeHop(amount)
  }

  async registryWithdrawPopulatedTx (input: RegistryWithdrawInput) {
    const { chainId, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.populateTransaction.withdraw(staker)
  }

  async registryStakeHop (input: RegistryStakeHopInput) {
    const populatedTx = await this.registryStakeHopPopulatedTx(input)
    return this.sendTransaction(populatedTx)
  }

  async registryUnstakeHop (input: RegistryUnstakeHopInput) {
    const populatedTx = await this.registryUnstakeHopPopulatedTx(input)
    return this.sendTransaction(populatedTx)
  }

  async registryWithdraw (input: RegistryWithdrawInput) {
    const populatedTx = await this.registryWithdrawPopulatedTx(input)
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

  async getWithdrawableStakeBalance (input: GetWithdrawableBalanceInput) {
    const { chainId, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.getWithdrawableBalance(staker)
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
}

