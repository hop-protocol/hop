import { BigNumber, BigNumberish, Contract, Signer, providers } from 'ethers'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsHub__factory } from '#contracts/factories/RailsHub__factory.js'
import { StakingRegistry } from './StakingRegistry.js'

interface RailsHubConstructorInput {
  network: string
  provider?: providers.Provider
  signer?: Signer
  address?: string
  chainId?: BigNumberish
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

interface WithdrawHopInput {
  role: string
}

interface CalcAmountOutMinInput {
  amountOut: BigNumberish,
  slippageTolerance: number
}

export class RailsHub extends StakingRegistry {
  override provider: providers.Provider
  override signer: Signer
  override address : string
  chainId: string

  constructor (input: RailsHubConstructorInput) {
    const { network, provider, signer, address, chainId } = input
    super({
      network,
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
    if (chainId) {
      this.chainId = chainId.toString()
    }

    if (!this.chainId) {
      throw new Error('chainId is required')
    }
  }

  override connect (signer: Signer) {
    return new RailsHub({ network: this.network, provider: this.provider, signer })
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

  get populateTransaction() {
    return {
      send: async (input: SendInput): Promise<providers.TransactionRequest> => {
        const { pathId, to, amount, minAmountOut, attestedCheckpoint } = input
        const contract = await this.getRailsHubContract()
        const value = 0
        const txData = await contract.populateTransaction.send(pathId, to, amount, minAmountOut, attestedCheckpoint, {
          value
        })

        return {
          ...txData,
          chainId: Number(this.chainId)
        }
      },

      sendApproval: async (input: SendInput): Promise<providers.TransactionRequest> => {
        const { pathId, amount } = input
        const path = await this.getPathInfo({ pathId })
        const tokenAddress = path.token
        const tokenContract = ERC20__factory.connect(tokenAddress, this.signer)
        const txData = await tokenContract.populateTransaction.approve(this.address, amount)

        return {
          ...txData,
          chainId: Number(this.chainId)
        }
      },

      bond: async (input: BondInput): Promise<providers.TransactionRequest> => {
        const { pathId, to, amount, minAmountOut, totalSent, nonce, attestedCheckpoint } = input
        const contract = await this.getRailsHubContract()
        const txData = await contract.populateTransaction.bond(pathId, to, amount, minAmountOut, totalSent, nonce, attestedCheckpoint)

        return {
          ...txData,
          chainId: Number(this.chainId),
        }
      },

      bondApproval: async (input: BondInput): Promise<providers.TransactionRequest> => {
        const { pathId, amount } = input
        const path = await this.getPathInfo({ pathId })
        const tokenAddress = path.token
        const tokenContract = ERC20__factory.connect(tokenAddress, this.signer)
        const txData = await tokenContract.populateTransaction.approve(this.address, amount)

        return {
          ...txData,
          chainId: Number(this.chainId)
        }
      },

      postClaim: async (input: PostClaimInput): Promise<providers.TransactionRequest> => {
        const { pathId, transferId, head, totalSent } = input
        const contract = await this.getRailsHubContract()
        const txData = await contract.populateTransaction.postClaim(pathId, transferId, head, totalSent)

        return {
          ...txData,
          chainId: Number(this.chainId)
        }
      },

      withdrawClaim: async (input: WithdrawInput): Promise<providers.TransactionRequest> => {
        const { pathId, amount, timeWindow } = input
        const contract = await this.getRailsHubContract()
        const txData = await contract.populateTransaction.withdraw(pathId, amount, timeWindow)

        return {
          ...txData,
          chainId: Number(this.chainId)
        }
      },

      withdrawAllClaims: async (input: WithdrawAllInput): Promise<providers.TransactionRequest> => {
        const { pathId, timeWindow } = input
        const contract = await this.getRailsHubContract()
        const txData = await contract.withdrawAll(pathId, timeWindow)

        return {
          ...txData,
          chainId: Number(this.chainId)
        }
      },

      stakeHopApproval: async (input: StakeHopInput): Promise<providers.TransactionRequest> => {
        let { role, staker, amount } = input
        if (!staker) {
          staker = await this.getSignerAddress()
        }
        const hopTokenContract = await this.getHopTokenContract()
        const txData = await hopTokenContract.populateTransaction.approve(this.address, amount)
        return {
          ...txData,
          chainId: Number(this.chainId)
        }
      },

      stakeHop: async (input: StakeHopInput): Promise<providers.TransactionRequest> => {
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
          throw new Error(`Insufficient balance to stake ${minRequired.toString()} HOP`)
        }

        const txData = await this.registryStakeHopPopulatedTx({ role, staker, amount })

        return {
          ...txData,
          chainId: Number(this.chainId)
        }
      },

      unstakeHop: async (input: UnstakeHopInput): Promise<providers.TransactionRequest> => {
        const { role, amount } = input
        const staker = await this.getSignerAddress()
        if (!staker) {
          throw new Error('Staker address not set')
        }
        const balance = await this.getWithdrawableStakeBalance({ role, staker })

        if (balance.lt(amount)) {
          throw new Error('Insufficient balance to unstake')
        }

        const txData = await this.registryUnstakeHopPopulatedTx({ role, amount })

        return {
          ...txData,
          chainId: Number(this.chainId)
        }
      },

      withdrawHop: async (input: WithdrawHopInput): Promise<providers.TransactionRequest> => {
        const { role } = input
        const staker = await this.getSignerAddress()
        if (!staker) {
          throw new Error('Staker address not set')
        }
        const txData = await this.registryWithdrawPopulatedTx({ role, staker })

        return {
          ...txData,
          chainId: Number(this.chainId)
        }
      }
    }
  }

  async send (input: SendInput): Promise<providers.TransactionResponse> {
    const { pathId, amount } = input
    const path = await this.getPathInfo({ pathId })
    const tokenAddress = path.token
    const tokenContract = ERC20__factory.connect(tokenAddress, this.signer)
    const signerAddress = (await this.getSignerAddress()) as string
    const balance = await tokenContract.balanceOf(signerAddress)
    if (balance.lt(amount)) {
      throw new Error('Insufficient balance ')
    }
    const approved = await tokenContract.allowance(signerAddress, this.address)
    if (approved.lt(amount)) {
      throw new Error('Insufficient approval')
    }

    const populatedTx = await this.populateTransaction.send(input)
    const tx = await this.sendTransaction(populatedTx)
    return tx
  }

  async bond (input: BondInput): Promise<providers.TransactionResponse> {
    const { pathId, amount } = input

    const path = await this.getPathInfo({ pathId })
    const tokenAddress = path.token
    const tokenContract = ERC20__factory.connect(tokenAddress, this.signer)
    const signerAddress = (await this.getSignerAddress()) as string
    const balance = await tokenContract.balanceOf(signerAddress)
    if (balance.lt(amount)) {
      throw new Error('Insufficient balance')
    }

    const approved = await tokenContract.allowance(signerAddress, this.address)
    if (approved.lt(amount)) {
      throw new Error('Insufficient approval')
    }

    const populatedTx = await this.populateTransaction.bond(input)
    return this.sendTransaction(populatedTx)
  }

  async postClaim (input: PostClaimInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.postClaim(input)
    return this.sendTransaction(populatedTx)
  }

  async withdrawClaim (input: WithdrawInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawClaim(input)
    return this.sendTransaction(populatedTx)
  }

  async withdrawAllClaims (input: WithdrawAllInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawAllClaims(input)
    return this.sendTransaction(populatedTx)
  }

  async stakeHop (input: StakeHopInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.stakeHop(input)
    return this.sendTransaction(populatedTx)
  }

  async unstakeHop (input: UnstakeHopInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.unstakeHop(input)
    return this.sendTransaction(populatedTx)
  }

  async withdrawHop (input: WithdrawHopInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawHop(input)
    return this.sendTransaction(populatedTx)
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

  calcAmountOutMin (input: CalcAmountOutMinInput): BigNumber {
    let { amountOut, slippageTolerance } = input
    amountOut = BigNumber.from(amountOut.toString())
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    return amountOut.mul(minBps).div(10000)
  }
}
