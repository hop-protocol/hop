import { BaseConfig } from '#common/index.js'
import { BigNumber, BigNumberish, Contract, Signer, providers, utils } from 'ethers'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'
import { StakingRegistry } from './StakingRegistry.js'
import { TransferSent, TransferSentEventFetcher } from '#railsGateway/events/TransferSent.js'
import { TransferBonded, TransferBondedEventFetcher } from '#railsGateway/events/TransferBonded.js'
import { ConfigError, InputError, InsufficientBalanceError, InsufficientApprovalError } from '#error/index.js'

const { getAddress: checksumAddress } = utils

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
  chainId: BigNumber
  token: string
  counterpartToken: string
  counterpartChainId: BigNumber
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

export type ApproveSendInput = {
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

export type ApproveBondInput = {
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

export type GetHasSufficientBalanceInput = {
  chainId: BigNumberish
  tokenAddress: string
  amount: BigNumberish
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
  pathId: string
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

export type GetTransferSentEventFromTransactionReceiptInput = {
  fromChainId: BigNumberish
  receipt: providers.TransactionReceipt
}

export type GetTransferSentEventFromTransactionHashInput = {
  fromChainId: BigNumberish
  transactionHash: string
}

export type GetTransferSentEventFromTransferIdInput = {
  fromChainId: BigNumberish
  transferId: string
}

export type GetTransferSentEventFromCheckpointInput = {
  fromChainId: BigNumberish
  checkpoint: string
}

export type GetTransferBondedEventFromTransactionReceiptInput = {
  fromChainId: BigNumberish
  receipt: providers.TransactionReceipt
}

export type GetTransferBondedEventFromTransactionHashInput = {
  fromChainId: BigNumberish
  transactionHash: string
}

export type GetTransferBondedEventFromTransferIdInput = {
  fromChainId: BigNumberish
  transferId: string
}

export type GetTransferBondedEventFromCheckpointInput = {
  fromChainId: BigNumberish
  checkpoint: string
}

export type GetTokenInfoInput = {
  chainId: BigNumberish
  address: string
}

export type GetTokenContractInput = {
  chainId: BigNumberish
  address: string
}

export type GetTransferStatusInput = {
  chainId: BigNumberish
  checkpoint: string
}

export enum TransferStatus {
  PendingBond = 'PendingBond',
  Bonded = 'Bonded',
  NotFound = 'NotFound'
}

export type Token = {
  chainId: BigNumber
  address: string
  name: string
  symbol: string
  decimals: number
}

export type RailsGatewayConstructorInput = BaseConfig

export class RailsGateway extends StakingRegistry {
  batchBlocks: number = 1000

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
    let { chainId, fromBlock, toBlock } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && !this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid fromBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const latestBlock = await provider.getBlockNumber()
    if (latestBlock) {
      if (!toBlock) {
        toBlock = latestBlock
      }
      if (!fromBlock) {
        const start = latestBlock - 1000
        fromBlock = start
      }
      if (toBlock && fromBlock < 0) {
        fromBlock = toBlock + fromBlock
      }
    }

    const address = this.getRailsGatewayContractAddress(chainId)
    const eventFetcher = new TransferSentEventFetcher(provider, chainId, 0, address)
    const events = await eventFetcher.getEvents(fromBlock, toBlock)
    return events
  }

  async getTransferBondedEvents (input: TransferBondEventInput) {
    let { chainId, fromBlock, toBlock } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (!this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid fromBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const latestBlock = await provider.getBlockNumber()
    if (latestBlock) {
      if (!toBlock) {
        toBlock = latestBlock
      }
      if (!fromBlock) {
        const start = latestBlock - 1000
        fromBlock = start
      }
      if (toBlock && fromBlock < 0) {
        fromBlock = toBlock + fromBlock
      }
    }

    const address = this.getRailsGatewayContractAddress(chainId)
    const eventFetcher = new TransferBondedEventFetcher(provider, chainId, 0, address)
    const events = await eventFetcher.getEvents(fromBlock, toBlock)
    return events
  }

  getRailsGatewayContractAddress (chainId: BigNumberish): string {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'railsGateway')
  }

  async getRailsGatewayContract (chainId: BigNumberish): Promise<Contract> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const address = this.getRailsGatewayContractAddress(chainId)
    const provider = this.getRpcProviderForChainId(chainId)
    const contract = RailsGateway__factory.connect(address, provider)
    return contract
  }

  async getPathId (input: GetPathIdInput): Promise<string> {
    const { chainId0, token0, chainId1, token1 } = input

    if (!this.utils.isValidChainId(chainId0)) {
      throw new InputError(`Invalid chainId0 "${chainId0}"`)
    }

    if (!this.utils.isValidAddress(token0)) {
      throw new InputError(`Invalid token0 "${token0}"`)
    }

    if (!this.utils.isValidAddress(token1)) {
      throw new InputError(`Invalid token1 "${token1}"`)
    }

    if (!this.utils.isValidChainId(chainId1)) {
      throw new InputError(`Invalid chainId1 "${chainId1}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId0)
    const pathId = await contract.getPathId(chainId0, token0, chainId1, token1)
    console.log('getPathId', pathId, {chainId0, token0, chainId1, token1})
    return pathId
  }

  async getPathInfo (input: GetPathInfoInput): Promise<Path> {
    const { chainId, pathId } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    const pathInfoArray = await contract.getPathInfo(pathId)
    const pathInfo: Path = {
      pathId,
      chainId: BigNumber.from(pathInfoArray[0]),
      token: checksumAddress(pathInfoArray[1]),
      counterpartChainId: BigNumber.from(pathInfoArray[2]),
      counterpartToken: checksumAddress(pathInfoArray[3])
    }

    // TODO: look into why same chainId is returned for counterpartChainId
    if (pathInfo.counterpartToken === '0xaCa72C8D5360dC237001cD963566F411732980B0' && pathInfo.counterpartChainId.eq(pathInfo.chainId)) {
      pathInfo.counterpartChainId = BigNumber.from(11155420)
    }
    if (pathInfo.counterpartToken === '0x5fd84259d66Cd46123540766Be93DFE6D43130D7' && pathInfo.counterpartChainId.eq(pathInfo.chainId)) {
      pathInfo.counterpartChainId = BigNumber.from(11155420)
    }

    if (!(this.utils.isValidAddress(pathInfo.token) && this.utils.isValidAddress(pathInfo.counterpartToken))) {
      throw new InputError('pathId is invalid or not found')
    }

    console.log('pathInfo', pathInfo)
    return pathInfo
  }

  async getFee (input: GetFeeInput): Promise<BigNumber> {
    const { chainId, pathId } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getFee(pathId)
  }

  get populateTransaction() {
    return {
      send: async (input: SendInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, amount, minAmountOut, attestedCheckpoint } = input
        let { to } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(minAmountOut)) {
          throw new InputError(`Invalid minAmountOut "${to}"`)
        }

        if (!this.utils.isValidBytes32(attestedCheckpoint)) {
          throw new InputError(`Invalid attestedCheckpoint  "${attestedCheckpoint}"`)
        }

        if (!to) {
          to = (await this.getSignerAddress()) as string
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid "to" address "${to}"`)
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

      approveSend: async (input: ApproveSendInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, amount } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
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
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(checkpoint)) {
          throw new InputError(`Invalid checkpoint "${checkpoint}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid to address "${to}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        if (!this.utils.isValidNumericValue(totalSent)) {
          throw new InputError(`Invalid amount "${totalSent}"`)
        }

        if (!this.utils.isValidBytes32(attestedCheckpoint)) {
          throw new InputError(`Invalid attested checkpoint "${attestedCheckpoint}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.bond(pathId, checkpoint, to, amount, totalSent, nonce, attestedCheckpoint)

        return {
          ...txData,
          chainId: Number(chainId),
        }
      },

      approveBond: async (input: ApproveBondInput): Promise<providers.TransactionRequest> => {
        const { chainId, pathId, amount } = input

        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
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
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(transferId)) {
          throw new InputError(`Invalid transferId "${transferId}"`)
        }

        if (!this.utils.isValidBytes32(head)) {
          throw new InputError(`Invalid head "${head}"`)
        }

        if (!this.utils.isValidNumericValue(totalSent)) {
          throw new InputError(`Invalid head "${totalSent}"`)
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
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(checkpoint)) {
          throw new InputError(`Invalid checkpoint "${checkpoint}"`)
        }

        if (!this.utils.isValidNumericValue(nonce)) {
          throw new InputError(`Invalid nonce "${nonce}"`)
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
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        if (!this.utils.isValidNumericValue(timeWindow)) {
          throw new InputError(`Invalid timeWindow "${timeWindow}"`)
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
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(timeWindow)) {
          throw new InputError(`Invalid timeWindow "${timeWindow}"`)
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
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(checkpoint)) {
          throw new InputError(`Invalid checkpoint "${checkpoint}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.confirmCheckpoint(pathId, checkpoint)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      approveStakeHop: async (input: StakeHopInput): Promise<providers.TransactionRequest> => {
        let { chainId, role, staker, amount } = input

        if (!staker) {
          staker = (await this.getSignerAddress()) as string
        }

        if (!staker) {
          throw new InputError('Staker address not set')
        }

        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(role)) {
          throw new InputError(`Invalid role "${role}"`)
        }

        if (!this.utils.isValidAddress(staker)) {
          throw new InputError(`Invalid staker "${staker}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
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
          throw new InputError('Staker address not set')
        }

        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(role)) {
          throw new InputError(`Invalid role "${role}"`)
        }

        if (!this.utils.isValidAddress(staker)) {
          throw new InputError(`Invalid staker "${staker}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const minRequired = await this.getMinHopStakeForRole({ chainId, role })
        const balance = await this.getHopBalance(chainId, staker)

        if (balance.lt(amount)) {
          throw new InsufficientBalanceError(`Insufficient balance to stake ${amount.toString()} HOP`)
        }

        const hopTokenContract = await this.getHopTokenContract(chainId)
        if (balance.lt(minRequired)) {
          throw new InsufficientBalanceError(`Insufficient balance to stake ${minRequired.toString()} HOP`)
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
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(role)) {
          throw new InputError(`Invalid role "${role}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const staker = await this.getSignerAddress()
        if (!staker) {
          throw new InputError('Staker address not set')
        }
        const balance = await this.getWithdrawableStakeBalance({ chainId, role, staker })

        if (balance.lt(amount)) {
          throw new InsufficientBalanceError('Insufficient balance to unstake')
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
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(role)) {
          throw new InputError(`Invalid role "${role}"`)
        }

        const staker = await this.getSignerAddress()
        if (!staker) {
          throw new InputError('Staker address not set')
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
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const signerAddress = (await this.getSignerAddress()) as string
    const balance = await tokenContract.balanceOf(signerAddress)
    if (balance.lt(amount)) {
      throw new InsufficientBalanceError('Insufficient balance ')
    }

    const address = this.getRailsGatewayContractAddress(chainId)
    const approved = await tokenContract.allowance(signerAddress, address)
    if (approved.lt(amount)) {
      throw new InsufficientApprovalError('Insufficient approval')
    }

    const populatedTx = await this.populateTransaction.send(input)
    const tx = await this.sendTransaction(populatedTx)
    return tx
  }

  async approveSend (input: ApproveSendInput): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.approveSend(input)
    return this.sendTransaction(txData)
  }

  async bond (input: BondInput): Promise<providers.TransactionResponse> {
    const { chainId, pathId, amount } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const signerAddress = (await this.getSignerAddress()) as string
    const balance = await tokenContract.balanceOf(signerAddress)
    if (balance.lt(amount)) {
      throw new InsufficientBalanceError('Insufficient balance')
    }

    const address = this.getRailsGatewayContractAddress(chainId)
    const approved = await tokenContract.allowance(signerAddress, address)
    if (approved.lt(amount)) {
      throw new InsufficientApprovalError('Insufficient approval')
    }

    const populatedTx = await this.populateTransaction.bond(input)
    return this.sendTransaction(populatedTx)
  }

  async approveBond (input: ApproveBondInput): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.approveBond(input)
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
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    console.log('rails approval token', tokenAddress)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const spender = this.getRailsGatewayContractAddress(chainId)
    const account = await this.getSignerAddress()
    if (!account) {
      throw new InputError('signer not set')
    }
    console.log('rails approval account', account)
    console.log('rails approval spender', spender)
    const approved = await tokenContract.allowance(account, spender)
    return approved.lt(amount)
  }

  async getNeedsApprovalForBond (input: GetNeedsApprovalForBondInput): Promise<boolean> {
    const { chainId, pathId, amount } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const spender = this.getRailsGatewayContractAddress(chainId)
    const account = await this.getSignerAddress()
    if (!account) {
      throw new InputError('signer not set')
    }
    const approved = await tokenContract.allowance(account, spender)
    return approved.lt(amount)
  }

  async getLatestClaim (input: GetLatestClaimInput): Promise<string> {
    const { chainId, pathId } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getLatestClaim(pathId)
  }

  async getIsCheckpointValid (input: GetIsCheckpointValidInput): Promise<boolean> {
    const { chainId, pathId, checkpoint } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(checkpoint)) {
      throw new InputError(`Invalid checkpoint "${checkpoint}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    const valid = await contract.isCheckpointValid(pathId, checkpoint)

    return valid
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
      throw new InputError('pathId is required')
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidAddress(recipient)) {
      throw new InputError(`Invalid recipient "${recipient}"`)
    }

    if (!this.utils.isValidNumericValue(timeWindow)) {
      throw new InputError(`Invalid timeWindow "${timeWindow}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    return this.#getWithdrawableBalance({ chainId, path, recipient, timeWindow })
  }

  async #getWithdrawableBalance (input: WithdrawBalanceInput): Promise<BigNumber> {
    const { chainId, path, recipient, timeWindow } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!path) {
      throw new InputError('pathInfo not set')
    }

    if (!this.utils.isValidAddress(recipient)) {
      throw new InputError(`Invalid recipient "${recipient}"`)
    }

    if (!this.utils.isValidNumericValue(timeWindow)) {
      throw new InputError(`Invalid timeWindow "${timeWindow}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getWithdrawableBalance(path, recipient, timeWindow)
  }

  async getTransferId (input: GetTransferIdInput): Promise<string> {
    const { chainId, pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidAddress(to)) {
      throw new InputError(`Invalid to address "${to}"`)
    }

    if (!this.utils.isValidNumericValue(adjustedAmount)) {
      throw new InputError(`Invalid adjustedAmount "${adjustedAmount}"`)
    }

    if (!this.utils.isValidNumericValue(minAmountOut)) {
      throw new InputError(`Invalid minAmountOut "${to}"`)
    }

    if (!this.utils.isValidNumericValue(totalSent)) {
      throw new InputError(`Invalid totalSent "${totalSent}"`)
    }

    if (!this.utils.isValidNumericValue(nonce)) {
      throw new InputError(`Invalid nonce "${nonce}"`)
    }

    if (!this.utils.isValidBytes32(attestedCheckpoint)) {
      throw new InputError(`Invalid attestedCheckpoint  "${attestedCheckpoint}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getTransferId(pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint)
  }

  async getHopTokenAddress (chainId: BigNumberish): Promise<string> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.hopToken()
  }

  async getMinBonderStake (chainId: BigNumberish): Promise<BigNumber> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.minBonderStake()
  }

  async getHopBalance (chainId: BigNumberish, address?: string | null): Promise<BigNumber> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!address) {
      address = await this.getSignerAddress()
    }
    if (!address) {
      throw new InputError('Address not set')
    }
    const contract = await this.getHopTokenContract(chainId)
    return contract.balanceOf(address)
  }

  async getHopTokenContract (chainId: BigNumberish): Promise<Contract> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const hopTokenAddress = await this.getHopTokenAddress(chainId)
    const provider = this.getRpcProviderForChainId(chainId)
    const contract = ERC20__factory.connect(hopTokenAddress, provider)
    return contract
  }

  calcAmountOutMin (input: CalcAmountOutMinInput): BigNumber {
    let { amountOut, slippageTolerance } = input

    if (!this.utils.isValidNumericValue(amountOut)) {
      throw new InputError(`Invalid amountOut "${amountOut}"`)
    }

    if (!this.utils.isValidNumericValue(slippageTolerance)) {
      throw new InputError(`Invalid slippageTolerance "${slippageTolerance}"`)
    }

    amountOut = BigNumber.from(amountOut.toString())
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    return amountOut.mul(minBps).div(10000)
  }

  async getTransferSentEventFromTransactionReceipt (input: GetTransferSentEventFromTransactionReceiptInput): Promise<TransferSent | null> {
    const { fromChainId, receipt } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!receipt) {
      throw new InputError('receipt is required')
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${fromChainId}"`)
    }
    const address = this.getRailsGatewayContractAddress(fromChainId)
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${fromChainId}`)
    }
    const eventFetcher = new TransferSentEventFetcher(provider, fromChainId, this.batchBlocks, address)
    const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt)
    return events?.[0] ?? null
  }

  async getTransferSentEventFromTransactionHash (input: GetTransferSentEventFromTransactionHashInput): Promise<TransferSent | null> {
    const { fromChainId, transactionHash } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${fromChainId}"`)
    }
    const receipt = await provider.getTransactionReceipt(transactionHash)

    if (!receipt) {
      return null
    }

    return this.getTransferSentEventFromTransactionReceipt({ fromChainId, receipt })
  }

  async getTransferSentEventFromTransferId (input: GetTransferSentEventFromTransferIdInput): Promise<TransferSent> {
    const { fromChainId, transferId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${fromChainId}"`)
    }

    const address = this.getRailsGatewayContractAddress(fromChainId)
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${fromChainId}"`)
    }

    const eventFetcher = new TransferSentEventFetcher(provider, fromChainId, 0, address)
    const filter = eventFetcher.getTransferIdFilter(transferId)
    const toBlock = await provider.getBlockNumber()
    const fromBlock = 0 // endBlock - 100_000
    const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getTransferSentEventFromCheckpoint (input: GetTransferSentEventFromCheckpointInput): Promise<TransferSent> {
    const { fromChainId, checkpoint } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidBytes32(checkpoint)) {
      throw new InputError(`Invalid transferId "${checkpoint}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${fromChainId}"`)
    }

    const address = this.getRailsGatewayContractAddress(fromChainId)
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${fromChainId}"`)
    }

    const eventFetcher = new TransferSentEventFetcher(provider, fromChainId, 0, address)
    const filter = eventFetcher.getCheckpointFilter(checkpoint)
    const toBlock = await provider.getBlockNumber()
    const fromBlock = 0 // endBlock - 100_000
    const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getTransferBondedEventFromTransactionReceipt (input: GetTransferBondedEventFromTransactionReceiptInput): Promise<TransferBonded | null> {
    const { fromChainId, receipt } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!receipt) {
      throw new InputError('receipt is required')
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${fromChainId}"`)
    }
    const address = this.getRailsGatewayContractAddress(fromChainId)
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${fromChainId}`)
    }
    const eventFetcher = new TransferBondedEventFetcher(provider, fromChainId, this.batchBlocks, address)
    const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt)
    return events?.[0] ?? null
  }

  async getTransferBondedEventFromTransactionHash (input: GetTransferBondedEventFromTransactionHashInput): Promise<TransferBonded | null> {
    const { fromChainId, transactionHash } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${fromChainId}"`)
    }
    const receipt = await provider.getTransactionReceipt(transactionHash)

    if (!receipt) {
      return null
    }

    return this.getTransferBondedEventFromTransactionReceipt({ fromChainId, receipt })
  }

  async getTransferBondedEventFromTransferId (input: GetTransferBondedEventFromTransferIdInput): Promise<TransferBonded> {
    const { fromChainId, transferId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${fromChainId}"`)
    }

    const address = this.getRailsGatewayContractAddress(fromChainId)
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${fromChainId}"`)
    }

    const eventFetcher = new TransferBondedEventFetcher(provider, fromChainId, 0, address)
    const filter = eventFetcher.getTransferIdFilter(transferId)
    const toBlock = await provider.getBlockNumber()
    const fromBlock = 0 // endBlock - 100_000
    const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getTransferBondedEventFromCheckpoint (input: GetTransferBondedEventFromCheckpointInput): Promise<TransferBonded> {
    const { fromChainId, checkpoint } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidBytes32(checkpoint)) {
      throw new InputError(`Invalid transferId "${checkpoint}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${fromChainId}"`)
    }

    const address = this.getRailsGatewayContractAddress(fromChainId)
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${fromChainId}"`)
    }

    const eventFetcher = new TransferBondedEventFetcher(provider, fromChainId, 0, address)
    const filter = eventFetcher.getCheckpointFilter(checkpoint)
    const toBlock = await provider.getBlockNumber()
    const fromBlock = 0 // endBlock - 100_000
    const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getTokenInfo (input: GetTokenInfoInput): Promise<Token> {
    const { chainId, address } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidAddress(address)) {
      throw new InputError(`Invalid address "${address}"`)
    }

    const contract = this.getTokenContract({ chainId, address })

    return {
      chainId: BigNumber.from(chainId),
      address: checksumAddress(address),
      name: await contract.name(),
      symbol: await contract.symbol(),
      decimals: Number(await contract.decimals())
    }
  }

  getTokenContract (input: GetTokenContractInput): Contract {
    if (!this.utils.isValidObject(input)) {
      throw new InputError('Invalid input, expected object')
    }

    const { chainId, address } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidAddress(address)) {
      throw new InputError(`Invalid address "${address}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(address, provider)
    return tokenContract
  }

  async getHasSufficientBalance (input: GetHasSufficientBalanceInput): Promise<boolean> {
    const { chainId, tokenAddress, amount } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidAddress(tokenAddress)) {
      throw new InputError(`Invalid tokenAddress "${tokenAddress}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const spender = this.getRailsGatewayContractAddress(chainId)
    const account = await this.getSignerAddress()
    if (!account) {
      throw new InputError('signer not set')
    }
    const balance = await tokenContract.balanceOf(account)
    return balance.lt(amount)
  }

  async getTransferStatus(input: GetTransferStatusInput): Promise<TransferStatus> {
    const { chainId, checkpoint } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(checkpoint)) {
      throw new InputError(`Invalid checkpoint "${checkpoint}"`)
    }

    const transferSentEvent = await this.getTransferSentEventFromCheckpoint({
      fromChainId: chainId,
      checkpoint
    })

    const transferBondedEvent = await this.getTransferBondedEventFromCheckpoint({
      fromChainId: chainId,
      checkpoint
    })

    if (transferSentEvent && !transferBondedEvent) {
      return TransferStatus.PendingBond
    }

    if (transferSentEvent && transferBondedEvent) {
      return TransferStatus.Bonded
    }

    return TransferStatus.NotFound
  }
}
