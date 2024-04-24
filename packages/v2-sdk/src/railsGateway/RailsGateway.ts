import { BaseConfig } from '#common/index.js'
import { BigNumber, BigNumberish, Contract, Signer, providers } from 'ethers'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'
import { StakingRegistry } from './StakingRegistry.js'

export type TransferSentEventInput = {
  chainId: BigNumberish
  fromBlock: number
  toBlock: number
}

export type TransferBondEventInput = {
  chainId: BigNumberish
  fromBlock: number
  toBlock: number
}

export type Path = {
  pathId: string
  chainId: number
  token: string
  counterpartToken: string
  counterpartChainId: number
}

export type GetPathIdInput = {
  chainId0: BigNumberish
  token0: string
  chainId1: BigNumberish
  token1: string
}

export type GetPathInfoInput = {
  chainId: BigNumberish
  pathId: string
}

export type SendInput = {
  chainId: BigNumberish
  pathId: string
  to: string
  amount: BigNumberish
  minAmountOut: BigNumberish
  attestedCheckpoint: string
}

export type SendApprovalInput = {
  chainId: BigNumberish
  pathId: string
  amount: BigNumberish
}

export type BondInput = {
  chainId: BigNumberish
  checkpoint: string
  pathId: string
  to: string
  amount: BigNumberish
  totalSent: BigNumberish
  nonce: BigNumberish
  attestedCheckpoint: string
}

export type BondApprovalInput = {
  chainId: BigNumberish
  pathId: string
  amount: BigNumberish
}

export type PostClaimInput = {
  chainId: BigNumberish
  pathId: string
  transferId: string
  head: string
  totalSent: BigNumberish
}

export type RemoveClaimInput = {
  chainId: BigNumberish
  pathId: string
  checkpoint: string
  nonce: BigNumberish
}

export type ConfirmCheckpointInput = {
  chainId: BigNumberish
  pathId: string
  checkpoint: string
}

export type GetTransferIdInput = {
  chainId: BigNumberish
  pathId: string
  to: string
  adjustedAmount: BigNumberish
  minAmountOut: BigNumberish
  totalSent: BigNumberish
  nonce: BigNumberish
  attestedCheckpoint: string
}

export type WithdrawInput = {
  chainId: BigNumberish
  pathId: string
  amount: BigNumberish
  timeWindow: number
}

export type WithdrawAllInput = {
  chainId: BigNumberish
  pathId: string
  timeWindow: number
}

export type WithdrawBalanceInput = {
  chainId: BigNumberish
  pathId?: string
  path?: Path
  recipient: string
  timeWindow: number
}

export type GetNeedsApprovalForSendInput = {
  chainId: BigNumberish
  pathId: string
  amount: BigNumberish
}

export type GetNeedsApprovalForBondInput = {
  chainId: BigNumberish
  pathId: string
  amount: BigNumberish
}

export type GetLatestClaimInput = {
  chainId: BigNumberish
  pathId: string
}

export type GetIsCheckpointValidInput = {
  chainId: BigNumberish
  checkpoint: string
}

export type GetFeeInput = {
  chainId: BigNumberish
  pathId: string
}

export type StakeHopInput = {
  chainId: BigNumberish
  role: string
  staker?: string
  amount: BigNumberish
}

export type UnstakeHopInput = {
  chainId: BigNumberish
  role: string
  amount: BigNumberish
}

export type WithdrawHopInput = {
  chainId: BigNumberish
  role: string
}

export type GetCheckpointInput = {
  chainId: BigNumberish
  previousCheckpoint: string
  transferId: string
  totalSent: BigNumber
}

export type CalcAmountOutMinInput = {
  amountOut: BigNumberish,
  slippageTolerance: number
}

export type RailsGatewayConstructorInput = BaseConfig & {}

export class RailsGateway extends StakingRegistry {
  constructor (input: RailsGatewayConstructorInput) {
    const { network, signer, contractAddresses } = input
    super({
      network,
      signer,
      contractAddresses
    })
  }

  override connect (signer: Signer) {
    return new RailsGateway({ network: this.network, signer, contractAddresses: this.contractAddresses })
  }

  async getTransferSentEvents (input: TransferSentEventInput) {
    const { chainId, fromBlock, toBlock } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new Error(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && !this.utils.isValidFilterBlock(toBlock)) {
      throw new Error(`Invalid fromBlock "${toBlock}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    const filter = contract.filters.TransferSent()
    const events = await contract.queryFilter(filter, fromBlock, toBlock)
    return events
  }

  async getTransferBondedEvents (input: TransferBondEventInput) {
    const { chainId, fromBlock, toBlock } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new Error(`Invalid fromBlock "${fromBlock}"`)
    }

    if (!this.utils.isValidFilterBlock(toBlock)) {
      throw new Error(`Invalid fromBlock "${toBlock}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    const filter = contract.filters.TransferBonded()
    const events = await contract.queryFilter(filter, fromBlock, toBlock)
    return events
  }

  async getRailsGatewayContractAddress (chainId: BigNumberish): Promise<string> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'railsGateway')
  }

  async getRailsGatewayContract (chainId: BigNumberish): Promise<Contract> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    const address = await this.getRailsGatewayContractAddress(chainId)
    const provider = this.getRpcProviderForChainId(chainId)
    const contract = RailsGateway__factory.connect(address, provider)
    return contract
  }

  async getPathId (input: GetPathIdInput): Promise<string> {
    const { chainId0, token0, chainId1, token1 } = input

    if (!this.utils.isValidChainId(chainId0)) {
      throw new Error(`Invalid chainId0 "${chainId0}"`)
    }

    if (!this.utils.isValidAddress(token0)) {
      throw new Error(`Invalid token0 "${token0}"`)
    }

    if (!this.utils.isValidAddress(token1)) {
      throw new Error(`Invalid token1 "${token1}"`)
    }

    if (!this.utils.isValidChainId(chainId1)) {
      throw new Error(`Invalid chainId1 "${chainId1}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId0)
    return contract.getPathId(chainId0, token0, chainId1, token1)
  }

  async getPathInfo (input: GetPathInfoInput): Promise<Path> {
    const { chainId, pathId } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new Error(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getPathInfo(pathId)
  }

  async getFee (input: GetFeeInput): Promise<BigNumber> {
    const { chainId, pathId } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new Error(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getFee(pathId)
  }

  get populateTransaction() {
    return {
      send: async (input: SendInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, to, amount, minAmountOut, attestedCheckpoint } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new Error(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new Error(`Invalid to address "${to}"`)
        }

        if (!this.utils.isValidNumericValue(minAmountOut)) {
          throw new Error(`Invalid minAmountOut "${to}"`)
        }

        if (!this.utils.isValidBytes32(attestedCheckpoint)) {
          throw new Error(`Invalid attestedCheckpoint  "${attestedCheckpoint}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)

        const fee = await this.getFee({ chainId, pathId })
        const txData = await contract.populateTransaction.send(pathId, to, amount, minAmountOut, attestedCheckpoint, {
          value: fee
        })

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      sendApproval: async (input: SendApprovalInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, amount } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new Error(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new Error(`Invalid amount "${amount}"`)
        }

        const path = await this.getPathInfo({ chainId, pathId })
        const tokenAddress = path.token
        const provider = this.getRpcProviderForChainId(chainId)
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const address = this.getRailsGatewayContractAddress(chainId)
        const txData = await tokenContract.populateTransaction.approve(address, amount)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      bond: async (input: BondInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, checkpoint, to, amount, totalSent, nonce, attestedCheckpoint } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new Error(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(checkpoint)) {
          throw new Error(`Invalid checkpoint "${checkpoint}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new Error(`Invalid to address "${to}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new Error(`Invalid amount "${amount}"`)
        }

        if (!this.utils.isValidNumericValue(totalSent)) {
          throw new Error(`Invalid amount "${totalSent}"`)
        }

        if (!this.utils.isValidBytes32(attestedCheckpoint)) {
          throw new Error(`Invalid attested checkpoint "${attestedCheckpoint}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.bond(pathId, checkpoint, to, amount, totalSent, nonce, attestedCheckpoint)

        return {
          ...txData,
          chainId: Number(chainId),
        }
      },

      bondApproval: async (input: BondApprovalInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, amount } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new Error(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new Error(`Invalid amount "${amount}"`)
        }

        const path = await this.getPathInfo({ chainId, pathId })
        const tokenAddress = path.token
        const provider = this.getRpcProviderForChainId(chainId)
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const address = this.getRailsGatewayContractAddress(chainId)
        const txData = await tokenContract.populateTransaction.approve(address, amount)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      postClaim: async (input: PostClaimInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, transferId, head, totalSent } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new Error(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(transferId)) {
          throw new Error(`Invalid transferId "${transferId}"`)
        }

        if (!this.utils.isValidBytes32(head)) {
          throw new Error(`Invalid head "${head}"`)
        }

        if (!this.utils.isValidNumericValue(totalSent)) {
          throw new Error(`Invalid head "${totalSent}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.postClaim(pathId, transferId, head, totalSent)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      removeClaim: async (input: RemoveClaimInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, checkpoint, nonce } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new Error(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(checkpoint)) {
          throw new Error(`Invalid checkpoint "${checkpoint}"`)
        }

        if (!this.utils.isValidNumericValue(nonce)) {
          throw new Error(`Invalid nonce "${nonce}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.removeClaim(pathId, checkpoint, nonce)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      withdrawClaim: async (input: WithdrawInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, amount, timeWindow } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new Error(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new Error(`Invalid amount "${amount}"`)
        }

        if (!this.utils.isValidNumericValue(timeWindow)) {
          throw new Error(`Invalid timeWindow "${timeWindow}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.withdraw(pathId, amount, timeWindow)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      withdrawAllClaims: async (input: WithdrawAllInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, timeWindow } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new Error(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(timeWindow)) {
          throw new Error(`Invalid timeWindow "${timeWindow}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.withdrawAll(pathId, timeWindow)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      confirmCheckpoint: async (input: ConfirmCheckpointInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, checkpoint } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new Error(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(checkpoint)) {
          throw new Error(`Invalid checkpoint "${checkpoint}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.confirmCheckpoint(pathId, checkpoint)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      stakeHopApproval: async (input: StakeHopInput): Promise<providers.TransactionRequest> => {
        let { chainId, role, staker, amount } = input

        if (!staker) {
          staker = (await this.getSignerAddress()) as string
        }

        if (!staker) {
          throw new Error('Staker address not set')
        }

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(role)) {
          throw new Error(`Invalid role "${role}"`)
        }

        if (!this.utils.isValidAddress(staker)) {
          throw new Error(`Invalid staker "${staker}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new Error(`Invalid amount "${amount}"`)
        }

        const hopTokenContract = await this.getHopTokenContract(chainId)
        const address = this.getRailsGatewayContractAddress(chainId)
        const txData = await hopTokenContract.populateTransaction.approve(address, amount)
        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      stakeHop: async (input: StakeHopInput): Promise<providers.TransactionRequest> => {
        let { chainId, role, staker, amount } = input

        if (!staker) {
          staker = (await this.getSignerAddress()) as string
        }

        if (!staker) {
          throw new Error('Staker address not set')
        }

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(role)) {
          throw new Error(`Invalid role "${role}"`)
        }

        if (!this.utils.isValidAddress(staker)) {
          throw new Error(`Invalid staker "${staker}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new Error(`Invalid amount "${amount}"`)
        }

        const minRequired = await this.getMinHopStakeForRole({ chainId, role })
        const balance = await this.getHopBalance(chainId, staker)

        if (balance.lt(amount)) {
          throw new Error(`Insufficient balance to stake ${amount.toString()} HOP`)
        }

        const hopTokenContract = await this.getHopTokenContract(chainId)
        if (balance.lt(minRequired)) {
          throw new Error(`Insufficient balance to stake ${minRequired.toString()} HOP`)
        }

        const txData = await this.registryStakeHopPopulatedTx({ chainId, role, staker, amount })

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      unstakeHop: async (input: UnstakeHopInput): Promise<providers.TransactionRequest> => {
        const { chainId, role, amount } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(role)) {
          throw new Error(`Invalid role "${role}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new Error(`Invalid amount "${amount}"`)
        }

        const staker = await this.getSignerAddress()
        if (!staker) {
          throw new Error('Staker address not set')
        }
        const balance = await this.getWithdrawableStakeBalance({ chainId, role, staker })

        if (balance.lt(amount)) {
          throw new Error('Insufficient balance to unstake')
        }

        const txData = await this.registryUnstakeHopPopulatedTx({ chainId, role, amount })

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      withdrawHop: async (input: WithdrawHopInput): Promise<providers.TransactionRequest> => {
        const { chainId, role } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(role)) {
          throw new Error(`Invalid role "${role}"`)
        }

        const staker = await this.getSignerAddress()
        if (!staker) {
          throw new Error('Staker address not set')
        }
        const txData = await this.registryWithdrawPopulatedTx({ chainId, role, staker })

        return {
          ...txData,
          chainId: Number(chainId)
        }
      }
    }
  }

  async send (input: SendInput): Promise<providers.TransactionResponse> {
    const { chainId, pathId, amount } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new Error(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new Error(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const signerAddress = (await this.getSignerAddress()) as string
    const balance = await tokenContract.balanceOf(signerAddress)
    if (balance.lt(amount)) {
      throw new Error('Insufficient balance ')
    }

    const address = await this.getRailsGatewayContractAddress(chainId)
    const approved = await tokenContract.allowance(signerAddress, address)
    if (approved.lt(amount)) {
      throw new Error('Insufficient approval')
    }

    const populatedTx = await this.populateTransaction.send(input)
    const tx = await this.sendTransaction(populatedTx)
    return tx
  }

  async sendApproval (input: SendApprovalInput): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.sendApproval(input)
    return this.sendTransaction(txData)
  }

  async bond (input: BondInput): Promise<providers.TransactionResponse> {
    const { chainId, pathId, amount } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new Error(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new Error(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const signerAddress = (await this.getSignerAddress()) as string
    const balance = await tokenContract.balanceOf(signerAddress)
    if (balance.lt(amount)) {
      throw new Error('Insufficient balance')
    }

    const address = await this.getRailsGatewayContractAddress(chainId)
    const approved = await tokenContract.allowance(signerAddress, address)
    if (approved.lt(amount)) {
      throw new Error('Insufficient approval')
    }

    const populatedTx = await this.populateTransaction.bond(input)
    return this.sendTransaction(populatedTx)
  }

  async bondApproval (input: BondApprovalInput): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.bondApproval(input)
    return this.sendTransaction(txData)
  }

  async postClaim (input: PostClaimInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.postClaim(input)
    return this.sendTransaction(populatedTx)
  }

  async removeClaim (input: RemoveClaimInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.removeClaim(input)
    return this.sendTransaction(populatedTx)
  }

  async confirmCheckpoint (input: ConfirmCheckpointInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.confirmCheckpoint(input)
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

  async getNeedsApprovalForSend (input: GetNeedsApprovalForSendInput): Promise<boolean> {
    const { chainId, pathId, amount } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new Error(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const spender = this.getRailsGatewayContractAddress(chainId)
    const account = await this.getSignerAddress()
    if (!account) {
      throw new Error('signer not set')
    }
    const approved = await tokenContract.allowance(account, spender)
    return approved.lt(amount)
  }

  async getNeedsApprovalForBond (input: GetNeedsApprovalForBondInput): Promise<boolean> {
    const { chainId, pathId, amount } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new Error(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const spender = this.getRailsGatewayContractAddress(chainId)
    const account = await this.getSignerAddress()
    if (!account) {
      throw new Error('signer not set')
    }
    const approved = await tokenContract.allowance(account, spender)
    return approved.lt(amount)
  }

  async getLatestClaim (input: GetLatestClaimInput): Promise<string> {
    const { chainId, pathId } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new Error(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getLatestClaim(pathId)
  }

  async getIsCheckpointValid (input: GetIsCheckpointValidInput): Promise<boolean> {
    const { chainId, checkpoint } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(checkpoint)) {
      throw new Error(`Invalid checkpoint "${checkpoint}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.isCheckpointValid(checkpoint)
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
    const { chainId, pathId, recipient, timeWindow } = input

    if (!pathId) {
      throw new Error('pathId not set')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new Error(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidAddress(recipient)) {
      throw new Error(`Invalid recipient "${recipient}"`)
    }

    if (!this.utils.isValidNumericValue(timeWindow)) {
      throw new Error(`Invalid timeWindow "${timeWindow}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    return this.#getWithdrawableBalance({ chainId, path, recipient, timeWindow })
  }

  async #getWithdrawableBalance (input: WithdrawBalanceInput): Promise<BigNumber> {
    const { chainId, path, recipient, timeWindow } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!path) {
      throw new Error('pathInfo not set')
    }

    if (!this.utils.isValidAddress(recipient)) {
      throw new Error(`Invalid recipient "${recipient}"`)
    }

    if (!this.utils.isValidNumericValue(timeWindow)) {
      throw new Error(`Invalid timeWindow "${timeWindow}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getWithdrawableBalance(path, recipient, timeWindow)
  }

  async getTransferId (input: GetTransferIdInput): Promise<string> {
    const { chainId, pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new Error(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidAddress(to)) {
      throw new Error(`Invalid to address "${to}"`)
    }

    if (!this.utils.isValidNumericValue(adjustedAmount)) {
      throw new Error(`Invalid adjustedAmount "${adjustedAmount}"`)
    }

    if (!this.utils.isValidNumericValue(minAmountOut)) {
      throw new Error(`Invalid minAmountOut "${to}"`)
    }

    if (!this.utils.isValidNumericValue(totalSent)) {
      throw new Error(`Invalid totalSent "${totalSent}"`)
    }

    if (!this.utils.isValidNumericValue(nonce)) {
      throw new Error(`Invalid nonce "${nonce}"`)
    }

    if (!this.utils.isValidBytes32(attestedCheckpoint)) {
      throw new Error(`Invalid attestedCheckpoint  "${attestedCheckpoint}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getTransferId(pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint)
  }

  async getHopTokenAddress (chainId: BigNumberish): Promise<string> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.hopToken()
  }

  async getMinBonderStake (chainId: BigNumberish): Promise<BigNumber> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.minBonderStake()
  }

  async getHopBalance (chainId: BigNumberish, address?: string | null): Promise<BigNumber> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!address) {
      address = await this.getSignerAddress()
    }
    if (!address) {
      throw new Error('Address not set')
    }
    const contract = await this.getHopTokenContract(chainId)
    return contract.balanceOf(address)
  }

  async getHopTokenContract (chainId: BigNumberish): Promise<Contract> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    const hopTokenAddress = await this.getHopTokenAddress(chainId)
    const provider = this.getRpcProviderForChainId(chainId)
    const contract = ERC20__factory.connect(hopTokenAddress, provider)
    return contract
  }

  calcAmountOutMin (input: CalcAmountOutMinInput): BigNumber {
    let { amountOut, slippageTolerance } = input

    if (!this.utils.isValidNumericValue(amountOut)) {
      throw new Error(`Invalid amountOut "${amountOut}"`)
    }

    if (!this.utils.isValidNumericValue(slippageTolerance)) {
      throw new Error(`Invalid slippageTolerance "${slippageTolerance}"`)
    }

    amountOut = BigNumber.from(amountOut.toString())
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    return amountOut.mul(minBps).div(10000)
  }
}
