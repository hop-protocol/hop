import { Base } from '#common/index.js'
import { Contract, Signer, ethers, providers } from 'ethers'
import { StakingRegistry__factory } from '#contracts/factories/StakingRegistry__factory.js'

interface StakingRegistryConstructorInput {
  network: string
  provider?: providers.Provider
  signer?: Signer
  address?: string
}

interface MinHopStakeForRoleInput {
  role: string; // assuming 'role' should be a string that will be converted to bytes32
}

interface GetChallengesInput {
  challengeId: string; // assuming 'challengeId' is a string representing a number or a bytes-like value
}

interface GetWithdrawableEthInput {
  address: string; // Ethereum address format
}

interface RegistryStakeHopInput {
  role: string;
  staker: string; // Ethereum address format
  amount: ethers.BigNumberish; // Can be a number, string, BigNumber, etc.
}

interface RegistryUnstakeHopInput {
  role: string;
  amount: ethers.BigNumberish; // Can be a number, string, BigNumber, etc.
}

interface RegistryWithdrawInput {
  role: string;
  staker: string; // Ethereum address format
}

interface CreateChallengeInput {
  staker: string;
  role: string;
  penalty: ethers.BigNumberish;
  slashingData: string; // assuming slashingData is a bytes-like string
  challengeEth: ethers.BigNumberish; // Ether value to send with the transaction
}

interface AddToChallengeInput {
  staker: string;
  challenger: string;
  role: string;
  penalty: ethers.BigNumberish;
  slashingData: string; // assuming slashingData is a bytes-like string
  additionalEth: ethers.BigNumberish; // Additional Ether value for the challenge
}

interface AddToAppealInput {
  staker: string;
  challenger: string;
  role: string;
  penalty: ethers.BigNumberish;
  slashingData: string; // assuming slashingData is a bytes-like string
  appealEth: ethers.BigNumberish; // Ether value for the appeal
}

interface OptimisticallySettleChallengeInput {
  staker: string;
  challenger: string;
  role: string;
  penalty: ethers.BigNumberish;
  slashingData: string; // assuming slashingData is a bytes-like string
}

interface AcceptSlashInput {
  challenger: string;
  role: string;
  penalty: ethers.BigNumberish;
  slashingData: string; // assuming slashingData is a bytes-like string
  slashEth: ethers.BigNumberish; // Ether value to send with the transaction
}

interface ForceSettleChallengeInput {
  challengeId: string; // assuming 'challengeId' is a string representing a number or a bytes-like value
  challengeWon: boolean;
}

interface IsStakedInput {
  role: string;
  staker: string; // Ethereum address format
}

interface GetStakedBalanceInput {
  role: string;
  staker: string; // Ethereum address format
}

interface GetWithdrawableBalanceInput {
  role: string;
  staker: string; // Ethereum address format
}

interface GetChallengeIdInput {
  role: string;
  staker: string; // Ethereum address format
  penalty: ethers.BigNumberish;
  challenger: string; // Ethereum address format
  slashingData: string; // assuming slashingData is a bytes-like string
}

export class StakingRegistry extends Base {
  provider: providers.Provider
  address: string

  constructor (input: StakingRegistryConstructorInput) {
    super({
      network: input.network
    })
    const { provider, signer, address } = input
    this.provider = provider as any
    this.signer = signer as any
    if (!this.provider && this.signer) {
      this.provider = this.signer.provider as any
    }
    this.address = address as any
  }

  connect (signer: Signer) {
    return new StakingRegistry({ network: this.network, provider: this.provider, signer, address: this.address })
  }

  getStakingRegistryContract (): Contract {
    if (!this.address) {
      throw new Error('StakingRegistry address not set')
    }
    const contract = StakingRegistry__factory.connect(this.address, this.signer || this.provider)
    return contract
  }

  async getChallengePeriod () {
    const contract = this.getStakingRegistryContract()
    return contract.challengePeriod()
  }

  async getAppealPeriod () {
    const contract = this.getStakingRegistryContract()
    return contract.appealPeriod()
  }

  async getMinChallengeIncrease () {
    const contract = this.getStakingRegistryContract()
    return contract.minChallengeIncrease()
  }

  async getFullAppeal () {
    const contract = this.getStakingRegistryContract()
    return contract.fullAppeal()
  }

  async getMinHopStakeForRole (input: MinHopStakeForRoleInput) {
    const { role } = input
    const contract = this.getStakingRegistryContract()
    return contract.minHopStakeForRole(role)
  }

  async getChallenges (input: GetChallengesInput) {
    const { challengeId } = input
    const contract = this.getStakingRegistryContract()
    return contract.getChallenges(challengeId)
  }

  async getWithdrawableEth (input: GetWithdrawableEthInput) {
    const { address } = input
    const contract = this.getStakingRegistryContract()
    return contract.getWithdrawableEth(address)
  }

  async registryStakeHopPopulatedTx (input: RegistryStakeHopInput) {
    const { role, staker } = input
    const contract = this.getStakingRegistryContract()
    const txData = await contract.populateTransaction.stakeHop(role, staker)
    return txData
  }

  async registryUnstakeHopPopulatedTx (input: RegistryUnstakeHopInput) {
    const { role, amount } = input
    const contract = this.getStakingRegistryContract()
    const txData = await contract.populateTransaction.unstakeHop(role, amount)
    return txData
  }

  async registryWithdrawPopulatedTx (input: RegistryWithdrawInput) {
    const { role, staker } = input
    const contract = this.getStakingRegistryContract()
    const txData = await contract.populateTransaction.withdraw(role, staker)
    return txData
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

  async createChallenge (input: CreateChallengeInput) {
    const { staker, role, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract()
    return contract.createChallenge(staker, role, penalty, slashingData, { value: input.challengeEth })
  }

  async addToChallenge (input: AddToChallengeInput) {
    const { staker, challenger, role, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract()
    return contract.addToChallenge(staker, challenger, role, penalty, slashingData, { value: input.additionalEth })
  }

  async addToAppeal (input: AddToAppealInput) {
    const { staker, challenger, role, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract()
    return contract.addToAppeal(staker, challenger, role, penalty, slashingData, { value: input.appealEth })
  }

  async optimisticallySettleChallenge (input: OptimisticallySettleChallengeInput) {
    const { staker, challenger, role, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract()
    return contract.optimisticallySettleChallenge(staker, challenger, role, penalty, slashingData)
  }

  async acceptSlash (input: AcceptSlashInput) {
    const { challenger, role, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract()
    return contract.acceptSlash(challenger, role, penalty, slashingData, { value: input.slashEth })
  }

  async forceSettleChallenge (input: ForceSettleChallengeInput) {
    const { challengeId, challengeWon } = input
    const contract = this.getStakingRegistryContract()
    return contract.forceSettleChallenge(challengeId, challengeWon)
  }

  async isStaked (input: IsStakedInput) {
    const { role, staker } = input
    const contract = this.getStakingRegistryContract()
    return contract.isStaked(role, staker)
  }

  async getStakedBalance (input: GetStakedBalanceInput) {
    const { role, staker } = input
    const contract = this.getStakingRegistryContract()
    return contract.getStakedBalance(role, staker)
  }

  async getWithdrawableStakeBalance (input: GetWithdrawableBalanceInput) {
    const { role, staker } = input
    const contract = this.getStakingRegistryContract()
    return contract.getWithdrawableBalance(role, staker)
  }

  // Helper function to encode role name into bytes32
  // This would typically not be part of the contract, but is included for completeness
  async getRoleForRoleName (roleName: string) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(roleName))
  }

  // Helper function to calculate challengeId which would typically be calculated off-chain
  async getChallengeId (input: GetChallengeIdInput) {
    const { role, staker, penalty, challenger, slashingData } = input
    const contract = this.getStakingRegistryContract()
    return contract.getChallengeId(role, staker, penalty, challenger, slashingData)
  }
}
