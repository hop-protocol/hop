import { Base, TxOverrides, SignersOrProviders } from '#common/index.js'
import { Addresses } from '#addresses/types.js'
import { Contract, ethers, Signer, BigNumber, BigNumberish, providers } from 'ethers'
import { StakingRegistry__factory } from '#contracts/factories/StakingRegistry__factory.js'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { ERC20Mintable__factory } from '#contracts/factories/ERC20Mintable__factory.js'
import { ConfigError, InputError } from '#error/index.js'
import { BonderPreferenceEventFetcher } from '#railsGateway/events/BonderPreference.js'

export type EventFetcher = BonderPreferenceEventFetcher

export enum EventName {
  BonderPreference = 'BonderPreference'
}

export type GetChallengesInput = {
  challengeId: string
}

export type StakeHopInput = {
  staker: string
  amount: BigNumberish
}

export type UnstakeHopInput = {
  amount: ethers.BigNumberish
}

export type WithdrawStakeInput = {
  staker: string
}

export type CreateChallengeInput = {
  staker: string
  penalty: BigNumberish
  slashingData: string
  challengeEth: BigNumberish // Ether value to send with the transaction
}

export type AddToChallengeInput = {
  staker: string
  challenger: string
  penalty: BigNumberish
  slashingData: string
  additionalEth: BigNumberish // Additional Ether value for the challenge
}

export type AddToAppealInput = {
  staker: string
  challenger: string
  penalty: BigNumberish
  slashingData: string
  appealEth: BigNumberish // Ether value for the appeal
}

export type OptimisticallySettleChallengeInput = {
  staker: string
  challenger: string
  penalty: ethers.BigNumberish
  slashingData: string // assuming slashingData is a bytes-like string
}

export type AcceptSlashInput = {
  challenger: string
  penalty: BigNumberish
  slashingData: string
  slashEth: BigNumberish
}

export type ForceSettleChallengeInput = {
  challengeId: string
  challengeWon: boolean
}

export type IsStakedInput = {
  staker: string
}

export type GetStakedBalanceInput = {
  staker: string
}

export type GetWithdrawableBalanceInput = {
  staker: string
}

export type WithdrawableEthInput = {
  address: string
}

export type GetChallengeIdInput = {
  staker: string
  penalty: BigNumberish
  challenger: string
  slashingData: string
}

export type SignalPreferenceInput = {
  pathId: string
  feeTier: BigNumberish
  liquidity: BigNumberish
}

export type GetNeedsApprovalForStakeInput = {
  amount: BigNumberish
  account: string
}

export type ApproveStakeInput = {
  amount: BigNumberish
}

export type MintInput = {
  to: string
  amount: BigNumberish
}

export type Challenge = {
  staker: string
  challenger: string
  lastUpdated: BigNumber
  penalty: BigNumber
  isSettled: boolean
  isAppealed: boolean
  challengeEth: BigNumber
  appealEth: BigNumber
  winner: string
}

export type GetHopBalanceInput = {
  staker: string
}

export type StakingRegistryConstructorInput = {
  network?: string
  gasPriceMultiplier?: number
  signersOrProviders?: SignersOrProviders
  contractAddresses?: Addresses
  chainId: BigNumberish
  signerOrProvider?: Signer | providers.Provider
}

export class StakingRegistry extends Base {
  chainId: BigNumberish

  constructor ({ contractAddresses, chainId, signerOrProvider, signersOrProviders, network }: StakingRegistryConstructorInput) {
    signersOrProviders ??= {}
    if (signerOrProvider) {
      signersOrProviders[chainId?.toString()] = signerOrProvider
    }
    super({
      network,
      contractAddresses,
      signersOrProviders
    })

    this.chainId = chainId
  }

  getStakingRegistryContractAddress (): string {
    const chainId = this.chainId
    return this.getConfigAddress(chainId, 'stakingRegistry')
  }

  getStakingRegistryContract (): Contract {
    const chainId = this.chainId
    const address = this.getStakingRegistryContractAddress()
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId?.toString()}`)
    }
    return StakingRegistry__factory.connect(address, provider)
  }

  get populateTransaction() {
    return {
      stakeHop: async ({ staker, amount }: StakeHopInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId
        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        const contract = this.getStakingRegistryContract()
        const txData = await contract.populateTransaction.stakeHop(staker, amount)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      unstakeHop: async ({ amount }: UnstakeHopInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId
        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        const contract = this.getStakingRegistryContract()
        const txData = await contract.populateTransaction.unstakeHop(amount)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      withdrawStake: async ({ staker }: WithdrawStakeInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId
        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        const contract = this.getStakingRegistryContract()
        const txData = await contract.populateTransaction.withdraw(staker)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      signalPreference: async ({ pathId, feeTier, liquidity }: SignalPreferenceInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId
        const contract = this.getStakingRegistryContract()
        const txData = await contract.populateTransaction.signalPreference(pathId, feeTier, liquidity)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      approveStake: async ({ amount }: ApproveStakeInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId
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

        const tokenAddress = await this.hopToken()
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const address = this.getStakingRegistryContractAddress()
        const txData = await tokenContract.populateTransaction.approve(address, amount)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      mint: async ({ to, amount }: MintInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId
        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid to "${to}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId: ${chainId?.toString()}`)
        }

        const tokenAddress = await this.hopToken()
        const tokenContract = ERC20Mintable__factory.connect(tokenAddress, provider)
        const address = this.getStakingRegistryContractAddress()
        const txData = await tokenContract.populateTransaction.mint(to, amount)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      }
    }
  }

  get helpers() {
    return {
      getNeedsApprovalForStake: async ({ amount, account }: GetNeedsApprovalForStakeInput): Promise<boolean> => {
        const chainId = this.chainId
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

        const tokenAddress = await this.hopToken()
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const spender = this.getStakingRegistryContractAddress()
        account ??= (await this.getSignerAddress(chainId))!
        if (!account) {
          throw new InputError('signer not set')
        }
        const approved = await tokenContract.allowance(account, spender)
        return approved.lt(amount)
      },

      getHopBalance: async ({ staker }: GetHopBalanceInput): Promise<BigNumber> => {
        if (!this.utils.isValidAddress(staker)) {
          throw new InputError(`Invalid staker "${staker}"`)
        }

        const provider = this.getProvider(this.chainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId: ${this.chainId?.toString()}`)
        }

        const tokenAddress = await this.hopToken()
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const balance = await tokenContract.balanceOf(staker)
        return balance
      },

      approveStake: async (input: ApproveStakeInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> => {
        const populatedTx = await this.populateTransaction.approveStake(input, txOverrides)
        return this.sendTransaction(populatedTx)
      },

      mint: async (input: MintInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> => {
        const populatedTx = await this.populateTransaction.mint(input, txOverrides)
        return this.sendTransaction(populatedTx)
      }
    }
  }

  async challengePeriod (): Promise<BigNumber> {
    const contract = this.getStakingRegistryContract()
    return contract.challengePeriod()
  }

  async appealPeriod (): Promise<BigNumber> {
    const contract = this.getStakingRegistryContract()
    return contract.appealPeriod()
  }

  async minChallengeIncrease (): Promise<BigNumber> {
    const contract = this.getStakingRegistryContract()
    return contract.minChallengeIncrease()
  }

  async fullAppeal (): Promise<BigNumber> {
    const contract = this.getStakingRegistryContract()
    return contract.fullAppeal()
  }

  async minHopStake (): Promise<BigNumber> {
    const contract = this.getStakingRegistryContract()
    return contract.minHopStake()
  }

  async createChallenge (input: CreateChallengeInput): Promise<providers.TransactionResponse> {
    const { staker, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract()
    return contract.createChallenge(staker, penalty, slashingData, { value: input.challengeEth })
  }

  async addToChallenge (input: AddToChallengeInput): Promise<providers.TransactionResponse> {
    const { staker, challenger, penalty, slashingData, additionalEth } = input
    const contract = this.getStakingRegistryContract()
    return contract.addToChallenge(staker, challenger, penalty, slashingData, { value: additionalEth })
  }

  async addToAppeal (input: AddToAppealInput): Promise<providers.TransactionResponse> {
    const { staker, challenger, penalty, slashingData, appealEth } = input
    const contract = this.getStakingRegistryContract()
    return contract.addToAppeal(staker, challenger, slashingData, { value: appealEth })
  }

  async optimisticallySettleChallenge (input: OptimisticallySettleChallengeInput) {
    const { staker, challenger, penalty, slashingData } = input
    const contract = this.getStakingRegistryContract()
    return contract.optimisticallySettleChallenge(staker, challenger, penalty, slashingData)
  }

  async acceptSlash (input: AcceptSlashInput): Promise<providers.TransactionResponse> {
    const { challenger, penalty, slashingData, slashEth } = input
    const contract = this.getStakingRegistryContract()
    return contract.acceptSlash(challenger, penalty, slashingData, { value: slashEth })
  }

  async forceSettleChallenge (input: ForceSettleChallengeInput): Promise<providers.TransactionResponse> {
    const { challengeId, challengeWon } = input
    const contract = this.getStakingRegistryContract()
    return contract.forceSettleChallenge(challengeId, challengeWon)
  }

  async isStaked (input: IsStakedInput): Promise<boolean> {
    const { staker } = input

    if (!this.utils.isValidAddress(staker)) {
      throw new InputError(`Invalid staker "${staker}"`)
    }

    const contract = this.getStakingRegistryContract()
    return contract.isStaked(staker)
  }

  async getStakedBalance (input: GetStakedBalanceInput): Promise<BigNumber> {
    const { staker } = input

    if (!this.utils.isValidAddress(staker)) {
      throw new InputError(`Invalid staker "${staker}"`)
    }

    const contract = this.getStakingRegistryContract()
    return contract.getStakedBalance(staker)
  }

  async getWithdrawableBalance (input: GetWithdrawableBalanceInput): Promise<BigNumber> {
    const { staker } = input

    if (!this.utils.isValidAddress(staker)) {
      throw new InputError(`Invalid staker "${staker}"`)
    }

    const contract = this.getStakingRegistryContract()
    return contract.getWithdrawableBalance(staker)
  }

  async withdrawableEth (input: WithdrawableEthInput): Promise<BigNumber> {
    const { address } = input

    if (!this.utils.isValidAddress(address)) {
      throw new InputError(`Invalid address "${address}"`)
    }

    const contract = this.getStakingRegistryContract()
    return contract.withdrawableEth(address)
  }

  async hopToken (): Promise<string> {
    const contract = this.getStakingRegistryContract()
    return contract.hopToken()
  }

  async getChallengeId (input: GetChallengeIdInput): Promise<string> {
    const { staker, penalty, challenger, slashingData } = input
    const contract = this.getStakingRegistryContract()
    return contract.getChallengeId(staker, penalty, challenger, slashingData)
  }

  async windowSize (): Promise<string> {
    const contract = this.getStakingRegistryContract()
    return contract.windowSize()
  }

  async stakeHop (input: StakeHopInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.stakeHop(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async unstakeHop (input: UnstakeHopInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.unstakeHop(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async withdrawStake (input: WithdrawStakeInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawStake(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async signalPreference (input: SignalPreferenceInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.signalPreference(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  getEventFetcher(eventName: EventName) {
    const chainId = this.chainId
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const address = this.getStakingRegistryContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${chainId}`)
    }

    const eventFetcher: Record<EventName, any> = {
      [EventName.BonderPreference]: BonderPreferenceEventFetcher,
    }

    const EventFetcherClass = eventFetcher[eventName]
    if (!EventFetcherClass) {
      throw new ConfigError(`Event fetcher not found for event name: ${eventName}`)
    }

    return new EventFetcherClass(provider, chainId, this.batchBlocks, address)
  }

  getEventNames (): string[] {
    return StakingRegistry.getEventNames()
  }

  static getEventNames (): string[] {
    return Object.keys(EventName).sort()
  }
}

