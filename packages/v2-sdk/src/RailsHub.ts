import { BigNumber, BigNumberish, Contract, Signer, providers } from 'ethers'
import { ERC20__factory } from './config/contracts/factories/non_generated/ERC20__factory.js'
import { RailsHub__factory } from './config/contracts/factories/generated/RailsHub__factory.js'
import { StakingRegistry } from './StakingRegistry.js'

// Constructor input type
interface RailsHubConstructorInput {
  provider?: providers.Provider
  signer?: Signer
  address?: string
}

// getTransferSentEvents and getTransferBondedEvents input type
interface TransferEventInput {
  startBlock: number
  endBlock: number
}

// SendBondPostClaimInput

// Path struct type
interface Path {
  pathId: string
  chainId: number
  token: string
  counterpartToken: string
  counterpartChainId: number
}

// getPathId input type
interface GetPathIdInput {
  chainId0: number
  token0: string
  chainId1: number
  token1: string
}

// getPathInfo input type
interface GetPathInfoInput {
  pathId: string
}

// send input type
interface SendInput {
  pathId: string
  to: string
  amount: BigNumberish
  minAmountOut: BigNumberish
  attestedCheckpoint: string
}

// bond input type
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

// postClaim input type
interface PostClaimInput {
  pathId: string
  transferId: string
  head: string
  totalSent: BigNumberish
}

// getTransferId input type
interface GetTransferIdInput {
  pathId: string
  to: string
  adjustedAmount: BigNumberish
  minAmountOut: BigNumberish
  totalSent: BigNumberish
  nonce: BigNumberish
  attestedCheckpoint: string
}

// withdraw input type
interface WithdrawInput {
  pathId: string
  amount: BigNumberish
  timeWindow: number
}

// withdrawAll input type
interface WithdrawAllInput {
  pathId: string
  timeWindow: number
}

// getWithdrawableBalance input type
interface WithdrawBalanceInput {
  path: Path
  recipient: string
  timeWindow: number
}

// getFee input type
interface GetFeeInput {
  pathId: string
}

// getTokenBusInfo input type
interface GetTokenBusInfoInput {
  tokenBusId: string
}

interface StakeHopInput {
  role: string;
  staker?: string; // Ethereum address format
  amount: BigNumberish; // Can be a number, string, BigNumber, etc.
}

interface UnstakeHopInput {
  role: string;
  amount: BigNumberish; // Can be a number, string, BigNumber, etc.
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
    this.provider = provider as any
    this.signer = signer as any
    if (!this.provider && this.signer) {
      this.provider = this.signer.provider as any
    }
    this.address = address as any
  }

  override connect (signer: Signer) {
    return new RailsHub({ provider: this.provider, signer })
  }

  async getTransferSentEvents (input: TransferEventInput) {
    const { startBlock, endBlock } = input
    const contract = this.getRailsHubContract()
    const filter = contract.filters.TransferSent()
    const events = await contract.queryFilter(filter, startBlock, endBlock)
    return events
  }

  async getTransferBondedEvents (input: TransferEventInput) {
    const { startBlock, endBlock } = input
    const contract = this.getRailsHubContract()
    const filter = contract.filters.TransferBonded()
    const events = await contract.queryFilter(filter, startBlock, endBlock)
    return events
  }

  getRailsHubContract (): Contract {
    if (!this.address) {
      throw new Error('RailsHub address not set')
    }
    const contract = RailsHub__factory.connect(this.address, this.signer || this.provider)
    return contract
  }

  async send (input: SendInput) {
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

  async #send (input: SendInput) {
    const { pathId, to, amount, minAmountOut, attestedCheckpoint } = input
    const contract = this.getRailsHubContract()
    const value = 0
    return contract.send(pathId, to, amount, minAmountOut, attestedCheckpoint, {
      value
    })
  }

  async bond (input: BondInput) {
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

  async #bond (input: BondInput) {
    const { pathId, to, amount, minAmountOut, totalSent, nonce, attestedCheckpoint } = input
    const contract = this.getRailsHubContract()
    return contract.bond(pathId, to, amount, minAmountOut, totalSent, nonce, attestedCheckpoint)
  }

  async postClaim (input: PostClaimInput) {
    const { pathId, transferId, head, totalSent } = input
    const contract = this.getRailsHubContract()
    return contract.postClaim(pathId, transferId, head, totalSent)
  }

  async withdrawClaim (input: WithdrawInput) {
    const { pathId, amount, timeWindow } = input
    const contract = this.getRailsHubContract()
    return contract.withdraw(pathId, amount, timeWindow)
  }

  async withdrawAllClaims (input: WithdrawAllInput) {
    const { pathId, timeWindow } = input
    const contract = this.getRailsHubContract()
    return contract.withdrawAll(pathId, timeWindow)
  }

  async getWithdrawableBalance (input: WithdrawBalanceInput) {
    const { path, recipient, timeWindow } = input
    const contract = this.getRailsHubContract()
    return contract.getWithdrawableBalance(path, recipient, timeWindow)
  }

  async getTransferId (input: GetTransferIdInput) {
    const { pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint } = input
    const contract = this.getRailsHubContract()
    return contract.getTransferId(pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint)
  }

  async getPathId (input: GetPathIdInput) {
    const { chainId0, token0, chainId1, token1 } = input
    const contract = this.getRailsHubContract()
    return contract.getPathId(chainId0, token0, chainId1, token1)
  }

  async getPathInfo (input: GetPathInfoInput) {
    const { pathId } = input
    const contract = this.getRailsHubContract()
    return contract.getPathInfo(pathId)
  }

  async getFee (input: GetFeeInput) {
    const { pathId } = input
    const contract = this.getRailsHubContract()
    return contract.getFee(pathId)
  }

  async getHopTokenAddress () {
    const contract = this.getRailsHubContract()
    return contract.hopToken()
  }

  async getMinBonderStake () {
    const contract = this.getRailsHubContract()
    return contract.minBonderStake()
  }

  async getHopBalance (address?: string) {
    if (!address) {
      address = await this.getSignerAddress()
    }
    if (!address) {
      throw new Error('Address not set')
    }
    const contract = await this.getHopTokenContract()
    return contract.balanceOf(address)
  }

  async getHopTokenContract () {
    const hopTokenAddress = await this.getHopTokenAddress()
    const contract = ERC20__factory.connect(hopTokenAddress, this.provider)
    return contract
  }

  async stakeHop (input: StakeHopInput) {
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

  async unstakeHop (input: UnstakeHopInput) {
    const { role, amount } = input
    const staker = await this.getSignerAddress() as any
    const balance = await this.getWithdrawableStakeBalance({ role, staker })

    if (balance.lt(amount)) {
      throw new Error('Insufficient balance to unstake')
    }

    const unstakeTx = await this._unstakeHop({ role, amount })
    await unstakeTx.wait()
    return this.withdraw({ role, staker })
  }

  async getSignerAddress () {
    if (this.signer) {
      return this.signer.getAddress()
    }
  }

  calcAmountOutMin (input: CalcAmountOutMinInput): BigNumber {
    let { amountOut, slippageTolerance } = input
    amountOut = BigNumber.from(amountOut.toString())
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    return amountOut.mul(minBps).div(10000)
  }
}
