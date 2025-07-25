import { Base, TxOverrides, SignersOrProviders } from '#common/index.js'
import { Addresses } from '#addresses/types.js'
import { BigNumber, BigNumberish, Contract, Signer, providers, utils, constants } from 'ethers'
import { getNetwork, NetworkSlug } from '@hop-protocol/sdk'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'
import { StakingRegistry } from './StakingRegistry.js'
import { HopStruct, TransferSent } from '#railsGateway/events/TransferSent.js'
import { ClaimBonded } from '#railsGateway/events/ClaimBonded.js'
import { PathInitialized, PathInitializedEventFetcher, PathInitializedIndexes } from '#railsGateway/events/PathInitialized.js'
import { ConfigError, InputError, InsufficientBalanceError, InsufficientApprovalError } from '#error/index.js'
import { EthersEventWithDecodedTypes, EthersEventWithDecodedTypesAndBaseContext } from '#events/index.js'
import memcache from 'memory-cache'
import { getComputedNextHopsHash } from '../utils/getComputedNextHopsHash.js'
import { getComputedTransferId } from '../utils/getComputedTransferId.js'
import { getComputedTransferDataHash, GetComputedTransferDataHashInput } from '../utils/getComputedTransferDataHash.js'
import { RailsPath, EventName as RailsPathEventName } from './RailsPath.js'

const { getAddress: checksumAddress } = utils

const cache = new memcache.Cache()

export type EventFetcher = PathInitializedEventFetcher

export type GetEventFilterInput = PathInitializedIndexes

export enum EventName {
  PathInitialized = 'PathInitialized'
}

export type GetTransferSentEventFromTransactionHashInput = {
  transactionHash: string
}

export type GetTransferSentEventFromTransactionReceiptInput = {
  receipt: providers.TransactionReceipt
}

export type GetClaimBondedEventFromTransactionHashInput = {
  transactionHash: string
}

export type GetClaimBondedEventFromTransactionReceiptInput = {
  receipt: providers.TransactionReceipt
}

export type GetTransferSentEventFromTransferIdInput = {
  transferId: string
  fromBlock?: number
}

export type GetClaimBondedEventFromTransferIdInput = {
  transferId: string
  fromBlock?: number
}

export type Path = {
  pathId: string
  chainId: string
  token: string
  counterpartToken: string
  counterpartChainId: string
  initialReserve: BigNumber
}

export type GetPathIdInput = {
  chainId0: BigNumberish
  token0: string
  chainId1: BigNumberish
  token1: string
  initialReserve: BigNumberish
}

export type GetPathInfoInput = {
  pathId: string
}

export type HopStructInput = {
  pathId: string
  maxBonderFee: BigNumberish
  maxTotalSent: BigNumberish
  attestedClaimId: string
  updater: string
}

export type SendInput = {
  to: string
  amount: BigNumberish
  hops: HopStructInput[]
  fee: BigNumberish
}

export type ApproveSendInput = {
  pathId: string
  amount: BigNumberish
}

export type DecodedSendInputData = {
  to: string
  amount: string
  hops: Array<{
    pathId: string
    maxBonderFee: string
    maxTotalSent: string
    attestedClaimId: string
  }>
}

export type DecodedBondInputData = {
  pathId: string
  claimId: string
  bonderFee: string
  nextHops: Array<{
    pathId: string
    maxBonderFee: string
    maxTotalSent: string
    attestedClaimId: string
  }>
}

export type BondInput = {
  pathId: string
  claimId: string
  bonderFee: BigNumberish
  nextHops: HopStructInput[]
}

export type ApproveBondInput = {
  pathId: string
  amount: BigNumberish
}

export type RemoveClaimInput = {
  pathId: string
  claimId: string
}

export type ConfirmClaimInput = {
  pathId: string
  claimId: string
}

export type GetComputedTransferIdInput = {
  previousTransferId: string
  transferDataHash: string
}

export type GetWithdrawableBalanceInput = {
  pathId: string
  recipient: string
  claimId: string
}

export type GetHasSufficientBalanceInput = {
  tokenAddress: string
  amount: BigNumberish
  account?: string
}

export type GetNeedsApprovalForSendInput = {
  pathId: string
  amount: BigNumberish
  account?: string
}

export type GetNeedsApprovalForBondInput = {
  pathId: string
  amount: BigNumberish
  account?: string
}

export type GetHeadClaimIdInput = {
  pathId: string
}

export type GetIsClaimIdValidInput = {
  pathId: string
  claimId: string
}

export type GetIsTransferIdValidInput = {
  pathId: string
  claimId: string
}

export type GetSendFeeInput = {
  pathId: string
}

export type GetMessageFeeInput = {
  chainId: BigNumberish
}

export type GetTokenInfoInput = {
  address: string
}

export type GetTokenContractInput = {
  address: string
}

export type Token = {
  chainId: string
  address: string
  name: string
  symbol: string
  decimals: number
}

export type GetTotalSentInput = {
  pathId: string
}

export type GetNextHopsHashInput = {
  nextHops: HopStructInput[]
}

export type GetIsPathIdLiveInput = {
  pathId: string
}

export type ClaimFeesFromPathInput = {
  pathId: string
}

export type DistributeClaimedFeesInput = {
  pathId: string
  account: string
  totalFees: BigNumberish
  lastClaimId: string
}

export type GetTransferDataHashInput = {
  to: string
  amount: BigNumberish
  maxBonderFee?: BigNumberish
  attestedClaimId?: string
  sourcePool: BigNumberish
  sourceTotalFraudulent: BigNumberish
  hops: HopStructInput[]
}

export type GetBucketIndexInput = {
  pathId: string
  claimId: string
}

export type GetAmountOutInput = {
  pathId: string
  amount: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
}

export type GetSourcePoolInput = {
  pathId: string
  attestedClaimId: string
}

export type GetGatewaysInput = {
  counterpartChainId: BigNumberish
}

export type Claim = {
  createdAt: BigNumber
  index: BigNumber
  to: string
  amountOut: BigNumber
  maxBonderFee: BigNumber
  totalClaims: BigNumber
  nextHopsHash: string
  totalAttested: BigNumber
  totalAddedToBucketMaxConfirmed: BigNumber
  bondedOrWithdrawnBy: string
}

export type GetClaimInput = {
  pathId: string
  claimId: string
}

export type GetCounterpartChainIdInput = {
  pathId: string
}

export type InitChainInput = {
  chainId: BigNumberish
  gateway: string
}

export type InitPathInput = {
  token: string
  counterpartChainId: BigNumberish
  counterpartToken: string
  initialReserve: BigNumberish
}

export type SetDefaultTokenFeeInput = {
  fee: BigNumberish
}

export type SetStakingRegistryInput = {
  newStakingRegistry: string
}

export type UpdateDefaultTokenFeeInput = {
  fee: BigNumberish
}

export type UpdateTokenFeeInput = {
  pathId: string
  fee: BigNumberish
}

export type IsPathInitializedInput = {
  pathId: string
}

export type PostClaimInput = {
  pathId: string
  claimId: string
  to: string
  amount: BigNumberish
  maxBonderFee: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
  sourceTotalFraudulent: BigNumberish
  nextHopsHash: string
}

export type WithdrawBondsInput = {
  pathId: string
  claimId: string
}

export type WithdrawClaimInput = {
  pathId: string
  claimId: string
  nextHops: HopStructInput[]
}

export type GetInitialReserveByTokenSymbolInput = {
  tokenSymbol: string
}

export type GetInitialReserveByTokenAddressInput = {
  tokenAddress: string
}

export type GetInitialReserveInput = {
  pathId: string
}

export type CounterpartChainIdsInput = {
  pathId: string
}

export type GetPathInput = {
  pathId: string
}

export type PostClaimAndBondInput = {
  pathId: string
  claimId: string
  to: string
  amountOut: BigNumberish
  maxBonderFee: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
  sourceTotalFraudulent: BigNumberish
  bonderFee: BigNumberish
  nextHops: HopStructInput[]
}

export type ReaddClaimInput = {
  pathId: string
  transferDataHash: string
  claimId: string
}

export type SetTokenFeeRecipientInput = {
  recipient: string
}

export type TokensInput = {
  pathId: string
}

export type RailsGatewayConstructorInput = {
  network?: string
  gasPriceMultiplier?: number
  signersOrProviders?: SignersOrProviders
  contractAddresses?: Addresses
  chainId: BigNumberish
  signerOrProvider?: Signer | providers.Provider
}

export type EstimateGasCostForSendInput = SendInput & {
  from?: string
  gasPrice?: BigNumberish
}

export class RailsGateway extends Base {
  static EventName = EventName
  chainId: BigNumberish

  constructor ({ contractAddresses, chainId, signerOrProvider, signersOrProviders, network }: RailsGatewayConstructorInput) {
    super({
      contractAddresses,
      signersOrProviders: {
        [chainId?.toString()]: signerOrProvider!
      },
      network: network ?? RailsGateway.deriveNetwork(chainId)
    })
    this.chainId = chainId
  }

  getRailsGatewayContractAddress (): string {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'railsGateway')
  }

  async getRailsGatewayContract (): Promise<Contract> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const address = this.getRailsGatewayContractAddress()
    const provider = await this.getSignerOrProvider(chainId)
    return RailsGateway__factory.connect(address, provider)
  }

  /** ADMIN FUNCTIONS */

  async initChain({ chainId, gateway }: InitChainInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidAddress(gateway)) {
      throw new InputError(`Invalid gateway "${gateway}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const tx = await contract.initChain(chainId, gateway)

    return tx
  }

  async initPath ({ token, counterpartChainId, counterpartToken, initialReserve }: InitPathInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidAddress(token)) {
      throw new InputError(`Invalid token "${token}"`)
    }

    if (!this.utils.isValidChainId(counterpartChainId)) {
      throw new InputError(`Invalid counterpartChainId "${counterpartChainId}"`)
    }

    if (!this.utils.isValidAddress(counterpartToken)) {
      throw new InputError(`Invalid counterpartToken "${counterpartToken}"`)
    }

    if (!this.utils.isValidNumericValue(initialReserve)) {
      throw new InputError(`Invalid initialReserve "${initialReserve}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const tx = await contract.initPath(token, counterpartChainId, counterpartToken, initialReserve)

    return tx
  }

  async setDefaultTokenFee({ fee }: SetDefaultTokenFeeInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidNumericValue(fee)) {
      throw new InputError(`Invalid fee "${fee}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const tx = await contract.setDefaultTokenFee(fee)

    return tx
  }

  async setStakingRegistry({ newStakingRegistry }: SetStakingRegistryInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidAddress(newStakingRegistry)) {
      throw new InputError(`Invalid newStakingRegistry "${newStakingRegistry}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const tx = await contract.setStakingRegistry(newStakingRegistry)

    return tx
  }

  async setTokenFeeRecipient ({ recipient }: SetTokenFeeRecipientInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidAddress(recipient)) {
      throw new InputError(`Invalid recipient "${recipient}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const tx = await contract.setTokenFeeRecipient(recipient)

    return tx
  }

  async updateDefaultTokenFee({ fee }: UpdateDefaultTokenFeeInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidNumericValue(fee)) {
      throw new InputError(`Invalid fee "${fee}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const tx = await contract.updateDefaultTokenFee(fee)

    return tx
  }

  async updateTokenFee({ pathId, fee }: UpdateTokenFeeInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidNumericValue(fee)) {
      throw new InputError(`Invalid fee "${fee}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const tx = await contract.updateTokenFee(pathId, fee)

    return tx
  }

  /** /END ADMIN FUNCTIONS */

  async isPathInitialized({ pathId }: IsPathInitializedInput): Promise<boolean> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.isPathInitialized(pathId)
  }

  async getPathId ({ chainId0, token0, chainId1, token1, initialReserve }: GetPathIdInput): Promise<string> {
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

    const contract = await this.getRailsGatewayContract()

    try {
      const pathId = await contract.getPathId(chainId0, token0, chainId1, token1, initialReserve)
      return pathId
    } catch (err: unknown) {
      console.warn('hopV2Sdk: getPathId error', err, { chainId0, token0, chainId1, token1, initialReserve }, this.getProvider(this.chainId))
      return this.throwError(err) as string
    }
  }

  async defaultTokenFee (): Promise<BigNumber> {
    const contract = await this.getRailsGatewayContract()
    return contract.defaultTokenFee()
  }

  async dispatcher (): Promise<string> {
    const contract = await this.getRailsGatewayContract()
    return contract.dispatcher()
  }

  async executor (): Promise<string> {
    const contract = await this.getRailsGatewayContract()
    return contract.executor()
  }

  async tokens ({ pathId }: TokensInput): Promise<string> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.tokens(pathId)
  }

  async getPath ({ pathId }: GetPathInput): Promise<string> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getPath(pathId)
  }

  async feeManager (): Promise<string> {
    const contract = await this.getRailsGatewayContract()
    return contract.feeManager()
  }

  async gateways ({ counterpartChainId }: GetGatewaysInput): Promise<string> {
    if (!this.utils.isValidChainId(counterpartChainId)) {
      throw new InputError(`Invalid counterpartChainId "${counterpartChainId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.gateways(counterpartChainId)
  }

  async getCounterpartChainId ({ pathId }: GetCounterpartChainIdInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const counterpartChainId = await contract.getCounterpartChainId(pathId)
    return counterpartChainId
  }

  async getSendFee ({ pathId }: GetSendFeeInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const fee = await contract.getSendFee(pathId)
      return fee
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async getMessageFee ({ chainId }: GetMessageFeeInput): Promise<BigNumber> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const fee = await contract.getMessageFee(chainId)
      return fee
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async getRemoveFee (): Promise<BigNumber> {
    const contract = await this.getRailsGatewayContract()

    try {
      const fee = await contract.getRemoveFee()
      return fee
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async getPostClaimFee (): Promise<BigNumber> {
    const contract = await this.getRailsGatewayContract()

    try {
      const fee = await contract.getPostClaimFee()
      return fee
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async counterpartChainIds({ pathId }: CounterpartChainIdsInput): Promise<BigNumber[]> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.counterpartChainIds(pathId)
  }

  async railsPathImplementation (): Promise<string> {
    const contract = await this.getRailsGatewayContract()
    return contract.railsPathImplementation()
  }

  async getAmountOut ({ pathId, amount, attestedClaimId, sourcePool }: GetAmountOutInput): Promise<BigNumber> {
    const contract = await this.getRailsGatewayContract()
    return contract.getAmountOut(pathId, amount, attestedClaimId, sourcePool)
  }

  async getStakingRegistryContractAddress(): Promise<string> {
    return this.stakingRegistry()
  }

  async stakingRegistry(): Promise<string> {
    const contract = await this.getRailsGatewayContract()
    return contract.stakingRegistry()
  }

  async getTransferDataHash ({ to, amount, maxBonderFee, attestedClaimId, sourcePool, sourceTotalFraudulent, hops }: GetTransferDataHashInput): Promise<string> {
    maxBonderFee ??= hops[0].maxBonderFee
    attestedClaimId ??= hops[0].attestedClaimId
    return getComputedTransferDataHash({ to, amount, maxBonderFee, attestedClaimId, sourcePool, sourceTotalFraudulent, hops })
  }

  async getNextHopsHash ({ nextHops }: GetNextHopsHashInput): Promise<string> {
    return RailsGateway.getComputedNextHopsHash({ nextHops })
  }

  getStakingRegistry(): StakingRegistry {
    return new StakingRegistry({
      network: this.network,
      chainId: this.chainId,
      contractAddresses: this.contractAddresses,
      signersOrProviders: this.signersOrProviders,
    })
  }

  // TODO: This should be named getRailsPath, but we need to remove the async one first
  getRailsPathByAddress (address: string): RailsPath {
    if (!this.utils.isValidAddress(address)) {
      throw new InputError(`Invalid address "${address}"`)
    }
    return new RailsPath({
      chainId: this.chainId,
      address,
      contractAddresses: this.contractAddresses,
      signersOrProviders: this.signersOrProviders,
      network: this.network
    })
  }

  async getRailsPath (pathId?: string, address?: string): Promise<RailsPath> {
    if (pathId) {
      address = await this.getPath({ pathId })
    }
    return new RailsPath({
      chainId: this.chainId,
      address,
      contractAddresses: this.contractAddresses,
      signersOrProviders: this.signersOrProviders,
      network: this.network
    })
  }

  get populateTransaction() {
    return {
      send: async ({ to, amount, hops = [], fee }: SendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid "to" address "${to}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        if (!hops || !Array.isArray(hops)) {
          throw new InputError('Invalid hops. Expected array of hops')
        }

        if (!this.utils.isValidNumericValue(fee)) {
          throw new InputError(`Invalid amount "${fee}"`)
        }

        for (const hop of hops) {
          if (!this.utils.isValidBytes32(hop.pathId)) {
            throw new InputError(`Invalid pathId "${hop.pathId}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxBonderFee)) {
            throw new InputError(`Invalid maxBonderFee "${hop.maxBonderFee}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxTotalSent)) {
            throw new InputError(`Invalid maxTotalSent "${hop.maxTotalSent}"`)
          }

          if (hop.attestedClaimId) {
            if (!this.utils.isValidBytes32(hop.attestedClaimId)) {
              throw new InputError(`Invalid attestedClaimId "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        const contract = await this.getRailsGatewayContract()

        const txData = await contract.populateTransaction.send(to, amount, hops, {
          value: fee
        })

        console.log('v2 rails send txData', txData)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      approveSend: async ({ pathId, amount }: ApproveSendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const path = await this.helpers.getPathInfo({ pathId })
        const tokenAddress = path.token
        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId: ${chainId}`)
        }
        console.log('hopV2Sdk: rails approval token', tokenAddress)
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const address = this.getRailsGatewayContractAddress()
        const txData = await tokenContract.populateTransaction.approve(address, amount)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      bond: async ({ pathId, claimId, bonderFee, nextHops = []}: BondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid transferId "${claimId}"`)
        }

        if (!this.utils.isValidNumericValue(bonderFee)) {
          throw new InputError(`Invalid bonderFee "${bonderFee}"`)
        }

        if (!nextHops || !Array.isArray(nextHops)) {
          throw new InputError('Invalid nextHops')
        }

        for (const hop of nextHops) {
          if (!this.utils.isValidBytes32(hop.pathId)) {
            throw new InputError(`Invalid pathId "${hop.pathId}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxTotalSent)) {
            throw new InputError(`Invalid maxTotalSent "${hop.maxTotalSent}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxBonderFee)) {
            throw new InputError(`Invalid maxBonderFee "${hop.maxBonderFee}"`)
          }

          if (hop.attestedClaimId) {
            if (!this.utils.isValidBytes32(hop.attestedClaimId)) {
              throw new InputError(`Invalid attestedClaimId "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.bond(pathId, claimId, bonderFee, nextHops)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      postClaim: async ({ pathId, claimId, to, amount, maxBonderFee, attestedClaimId, sourcePool, sourceTotalFraudulent, nextHopsHash }: PostClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid to "${to}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        if (!this.utils.isValidNumericValue(maxBonderFee)) {
          throw new InputError(`Invalid maxBonderFee "${maxBonderFee}"`)
        }

        if (!this.utils.isValidBytes32(attestedClaimId)) {
          throw new InputError(`Invalid attestedClaimId "${attestedClaimId}"`)
        }

        if (!this.utils.isValidNumericValue(sourcePool)) {
          throw new InputError(`Invalid sourcePool "${sourcePool}"`)
        }

        if (!this.utils.isValidNumericValue(sourceTotalFraudulent)) {
          throw new InputError(`Invalid sourceTotalFraudulent "${sourceTotalFraudulent}"`)
        }

        if (!this.utils.isValidBytes32(nextHopsHash)) {
          throw new InputError(`Invalid nextHopsHash "${nextHopsHash}"`)
        }

        const updateFee = await this.getPostClaimFee()
        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.postClaim(pathId, claimId, to, amount, maxBonderFee, attestedClaimId, sourcePool, sourceTotalFraudulent, nextHopsHash)

        return {
          ...txData,
          value: updateFee,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      postClaimAndBond: async ({ pathId, claimId, to, amountOut, maxBonderFee, attestedClaimId, sourcePool, sourceTotalFraudulent, bonderFee, nextHops }: PostClaimAndBondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid to "${to}"`)
        }

        if (!this.utils.isValidNumericValue(amountOut)) {
          throw new InputError(`Invalid amountOut "${amountOut}"`)
        }

        if (!this.utils.isValidNumericValue(maxBonderFee)) {
          throw new InputError(`Invalid maxBonderFee "${maxBonderFee}"`)
        }

        if (!this.utils.isValidBytes32(attestedClaimId)) {
          throw new InputError(`Invalid attestedClaimId "${attestedClaimId}"`)
        }

        if (!this.utils.isValidNumericValue(sourcePool)) {
          throw new InputError(`Invalid sourcePool "${sourcePool}"`)
        }

        if (!this.utils.isValidNumericValue(sourceTotalFraudulent)) {
          throw new InputError(`Invalid sourcePool "${sourceTotalFraudulent}"`)
        }

        if (!this.utils.isValidNumericValue(bonderFee)) {
          throw new InputError(`Invalid bonderFee "${bonderFee}"`)
        }

        if (!nextHops || !Array.isArray(nextHops)) {
          throw new InputError('Invalid nextHops')
        }

        for (const hop of nextHops) {
          if (!this.utils.isValidBytes32(hop.pathId)) {
            throw new InputError(`Invalid pathId "${hop.pathId}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxTotalSent)) {
            throw new InputError(`Invalid maxTotalSent "${hop.maxTotalSent}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxBonderFee)) {
            throw new InputError(`Invalid maxBonderFee "${hop.maxBonderFee}"`)
          }

          if (hop.attestedClaimId) {
            if (!this.utils.isValidBytes32(hop.attestedClaimId)) {
              throw new InputError(`Invalid attestedClaimId "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        const updateFee = await this.getPostClaimFee()
        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.postClaimAndBond(pathId, claimId, to, amountOut, maxBonderFee, attestedClaimId, sourcePool, sourceTotalFraudulent, bonderFee, nextHops)

        return {
          ...txData,
          value: updateFee,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      readdClaim: async ({ pathId, transferDataHash, claimId }: ReaddClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(transferDataHash)) {
          throw new InputError(`Invalid transferDataHash "${transferDataHash}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.readdClaim(pathId, transferDataHash, claimId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      withdrawBonds: async ({ pathId, claimId }: WithdrawBondsInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.withdrawBonds(pathId, claimId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      withdrawClaim: async ({ pathId, claimId, nextHops }: WithdrawClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        if (!nextHops || !Array.isArray(nextHops)) {
          throw new InputError('Invalid nextHops')
        }

        for (const hop of nextHops) {
          if (!this.utils.isValidBytes32(hop.pathId)) {
            throw new InputError(`Invalid pathId "${hop.pathId}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxTotalSent)) {
            throw new InputError(`Invalid maxTotalSent "${hop.maxTotalSent}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxBonderFee)) {
            throw new InputError(`Invalid maxBonderFee "${hop.maxBonderFee}"`)
          }

          if (hop.attestedClaimId) {
            if (!this.utils.isValidBytes32(hop.attestedClaimId)) {
              throw new InputError(`Invalid attestedClaimId "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.withdrawClaim(pathId, claimId, nextHops)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      approveBond: async ({ pathId, amount }: ApproveBondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const path = await this.helpers.getPathInfo({ pathId })
        const tokenAddress = path.token
        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId "${chainId}"`)
        }
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const address = this.getRailsGatewayContractAddress()
        const txData = await tokenContract.populateTransaction.approve(address, amount)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      removeClaim: async ({ pathId, claimId }: RemoveClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const updateFee = await this.getPostClaimFee()
        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.removeClaim(pathId, claimId)

        return {
          ...txData,
          value: updateFee,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      confirmClaim: async ({ pathId, claimId }: ConfirmClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.confirmClaim(pathId, claimId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      claimFeesFromPath: async ({ pathId }: ClaimFeesFromPathInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.claimFeesFromPath(pathId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      distributeClaimedFees: async ({ pathId, account, totalFees, lastClaimId }: DistributeClaimedFeesInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidAddress(account)) {
          throw new InputError(`Invalid account "${account}"`)
        }

        if (!this.utils.isValidNumericValue(totalFees)) {
          throw new InputError(`Invalid totalFees "${totalFees?.toString()}"`)
        }

        if (!this.utils.isValidBytes32(lastClaimId)) {
          throw new InputError(`Invalid lastClaimId "${lastClaimId}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.distributeClaimedFees(pathId, account, totalFees, lastClaimId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },
    }
  }

  get helpers() {
    return {
      getAbi(): typeof RailsGateway__factory.abi {
        return RailsGateway__factory.abi
      },

      getPathInfo: async ({ pathId }: GetPathInfoInput): Promise<Path> => {
        const chainId = this.chainId
        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        const railsPath = await this.getRailsPath(pathId)
        const pathInfo = await railsPath.getPathInfo()
        console.log('hopV2Sdk: pathInfo', pathInfo)

        if (!(this.utils.isValidAddress(pathInfo.token) && this.utils.isValidAddress(pathInfo.counterpartToken))) {
          console.warn('hopV2Sdk: pathInfo', pathInfo, chainId, this.getProvider(chainId))
          throw new InputError(`pathId "${pathId}" is invalid or not found. Check the chainId is correct for that pathId. Chain ID used: ${chainId.toString()}`)
        }

        console.log('hopV2Sdk: pathInfo', pathInfo)
        return {
          pathId,
          ...pathInfo
        }
      },

      getNeedsApprovalForSend: async ({ pathId, amount, account }: GetNeedsApprovalForSendInput): Promise<boolean> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const path = await this.helpers.getPathInfo({ pathId })
        const tokenAddress = path.token
        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId: ${chainId}`)
        }
        console.log('hopV2Sdk: rails approval token', tokenAddress)
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const spender = this.getRailsGatewayContractAddress()
        account ??= (await this.getSignerAddress(chainId))!
        if (!account) {
          throw new InputError('signer not set')
        }
        console.log('hopV2Sdk: rails approval account', account)
        console.log('hopV2Sdk: rails approval spender', spender)
        const approved = await tokenContract.allowance(account, spender)
        return approved.lt(amount)
      },

      getNeedsApprovalForBond: async ({ pathId, amount, account }: GetNeedsApprovalForBondInput): Promise<boolean> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const path = await this.helpers.getPathInfo({ pathId })
        const tokenAddress = path.token
        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId: ${chainId}`)
        }
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const spender = this.getRailsGatewayContractAddress()
        account ??= (await this.getSignerAddress(chainId))!
        if (!account) {
          throw new InputError('signer not set')
        }
        const approved = await tokenContract.allowance(account, spender)
        return approved.lt(amount)
      },

      approveSend: async (input: ApproveSendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> => {
        const txData = await this.populateTransaction.approveSend(input, txOverrides)
        return this.sendTransaction(txData)
      },

      approveBond: async (input: ApproveBondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> => {
        const txData = await this.populateTransaction.approveBond(input, txOverrides)
        return this.sendTransaction(txData)
      },

      getIsPathIdLive: async ({ pathId }: GetIsPathIdLiveInput): Promise<boolean> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        const contract = await this.getRailsGatewayContract()

        try {
          const pathInfo = await this.helpers.getPathInfo({ pathId })

          const pathChainId = pathInfo.chainId.toString()
          const pathToken = pathInfo.token
          const counterpartChainId = pathInfo.counterpartChainId.toString()
          const counterpartToken = pathInfo.counterpartToken

          if (pathChainId !== '0' && counterpartChainId !== '0' && pathToken !== constants.AddressZero && counterpartToken !== constants.AddressZero) {
            return true
          }
        } catch (err: unknown) {
          if (err instanceof InputError) {
            return false
          }

          return this.throwError(err) as boolean
        }

        return false
      },

      getComputedNextHopsHash: (input: GetNextHopsHashInput): string => {
        return RailsGateway.getComputedNextHopsHash(input)
      },

      getComputedTransferDataHash: (input: GetComputedTransferDataHashInput): string => {
        return getComputedTransferDataHash(input)
      },

      getComputedTransferId : ({ previousTransferId, transferDataHash }: GetComputedTransferIdInput): string => {
        if (!this.utils.isValidBytes32(previousTransferId)) {
          throw new InputError(`Invalid previousTransferId "${previousTransferId}"`)
        }
        if (!this.utils.isValidBytes32(transferDataHash)) {
          throw new InputError(`Invalid transferDataHash "${transferDataHash}"`)
        }

        return getComputedTransferId(previousTransferId, transferDataHash)
      },

      decodeSendTxInputData: async (data: string): Promise<DecodedSendInputData> => {
        const iface = new utils.Interface(RailsGateway__factory.abi)
        const decodedData = iface.decodeFunctionData('send', data)
        const { to, amount } = decodedData
        const hops = decodedData.hops.map(({ pathId, maxBonderFee, maxTotalSent, attestedClaimId, updater }: HopStruct) => {
          return { pathId, maxBonderFee, maxTotalSent, attestedClaimId, updater }
        })
        return {
          to,
          amount,
          hops
        }
      },

      decodeBondTxInputData: async (data: string): Promise<DecodedBondInputData> => {
        const iface = new utils.Interface(RailsGateway__factory.abi)
        const decodedData = iface.decodeFunctionData('bond', data)
        const { pathId, claimId, bonderFee } = decodedData
        const nextHops = decodedData.nextHops.map(({ pathId, maxBonderFee, maxTotalSent, attestedClaimId, updater }: HopStruct) => {
          return { pathId, maxBonderFee, maxTotalSent, attestedClaimId, updater }
        })
        return {
          pathId,
          claimId,
          bonderFee,
          nextHops
        }
      },

      getInitialReserveByTokenSymbol: async ({ tokenSymbol }: GetInitialReserveByTokenSymbolInput): Promise<BigNumber> => {
        const initialReserve = this.contractAddresses[this.chainId.toString()].initialReserves[tokenSymbol.toUpperCase()]
        if (!initialReserve) {
          throw new InputError(`Invalid tokenSymbol "${tokenSymbol}", could not find initial reserve`)
        }

        return initialReserve
      },

      getInitialReserveByTokenAddress: async ({ tokenAddress }: GetInitialReserveByTokenAddressInput): Promise<BigNumber> => {
        if (!this.utils.isValidAddress(tokenAddress)) {
          throw new InputError(`Invalid tokenAddress "${tokenAddress}"`)
        }

        const { symbol: tokenSymbol } = await this.helpers.getTokenInfo({ address: tokenAddress })
        return this.helpers.getInitialReserveByTokenSymbol({ tokenSymbol })
      },

      getHeadClaimId: async ({ pathId }: GetHeadClaimIdInput): Promise<string> => {
        const railsPath = await this.getRailsPath(pathId)
        return railsPath.getHeadClaimId()
      },

      getWithdrawableBalance: async ({ pathId, recipient, claimId }: GetWithdrawableBalanceInput): Promise<BigNumber> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidAddress(recipient)) {
          throw new InputError(`Invalid recipient "${recipient}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const contract = await this.getRailsGatewayContract()

        try {
          const balance = await contract.getWithdrawableBalance(pathId, recipient, claimId)
          return balance
        } catch (err: unknown) {
          return this.throwError(err) as BigNumber
        }
      },

      getHopTokenAddress: async (): Promise<string> => {
        const chainId = this.chainId

        const tokenAddress = this.getConfigAddress(chainId, 'hopToken')
        if (!tokenAddress) {
          throw new Error(`HOP token address config not found for chain ${chainId}`)
        }

        return tokenAddress
      },

      getHopBalance: async (address?: string | null): Promise<BigNumber> => {
        const chainId = this.chainId
        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!address) {
          address = await this.getSignerAddress(chainId)
        }
        if (!address) {
          throw new InputError('Address not set')
        }

        const contract = await this.helpers.getHopTokenContract()

        try {
          const hopBalance = await contract.balanceOf(address)
          return hopBalance
        } catch (err: unknown) {
          return this.throwError(err) as BigNumber
        }
      },

      getHopTokenContract: async (): Promise<Contract> => {
        const chainId = this.chainId
        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        const hopTokenAddress = await this.helpers.getHopTokenAddress()
        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId: ${chainId}`)
        }
        const contract = ERC20__factory.connect(hopTokenAddress, provider)
        return contract
      },

      getTokenInfo: async ({ address }: GetTokenInfoInput): Promise<Token> => {
        const chainId = this.chainId
        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidAddress(address)) {
          throw new InputError(`Invalid address "${address}"`)
        }

        const key = `getTokenInfo-${chainId}-${address}`
        const cached = cache.get(key) as Token

        if (cached) {
          return {
            chainId: this.chainId.toString(),
            address: cached.address,
            name: cached.name,
            symbol: cached.symbol,
            decimals: Number(cached.decimals)
          }
        }

        console.log('hopV2Sdk: getTokenInfo', { chainId, address })

        const contract = this.helpers.getTokenContract({ address })

        const [name, symbol, decimals] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals()
        ])

        console.log('hopV2Sdk: getTokenInfo response', { chainId, address, name, symbol, decimals })

        const response = {
          chainId: this.chainId.toString(),
          address: checksumAddress(address),
          name,
          symbol,
          decimals: Number(decimals)
        }

        cache.put(key, response)

        return response
      },

      getTokenContract: ({ address }: GetTokenContractInput): Contract => {
        const chainId = this.chainId
        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidAddress(address)) {
          throw new InputError(`Invalid address "${address}"`)
        }

        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId "${chainId}"`)
        }
        const tokenContract = ERC20__factory.connect(address, provider)
        return tokenContract
      },

      getHasSufficientBalance: async ({ tokenAddress, amount, account }: GetHasSufficientBalanceInput): Promise<boolean> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidAddress(tokenAddress)) {
          throw new InputError(`Invalid tokenAddress "${tokenAddress}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId "${chainId}"`)
        }
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        account ??= (await this.getSignerAddress(chainId))!
        if (!account) {
          throw new InputError('signer not set')
        }
        const balance = await tokenContract.balanceOf(account)
        return balance.lt(amount)
      },

      isValidClaim: async ({ pathId, claimId }: GetIsClaimIdValidInput): Promise<boolean> => {
        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const railsPath = await this.getRailsPath(pathId)
        return railsPath.isValidClaim({ claimId })
      },

      isValidTransfer: async ({ pathId, claimId }: GetIsTransferIdValidInput): Promise<boolean> => {
        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const railsPath = await this.getRailsPath(pathId)
        return railsPath.isValidTransfer({ claimId })
      },

      getTotalSent: async ({ pathId }: GetTotalSentInput): Promise<BigNumber> => {
        const railsPath = await this.getRailsPath(pathId)
        return railsPath.totalSent()
      },

      getBucketIndex: async ({ pathId, claimId }: GetBucketIndexInput): Promise<number> => {
        const railsPath = await this.getRailsPath(pathId)
        const index = await railsPath.getBucketIndex({ claimId })
        return Number(index)
      },

      getSourcePool: async ({ pathId, attestedClaimId }: GetSourcePoolInput): Promise<BigNumber> => {
        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(attestedClaimId)) {
          throw new InputError(`Invalid attestedClaimId "${attestedClaimId}"`)
        }

        const railsPath = await this.getRailsPath(pathId)
        return railsPath.getSourcePool({ attestedClaimId })
      },

      getInitialReserve: async ({ pathId }: GetInitialReserveInput): Promise<BigNumber> => {
        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        const { initialReserve } = await this.helpers.getPathInfo({ pathId })
        return initialReserve
      },

      getClaim: async ({ pathId, claimId }: GetClaimInput): Promise<Claim> => {
        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathid "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimid "${claimId}"`)
        }

        const railsPath = await this.getRailsPath(pathId)

        try {
          const claim = await railsPath.getClaim({ claimId })
          return claim
        } catch (err: unknown) {
          return this.throwError(err) as Claim
        }
      },

      getTransferSentEventFromTransactionHash: async ({ transactionHash }: GetTransferSentEventFromTransactionHashInput): Promise<EthersEventWithDecodedTypes<TransferSent> | null> => {
        const railsPath = await this.getRailsPath()
        return railsPath.getEventFromTransactionHash({ eventName: RailsPathEventName.TransferSent, transactionHash })
      },

      getTransferSentEventFromTransactionReceipt: async ({ receipt }: GetTransferSentEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<TransferSent> | null> => {
        const railsPath = await this.getRailsPath()
        return railsPath.getEventFromTransactionReceipt({ eventName: RailsPathEventName.TransferSent, receipt })
      },

      getClaimBondedEventFromTransactionHash: async ({ transactionHash }: GetClaimBondedEventFromTransactionHashInput): Promise<EthersEventWithDecodedTypes<ClaimBonded> | null> => {
        const railsPath = await this.getRailsPath()
        return railsPath.getEventFromTransactionHash({ eventName: RailsPathEventName.ClaimBonded, transactionHash })
      },

      getClaimBondedEventFromTransactionReceipt: async ({ receipt }: GetClaimBondedEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<ClaimBonded> | null> => {
        const railsPath = await this.getRailsPath()
        return railsPath.getEventFromTransactionReceipt({ eventName: RailsPathEventName.ClaimBonded, receipt })
      },

      estimateGasCostForSend: async ({ from, to, amount, hops = [], fee, gasPrice }: EstimateGasCostForSendInput): Promise<BigNumber> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        try {
          // Get the populated transaction
          const txData = await this.populateTransaction.send({ to, amount, hops, fee })

          // Get the provider
          const provider = this.getProvider(chainId)
          if (!provider) {
            throw new ConfigError(`Provider not found for chainId: ${chainId}`)
          }

          if (!txData.from) {
            txData.from = from ?? await this.getSignerAddress(chainId) ?? '0x' + '1'.repeat(40)
          }

          // Estimate gas limit
          const gasLimit = await provider.estimateGas(txData)

          // Get gas price if not provided
          const currentGasPrice = gasPrice ? BigNumber.from(gasPrice) : await provider.getGasPrice()

          // Calculate total gas cost (gasLimit * gasPrice)
          const gasCost = gasLimit.mul(currentGasPrice)

          return gasCost
        } catch (err: unknown) {
          console.warn('hopV2Sdk: estimateGasCostForSend error', err)
          return this.throwError(err) as BigNumber
        }
      },
    }
  }

  async send (input: SendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const { amount, hops } = input
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const pathId = hops?.[0]?.pathId

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const path = await this.helpers.getPathInfo({ pathId })
    const tokenAddress = path.token
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const signerAddress = (await this.getSignerAddress(chainId)) as string
    const balance = await tokenContract.balanceOf(signerAddress)
    if (balance.lt(amount)) {
      throw new InsufficientBalanceError('Insufficient balance ')
    }

    const address = this.getRailsGatewayContractAddress()
    const approved = await tokenContract.allowance(signerAddress, address)
    if (approved.lt(amount)) {
      throw new InsufficientApprovalError('Insufficient approval')
    }

    const populatedTx = await this.populateTransaction.send(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async bond (input: BondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.bond(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async postClaim (input: PostClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.postClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async removeClaim (input: RemoveClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.removeClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async postClaimAndBond (input: PostClaimAndBondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.postClaimAndBond(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async readdClaim (input: ReaddClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.readdClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async confirmClaim (input: ConfirmClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.confirmClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async withdrawBonds (input: WithdrawBondsInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawBonds(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async withdrawClaim (input: WithdrawClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async claimFeesFromPath (input: ClaimFeesFromPathInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.claimFeesFromPath(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async distributeClaimedFees (input: DistributeClaimedFeesInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.distributeClaimedFees(input, txOverrides)
    return this.sendTransaction(txData)
  }

  /** EVENT HANDLERS */

  getEventNames (): string[] {
    return RailsGateway.getEventNames()
  }

  getEventFilter(eventName: EventName, input: GetEventFilterInput = {}) {
    return eventFetcher.getFilterWithIndexes(input)
  }

  addDecodedTypesToEvent(event: any): EthersEventWithDecodedTypesAndBaseContext<PathInitialized> {
    return RailsGateway.addDecodedTypesToEvent(event, this.chainId)
  }

  addDecodedTypesToEvents(events: any[]): EthersEventWithDecodedTypesAndBaseContext<PathInitialized>[] {
    return RailsGateway.addDecodedTypesToEvents(events, this.chainId)
  }

  /** END EVENT HANDLERS */

  /** STATIC METHODS */

  static getComputedNextHopsHash ({ nextHops }: GetNextHopsHashInput): string {
    if (!nextHops || !Array.isArray(nextHops)) {
      throw new InputError('Invalid nextHops')
    }

    return getComputedNextHopsHash(nextHops.map(hop => {
      return {
        pathId: hop.pathId,
        maxBonderFee: BigNumber.from(hop.maxBonderFee?.toString()),
        maxTotalSent: BigNumber.from(hop.maxTotalSent?.toString()),
        attestedClaimId: hop.attestedClaimId,
        updater: hop.updater
      }
    }))
  }

  static deriveNetwork (chainId: BigNumberish): string {
    chainId = chainId?.toString()
    const networks = [NetworkSlug.Mainnet, NetworkSlug.Sepolia]

    for (const net of networks) {
      const network = getNetwork(net)
      const chain = Object.values(network.chains).find((chain: any) => chain.chainId === chainId)

      if (chain) {
        return net
      }
    }

    throw new Error('could not derive network')
  }

  static getEventNames (): string[] {
    return Object.keys(EventName).sort()
  }

  static getEventSignature (eventName: EventName): string {
    const eventFetchers: Record<EventName, any> = {
      [EventName.PathInitialized]: PathInitializedEventFetcher,
    }

    const EventFetcherClass = eventFetchers[eventName]
    if (!EventFetcherClass) {
      throw new ConfigError(`Event fetcher not found for event name: ${eventName}`)
    }

    const eventFetcher = new EventFetcherClass()
    return eventFetcher.getTopic0()
  }

  static addDecodedTypesToEvent(event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<PathInitialized> {
    const decoded = RailsGateway.addDecodedTypesToEvents([event], chainId)

    return decoded?.[0]
  }

  static addDecodedTypesToEvents(events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<PathInitialized>[] {
    const eventFetchers: Record<EventName, any> = {
      [EventName.PathInitialized]: new PathInitializedEventFetcher(undefined, chainId, undefined, undefined),
    }

    const result = events.map(event => {
      for (const eventName in eventFetchers) {
        const fetcher = (eventFetchers as any)[eventName]
        if (fetcher.getEventNameFromTopic(event.topics[0]) === eventName) {
          return fetcher.addTypedEvent(event, chainId)
        }
      }

      return event
    })

    return result
  }

  /** END STATIC METHODS */
}
