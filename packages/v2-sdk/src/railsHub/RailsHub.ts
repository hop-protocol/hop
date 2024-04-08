import { BigNumber, BigNumberish, Contract, Signer, providers } from 'ethers'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsHub__factory } from '#contracts/factories/RailsHub__factory.js'
import { StakingRegistry } from './StakingRegistry.js'

interface RailsHubConstructorInput {
  provider?: providers.Provider
  signer?: Signer
  address?: string
}

interface TransferSentEventInput {
  startBlock: number
  endBlock: number
}

interface TransferBondEventInput {
  startBlock: number
  endBlock: number
}

interface Path {
  pathId: string
  chainId: number
  token: string
  counterpartToken: string
  counterpartChainId: number
}

interface GetPathIdInput {
  chainId0: number
  token0: string
  chainId1: number
  token1: string
}

interface GetPathInfoInput {
  pathId: string
}

interface SendInput {
  pathId: string
  to: string
  amount: BigNumberish
  minAmountOut: BigNumberish
  attestedCheckpoint: string
}

interface BondInput {
  pathId: string
  checkpoint: string
  to: string
  amount: BigNumberish
  minAmountOut: BigNumberish
  totalSent: BigNumberish
  nonce: BigNumberish
  attestedCheckpoint: string
}

interface PostClaimInput {
  pathId: string
  transferId: string
  head: string
  totalSent: BigNumberish
}

interface GetTransferIdInput {
  pathId: string
  to: string
  adjustedAmount: BigNumberish
  minAmountOut: BigNumberish
  totalSent: BigNumberish
  nonce: BigNumberish
  attestedCheckpoint: string
}

interface WithdrawInput {
  pathId: string
  amount: BigNumberish
  timeWindow: number
}

interface WithdrawAllInput {
  pathId: string
  timeWindow: number
}

interface WithdrawBalanceInput {
  pathId?: string
  path?: Path
  recipient: string
  timeWindow: number
}

interface GetFeeInput {
  pathId: string
}

interface StakeHopInput {
  role: string
  staker?: string
  amount: BigNumberish
}

interface UnstakeHopInput {
  role: string
  amount: BigNumberish
}

interface CalcAmountOutMinInput {
  amountOut: BigNumberish,
  slippageTolerance: number
}

export class RailsHub extends StakingRegistry {
  override provider: providers.Provider
  override signer: Signer
  override address : string

  constructor (input: RailsHubConstructorInput = {}) {
    const { provider, signer, address } = input
    super({
      provider,
      signer,
      address
    })
    if (provider) {
      this.provider = provider
    }
    if (signer) {
      this.signer = signer
    }
    if (!this.provider && this.signer?.provider) {
      this.provider = this.signer.provider
    }
    if (!address) {
      throw new Error('address is required')
    }
    this.address = address
  }

  override connect (signer: Signer) {
    return new RailsHub({ provider: this.provider, signer })
  }

  async getSignerAddress () {
    if (this.signer) {
      return this.signer.getAddress()
    }
  }

  async getTransferSentEvents (input: TransferSentEventInput) {
    const { startBlock, endBlock } = input
    const contract = await this.getRailsHubContract()
    const filter = contract.filters.TransferSent()
    const events = await contract.queryFilter(filter, startBlock, endBlock)
    return events
  }

  async getTransferBondedEvents (input: TransferBondEventInput) {
    const { startBlock, endBlock } = input
    const contract = await this.getRailsHubContract()
    const filter = contract.filters.TransferBonded()
    const events = await contract.queryFilter(filter, startBlock, endBlock)
    return events
  }

  async getRailsHubContract (): Promise<Contract> {
    if (!this.address) {
      throw new Error('RailsHub address not set')
    }
    const contract = RailsHub__factory.connect(this.address, this.signer || this.provider)
    return contract
  }

  async getPathId (input: GetPathIdInput): Promise<string> {
    const { chainId0, token0, chainId1, token1 } = input
    const contract = await this.getRailsHubContract()
    return contract.getPathId(chainId0, token0, chainId1, token1)
  }

  async getPathInfo (input: GetPathInfoInput): Promise<Path> {
    const { pathId } = input
    const contract = await this.getRailsHubContract()
    return contract.getPathInfo(pathId)
  }

  async getFee (input: GetFeeInput): Promise<BigNumber> {
    const { pathId } = input
    const contract = await this.getRailsHubContract()
    return contract.getFee(pathId)
  }

  async send (input: SendInput): Promise<providers.TransactionResponse> {
    const { pathId, amount } = input
    const path = await this.getPathInfo({ pathId })
    const tokenAddress = path.token
    const tokenContract = ERC20__factory.connect(tokenAddress, this.signer)
    const signerAddress = await this.getSignerAddress()
    const balance = await tokenContract.balanceOf(signerAddress as string)
    if (balance.lt(amount)) {
      const approvalTx = await tokenContract.approve(this.address, amount)
      await approvalTx.wait()
    }
    return this.#send(input)
  }

  async #send (input: SendInput): Promise<providers.TransactionResponse> {
    const { pathId, to, amount, minAmountOut, attestedCheckpoint } = input
    const contract = await this.getRailsHubContract()
    const value = 0
    return contract.send(pathId, to, amount, minAmountOut, attestedCheckpoint, {
      value
    })
  }

  async bond (input: BondInput): Promise<providers.TransactionResponse> {
    const { pathId, amount } = input

    const path = await this.getPathInfo({ pathId })
    const tokenAddress = path.token
    const tokenContract = ERC20__factory.connect(tokenAddress, this.signer)
    const signerAddress = await this.getSignerAddress()
    const balance = await tokenContract.balanceOf(signerAddress as string)
    if (balance.lt(amount)) {
      const approvalTx = await tokenContract.approve(this.address, amount)
      await approvalTx.wait()
    }

    return this.#bond(input)
  }

  async #bond (input: BondInput): Promise<providers.TransactionResponse> {
    const { pathId, to, amount, minAmountOut, totalSent, nonce, attestedCheckpoint } = input
    const contract = await this.getRailsHubContract()
    return contract.bond(pathId, to, amount, minAmountOut, totalSent, nonce, attestedCheckpoint)
  }

  async postClaim (input: PostClaimInput): Promise<providers.TransactionResponse> {
    const { pathId, transferId, head, totalSent } = input
    const contract = await this.getRailsHubContract()
    return contract.postClaim(pathId, transferId, head, totalSent)
  }

  async getWithdrawableBalance (input: WithdrawBalanceInput): Promise<BigNumber> {
    const { pathId, recipient, timeWindow } = input
    if (!pathId) {
      throw new Error('pathId not set')
    }
    const path = await this.getPathInfo({ pathId })
    return this.#getWithdrawableBalance({ path, recipient, timeWindow })
  }

  async #getWithdrawableBalance (input: WithdrawBalanceInput): Promise<BigNumber> {
    const { path, recipient, timeWindow } = input
    if (!path) {
      throw new Error('pathInfo not set')
    }
    const contract = await this.getRailsHubContract()
    return contract.getWithdrawableBalance(path, recipient, timeWindow)
  }

  async withdrawClaim (input: WithdrawInput): Promise<providers.TransactionResponse> {
    const { pathId, amount, timeWindow } = input
    const contract = await this.getRailsHubContract()
    return contract.withdraw(pathId, amount, timeWindow)
  }

  async withdrawAllClaims (input: WithdrawAllInput): Promise<providers.TransactionResponse> {
    const { pathId, timeWindow } = input
    const contract = await this.getRailsHubContract()
    return contract.withdrawAll(pathId, timeWindow)
  }

  async getTransferId (input: GetTransferIdInput): Promise<string> {
    const { pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint } = input
    const contract = await this.getRailsHubContract()
    return contract.getTransferId(pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint)
  }

  async getHopTokenAddress (): Promise<string> {
    const contract = await this.getRailsHubContract()
    return contract.hopToken()
  }

  async getMinBonderStake (): Promise<BigNumber> {
    const contract = await this.getRailsHubContract()
    return contract.minBonderStake()
  }

  async getHopBalance (address?: string): Promise<BigNumber> {
    if (!address) {
      address = await this.getSignerAddress()
    }
    if (!address) {
      throw new Error('Address not set')
    }
    const contract = await this.getHopTokenContract()
    return contract.balanceOf(address)
  }

  async getHopTokenContract (): Promise<Contract> {
    const hopTokenAddress = await this.getHopTokenAddress()
    const contract = ERC20__factory.connect(hopTokenAddress, this.provider)
    return contract
  }

  async stakeHop (input: StakeHopInput): Promise<providers.TransactionResponse> {
    let { role, staker, amount } = input
    if (!staker) {
      staker = await this.getSignerAddress()
    }
    if (!staker) {
      throw new Error('Staker address not set')
    }
    const minRequired = await this.getMinHopStakeForRole({ role })
    const balance = await this.getHopBalance(staker)

    if (balance.lt(amount)) {
      throw new Error(`Insufficient balance to stake ${amount.toString()} HOP`)
    }

    const hopTokenContract = await this.getHopTokenContract()
    if (balance.lt(minRequired)) {
      const approvalTx = await hopTokenContract.approve(this.address, minRequired)
      await approvalTx.wait()
    }

    return this._stakeHop({ role, staker, amount })
  }

  async unstakeHop (input: UnstakeHopInput): Promise<providers.TransactionResponse> {
    const { role, amount } = input
    const staker = await this.getSignerAddress()
    if (!staker) {
      throw new Error('Staker address not set')
    }
    const balance = await this.getWithdrawableStakeBalance({ role, staker })

    if (balance.lt(amount)) {
      throw new Error('Insufficient balance to unstake')
    }

    const unstakeTx = await this._unstakeHop({ role, amount })
    await unstakeTx.wait()
    return this.withdraw({ role, staker })
  }

  calcAmountOutMin (input: CalcAmountOutMinInput): BigNumber {
    let { amountOut, slippageTolerance } = input
    amountOut = BigNumber.from(amountOut.toString())
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    return amountOut.mul(minBps).div(10000)
  }
}
