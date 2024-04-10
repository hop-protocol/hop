import { Base, BaseConfig } from '#common/index.js'
import { Contract, Signer, ethers, providers, BigNumberish } from 'ethers'
import { StakingRegistry__factory } from '#contracts/factories/StakingRegistry__factory.js'

interface MinHopStakeForRoleInput {
  chainId: BigNumberish
  role: string; // assuming 'role' should be a string that will be converted to bytes32
}

interface GetChallengesInput {
  chainId: BigNumberish
  challengeId: string; // assuming 'challengeId' is a string representing a number or a bytes-like value
}

interface GetWithdrawableEthInput {
  chainId: BigNumberish
  address: string; // Ethereum address format
}

interface RegistryStakeHopInput {
  chainId: BigNumberish
  role: string;
  staker: string; // Ethereum address format
  amount: ethers.BigNumberish; // Can be a number, string, BigNumber, etc.
}

interface RegistryUnstakeHopInput {
  chainId: BigNumberish
  role: string;
  amount: ethers.BigNumberish; // Can be a number, string, BigNumber, etc.
}

interface RegistryWithdrawInput {
  chainId: BigNumberish
  role: string;
  staker: string; // Ethereum address format
}

interface CreateChallengeInput {
  chainId: BigNumberish
  staker: string;
  role: string;
  penalty: ethers.BigNumberish;
  slashingData: string; // assuming slashingData is a bytes-like string
  challengeEth: ethers.BigNumberish; // Ether value to send with the transaction
}

interface AddToChallengeInput {
  chainId: BigNumberish
  staker: string;
  challenger: string;
  role: string;
  penalty: ethers.BigNumberish;
  slashingData: string; // assuming slashingData is a bytes-like string
  additionalEth: ethers.BigNumberish; // Additional Ether value for the challenge
}

interface AddToAppealInput {
  chainId: BigNumberish
  staker: string;
  challenger: string;
  role: string;
  penalty: ethers.BigNumberish;
  slashingData: string; // assuming slashingData is a bytes-like string
  appealEth: ethers.BigNumberish; // Ether value for the appeal
}

interface OptimisticallySettleChallengeInput {
  chainId: BigNumberish
  staker: string;
  challenger: string;
  role: string;
  penalty: ethers.BigNumberish;
  slashingData: string; // assuming slashingData is a bytes-like string
}

interface AcceptSlashInput {
  chainId: BigNumberish
  challenger: string;
  role: string;
  penalty: ethers.BigNumberish;
  slashingData: string; // assuming slashingData is a bytes-like string
  slashEth: ethers.BigNumberish; // Ether value to send with the transaction
}

interface ForceSettleChallengeInput {
  chainId: BigNumberish
  challengeId: string; // assuming 'challengeId' is a string representing a number or a bytes-like value
  challengeWon: boolean;
}

interface IsStakedInput {
  chainId: BigNumberish
  role: string;
  staker: string; // Ethereum address format
}

interface GetStakedBalanceInput {
  chainId: BigNumberish
  role: string;
  staker: string; // Ethereum address format
}

interface GetWithdrawableBalanceInput {
  chainId: BigNumberish
  role: string;
  staker: string; // Ethereum address format
}

interface GetChallengeIdInput {
  chainId: BigNumberish
  role: string;
  staker: string; // Ethereum address format
  penalty: ethers.BigNumberish;
  challenger: string; // Ethereum address format
  slashingData: string; // assuming slashingData is a bytes-like string
}

export type StakingRegistryConstructorInput = BaseConfig & {}

export class StakingRegistry extends Base {
  constructor (input: StakingRegistryConstructorInput) {
    super({
      network: input.network,
      signer: input.signer,
      contractAddresses: input.contractAddresses,
    })
  }

  connect (signer: Signer) {
    return new StakingRegistry({ network: this.network, signer, contractAddresses: this.contractAddresses })
  }

  getStakingRegistryAddress (chainId: BigNumberish): string {
    return this.getConfigAddress(chainId, 'railsHub')
  }

  getStakingRegistryContract (chainId: BigNumberish): Contract {
    const address = this.getStakingRegistryAddress(chainId)
    const provider = this.getProviderForChainId(chainId)
    const contract = StakingRegistry__factory.connect(address, provider)
    return contract
  }

  async getChallengePeriod (chainId: BigNumberish) {
    const contract = this.getStakingRegistryContract(chainId)
    return contract.challengePeriod()
  }

  async getAppealPeriod (chainId: BigNumberish) {
    const contract = this.getStakingRegistryContract(chainId)
    return contract.appealPeriod()
  }

  async getMinChallengeIncrease (chainId: BigNumberish) {
    const contract = this.getStakingRegistryContract(chainId)
    return contract.minChallengeIncrease()
  }

  async getFullAppeal (chainId: BigNumberish) {
    const contract = this.getStakingRegistryContract(chainId)
    return contract.fullAppeal()
  }

  async getMinHopStakeForRole (input: MinHopStakeForRoleInput) {
    const { chainId, role } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.minHopStakeForRole(role)
  }

  async getChallenges (input: GetChallengesInput) {
    const { chainId, challengeId } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.getChallenges(challengeId)
  }

  async getWithdrawableEth (input: GetWithdrawableEthInput) {
    const { chainId, address } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.getWithdrawableEth(address)
  }

  async registryStakeHopPopulatedTx (input: RegistryStakeHopInput) {
    const { chainId, role, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    const txData = await contract.populateTransaction.stakeHop(role, staker)
    return txData
  }

  async registryUnstakeHopPopulatedTx (input: RegistryUnstakeHopInput) {
    const { chainId, role, amount } = input
    const contract = this.getStakingRegistryContract(chainId)
    const txData = await contract.populateTransaction.unstakeHop(role, amount)
    return txData
  }

  async registryWithdrawPopulatedTx (input: RegistryWithdrawInput) {
    const { chainId, role, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
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
    const { chainId, staker, role, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.createChallenge(staker, role, penalty, slashingData, { value: input.challengeEth })
  }

  async addToChallenge (input: AddToChallengeInput) {
    const { chainId, staker, challenger, role, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.addToChallenge(staker, challenger, role, penalty, slashingData, { value: input.additionalEth })
  }

  async addToAppeal (input: AddToAppealInput) {
    const { chainId, staker, challenger, role, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.addToAppeal(staker, challenger, role, penalty, slashingData, { value: input.appealEth })
  }

  async optimisticallySettleChallenge (input: OptimisticallySettleChallengeInput) {
    const { chainId, staker, challenger, role, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.optimisticallySettleChallenge(staker, challenger, role, penalty, slashingData)
  }

  async acceptSlash (input: AcceptSlashInput) {
    const { chainId, challenger, role, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.acceptSlash(challenger, role, penalty, slashingData, { value: input.slashEth })
  }

  async forceSettleChallenge (input: ForceSettleChallengeInput) {
    const { chainId, challengeId, challengeWon } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.forceSettleChallenge(challengeId, challengeWon)
  }

  async isStaked (input: IsStakedInput) {
    const { chainId, role, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.isStaked(role, staker)
  }

  async getStakedBalance (input: GetStakedBalanceInput) {
    const { chainId, role, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.getStakedBalance(role, staker)
  }

  async getWithdrawableStakeBalance (input: GetWithdrawableBalanceInput) {
    const { chainId, role, staker } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.getWithdrawableBalance(role, staker)
  }

  // Helper function to calculate challengeId which would typically be calculated off-chain
  async getChallengeId (input: GetChallengeIdInput) {
    const { chainId, role, staker, penalty, challenger, slashingData } = input
    const contract = this.getStakingRegistryContract(chainId)
    return contract.getChallengeId(role, staker, penalty, challenger, slashingData)
  }

  // Helper function to encode role name into bytes32
  // This would typically not be part of the contract, but is included for completeness
  async getRoleForRoleName (roleName: string) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(roleName))
  }
}
