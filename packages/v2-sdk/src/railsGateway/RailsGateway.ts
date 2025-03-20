import { Base, TxOverrides, SignersOrProviders } from '#common/index.js'
import { Addresses } from '#addresses/types.js'
import { BigNumber, BigNumberish, Contract, Signer, providers, utils, constants } from 'ethers'
import { getNetwork, NetworkSlug } from '@hop-protocol/sdk'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'
import { StakingRegistry } from './StakingRegistry.js'
import { TransferSent, HopStruct, TransferSentEventFetcher, TransferSentIndexes } from '#railsGateway/events/TransferSent.js'
import { TransferBonded, TransferBondedEventFetcher, TransferBondedIndexes } from '#railsGateway/events/TransferBonded.js'
import { ClaimPushed, ClaimPushedEventFetcher, ClaimPushedIndexes } from '#railsGateway/events/ClaimPushed.js'
import { ClaimReadded, ClaimReaddedEventFetcher, ClaimReaddedIndexes } from '#railsGateway/events/ClaimReadded.js'
import { ClaimRemoved, ClaimRemovedEventFetcher, ClaimRemovedIndexes } from '#railsGateway/events/ClaimRemoved.js'
import { ClaimWithdrawn, ClaimWithdrawnEventFetcher, ClaimWithdrawnIndexes } from '#railsGateway/events/ClaimWithdrawn.js'
import { PathInitialized, PathInitializedEventFetcher, PathInitializedIndexes } from '#railsGateway/events/PathInitialized.js'
import { ConfigError, InputError, InsufficientBalanceError, InsufficientApprovalError } from '#error/index.js'
import { EthersEventWithDecodedTypes, EthersEventWithDecodedTypesAndBaseContext } from '#events/index.js'
import memcache from 'memory-cache'
import { getComputedNextHopsHash } from '../utils/getComputedNextHopsHash.js'
import { getComputedTransferId } from '../utils/getComputedTransferId.js'
import { getComputedTransferDataHash, GetComputedTransferDataHashInput } from '../utils/getComputedTransferDataHash.js'
import { RailsPath } from './RailsPath.js'

const { getAddress: checksumAddress } = utils

const cache = new memcache.Cache()

export type EventFetcher = TransferSentEventFetcher | TransferBondedEventFetcher | ClaimPushedEventFetcher | ClaimReaddedEventFetcher | ClaimRemovedEventFetcher | ClaimWithdrawnEventFetcher | PathInitializedEventFetcher

export enum EventName {
  TransferSent = 'TransferSent',
  TransferBonded = 'TransferBonded',
  ClaimPushed = 'ClaimPushed',
  ClaimReadded = 'ClaimReadded',
  ClaimRemoved = 'ClaimRemoved',
  ClaimWithdrawn = 'ClaimWithdrawn',
  PathInitialized = 'PathInitialized'
}

export type GetEventsInput = {
  fromBlock: number
  toBlock: number
  eventName: EventName
  fetchTxData?: boolean
}

export type TransferSentEventInput = {
  fromBlock: number
  toBlock: number
  fetchTxData?: boolean
}

export type TransferBondedEventInput = {
  fromBlock: number
  toBlock: number
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

export type PostClaimInput = {
  pathId: string
  transferId: string
  to: string
  amountOut: BigNumberish
  maxBonderFee: BigNumberish
  attestedClaimId: string
  totalSent: BigNumberish
  totalClaims: BigNumberish
  nextHopsHash: string
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

export type GetRemovedBalanceInput = {
  pathId: string
  bonder: string
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

export type GetSendFeeInput = {
  pathId: string
}

export type GetMessageFeeInput = {
  chainId: BigNumberish
}

export type GetClaimFeesFeeInput = {
  chainId: BigNumberish
}

export type GetTotalClaimsInput = {
  pathId: string
}

export type GetTotalClaimsAtClaimIdInput = {
  pathId: string
  claimId: string
}

export type GetTotalConfirmedInput = {
  pathId: string
}

export type GetTransferSentEventFromTransactionReceiptInput = {
  receipt: providers.TransactionReceipt
}

export type GetTransferSentEventFromTransactionHashInput = {
  transactionHash: string
}

export type GetTransferSentEventFromTransferIdInput = {
  transferId: string
}

export type GetTransferSentEventsFromPathIdInput = {
  pathId: string
}

export type GetTransferBondedEventFromTransactionReceiptInput = {
  receipt: providers.TransactionReceipt
}

export type GetTransferBondedEventFromTransactionHashInput = {
  transactionHash: string
}

export type GetTransferBondedEventFromTransferIdInput = {
  transferId: string
  fromBlock?: number
}

export type GetTokenInfoInput = {
  address: string
}

export type GetTokenContractInput = {
  address: string
}

export type GetEventFilterInput = TransferSentIndexes | TransferBondedIndexes | ClaimPushedIndexes | ClaimReaddedIndexes | ClaimRemovedIndexes | ClaimWithdrawnIndexes

export type GetTransferSentEventFilterInput = TransferSentIndexes

export type GetTransferBondedEventFilterInput = TransferBondedIndexes

export type GetClaimPushedEventFilterInput = ClaimPushedIndexes

export type GetClaimReaddedEventFilterInput = ClaimReaddedIndexes

export type GetClaimRemovedEventFilterInput = ClaimRemovedIndexes

export type GetClaimWithdrawnEventFilterInput = ClaimWithdrawnIndexes

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

export type GetIsTransferBondedInput = {
  transferId: string
}

export type GetIsTransferClaimedInput = {
  transferId: string
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

export type DistributeExcessFeesInput = {
  pathId: string
  recipients: string[]
  amounts: BigNumberish[]
}

export type GetTransferDataHashInput = {
  to: string
  amount: BigNumberish
  maxBonderFee?: BigNumberish
  attestedClaimId?: string
  sourcePool: BigNumberish
  hops: HopStructInput[]
}

export type GetBucketInput = {
  pathId: string
  index: BigNumberish
}

export type Bucket = {
  completedAt: BigNumber
  finalClaimId: string
  totalAttested: BigNumber
  maxConfirmed: BigNumber
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

export type IsValidClaimInput = {
  pathId: string
  claimId: string
}

export type IsValidTransferInput = {
  pathId: string
  claimId: string
}

export type SetFeePriceInput = {
  chainId: BigNumberish
  feePrice: BigNumberish
}

export type SetFeePricesInput = {
  chainIds: BigNumberish[]
  feePrices: BigNumberish[]
}

export type GetTokenVaultInput = {
  pathId: string
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

export type GetClaimIdInput = {
  pathId: string
  index: BigNumberish
}

export type GetCounterpartChainIdInput = {
  pathId: string
}

export type GetFeeVaultInput = {
  chainId: BigNumberish
}

export type GetHardConfirmedBucketIndexInput = {
  pathId: string
}

export type GetHardConfirmedClaimIdInput = {
  pathId: string
}

export type GetLastBondedClaimIdInput = {
  pathId: string
  bonder: string
}

export type GetTotalWithdrawableAtClaimIdInput = {
  pathId: string
  bonder: string
  claimId: string
}

export type GetWithdrawnInput = {
  pathId: string
  bonder: string
}

export type GetTransferIndexInput = {
  pathId: string
  transferId: string
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

export type SetFeeOracleInput = {
  newFeeOracle: string
}

export type SetSendFeeGasInput = {
  gas: BigNumberish
}

export type SetStakingRegistryInput = {
  newStakingRegistry: string
}

export type SetUpdateFeeGasInput = {
  gas: BigNumberish
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

export type PostAndBondInput = {
  pathId: string
  claimId: string
  to: string
  amountOut: BigNumberish
  maxBonderFee: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
  bonderFee: BigNumberish
  nextHops: HopStructInput[]
}

export type PostAndWithdrawInput = {
  pathId: string
  claimId: string
  to: string
  amountOut: BigNumberish
  maxBonderFee: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
  bonderFee: BigNumberish
  nextHops: HopStructInput[]
}

export type PushClaimInput = {
  pathId: string
  claimId: string
  to: string
  amount: BigNumberish
  maxBonderFee: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
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

export type GetTransferIdInput = {
  pathId: string
  index: BigNumberish
}

export type CounterpartChainIdsInput = {
  pathId: string
}

export type GetPathInput = {
  pathId: string
}

export type PushClaimAndBondInput = {
  pathId: string
  claimId: string
  to: string
  amountOut: BigNumberish
  maxBonderFee: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
  bonderFee: BigNumberish
  nextHops: HopStructInput[]
}

export type PushClaimAndWithdrawInput = {
  pathId: string
  claimId: string
  to: string
  amountOut: BigNumberish
  maxBonderFee: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
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

export type GetPathInitializedEventFilterInput = {

}

export type RailsGatewayConstructorInput = {
  network?: string
  gasPriceMultiplier?: number
  signersOrProviders?: SignersOrProviders
  contractAddresses?: Addresses
  chainId: BigNumberish
  signerOrProvider?: Signer | providers.Provider
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

  async getPushClaimFee (): Promise<BigNumber> {
    const contract = await this.getRailsGatewayContract()

    try {
      const fee = await contract.getPushClaimFee()
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

  async getTransferDataHash ({ to, amount, maxBonderFee, attestedClaimId, sourcePool, hops }: GetTransferDataHashInput): Promise<string> {
    maxBonderFee ??= hops[0].maxBonderFee
    attestedClaimId ??= hops[0].attestedClaimId
    return getComputedTransferDataHash({ to, amount, maxBonderFee, attestedClaimId, sourcePool, hops })
  }

  async getNextHopsHash ({ nextHops }: GetNextHopsHashInput): Promise<string> {
    return RailsGateway.getComputedNextHopsHash({ nextHops })
  }

  getStakingRegistry(): StakingRegistry {
    return new StakingRegistry({
      chainId: this.chainId,
      contractAddresses: this.contractAddresses,
      signersOrProviders: this.signersOrProviders,
      network: this.network
    })
  }

  async getRailsPath (pathId: string): Promise<RailsPath> {
    const address = await this.getPath({ pathId })
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

      pushClaim: async ({ pathId, claimId, to, amount, maxBonderFee, attestedClaimId, sourcePool, nextHopsHash }: PushClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
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

        if (!this.utils.isValidBytes32(nextHopsHash)) {
          throw new InputError(`Invalid nextHopsHash "${nextHopsHash}"`)
        }

        const updateFee = await this.getPushClaimFee()
        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.pushClaim(pathId, claimId, to, amount, maxBonderFee, attestedClaimId, sourcePool, nextHopsHash)

        return {
          ...txData,
          value: updateFee,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      pushClaimAndBond: async ({ pathId, claimId, to, amountOut, maxBonderFee, attestedClaimId, sourcePool, bonderFee, nextHops }: PushClaimAndBondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
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

        const updateFee = await this.getPushClaimFee()
        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.pushClaimAndBond(pathId, claimId, to, amountOut, maxBonderFee, attestedClaimId, sourcePool, bonderFee, nextHops)

        return {
          ...txData,
          value: updateFee,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      pushClaimAndWithdraw: async ({ pathId, claimId, to, amountOut, maxBonderFee, attestedClaimId, sourcePool, nextHops }: PushClaimAndWithdrawInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
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

        const updateFee = await this.getPushClaimFee()
        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.pushClaimAndWithdraw(pathId, claimId, to, amountOut, maxBonderFee, attestedClaimId, sourcePool, nextHops)

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

        const updateFee = await this.getPushClaimFee()
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

      getIsTransferBonded: async ({ transferId }: GetIsTransferBondedInput): Promise<boolean> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(transferId)) {
          throw new InputError(`Invalid transferId "${transferId}"`)
        }

        // TODO: call contract state once it's available
        return false
      },

      getIsTransferClaimed: async ({ transferId }: GetIsTransferClaimedInput): Promise<boolean> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(transferId)) {
          throw new InputError(`Invalid transferId "${transferId}"`)
        }

        // TODO: call contract state once it's available
        return false
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
        const hops = decodedData.hops.map(({ pathId, maxBonderFee, maxTotalSent, attestedClaimId }: HopStruct) => {
          return { pathId, maxBonderFee, maxTotalSent, attestedClaimId }
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
        const nextHops = decodedData.nextHops.map(({ pathId, maxBonderFee, maxTotalSent, attestedClaimId }: HopStruct) => {
          return { pathId, maxBonderFee, maxTotalSent, attestedClaimId }
        })
        return {
          pathId,
          claimId,
          bonderFee,
          nextHops
        }
      },

      getInitialReserveByTokenSymbol: async ({ tokenSymbol }: GetInitialReserveByTokenSymbolInput): Promise<BigNumber> => {
        if (tokenSymbol === 'MOCK') {
          return utils.parseUnits(10_000_000_000..toString(), 18)
        } else if (tokenSymbol === 'USDC') {
          return utils.parseUnits(10_000_000_000..toString(), 6)
        }
        return BigNumber.from(0)
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

      getIsClaimIdValid: async ({ pathId, claimId }: GetIsClaimIdValidInput): Promise<boolean> => {
        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const railsPath = await this.getRailsPath(pathId)
        return railsPath.isValidClaim({ claimId })
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
      }
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

  async pushClaim (input: PushClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.pushClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async removeClaim (input: RemoveClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.removeClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async pushClaimAndBond (input: PushClaimAndBondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.pushClaimAndBond(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }


  async pushClaimAndWithdraw (input: PushClaimAndWithdrawInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.pushClaimAndWithdraw(input, txOverrides)
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

  getEventFetcher(eventName: EventName, address: string = this.getRailsGatewayContractAddress()): any { // TODO: return type
    const chainId = this.chainId
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${chainId}`)
    }

    const eventFetcher: Record<EventName, any> = {
      [EventName.TransferSent]: TransferSentEventFetcher,
      [EventName.TransferBonded]: TransferBondedEventFetcher,
      [EventName.ClaimPushed]: ClaimPushedEventFetcher,
      [EventName.PathInitialized]: PathInitializedEventFetcher,
      [EventName.ClaimReadded]: ClaimReaddedEventFetcher,
      [EventName.ClaimRemoved]: ClaimRemovedEventFetcher,
      [EventName.ClaimWithdrawn]: ClaimWithdrawnEventFetcher,
    }

    const EventFetcherClass = eventFetcher[eventName]
    if (!EventFetcherClass) {
      throw new ConfigError(`Event fetcher not found for event name: ${eventName}`)
    }

    return new EventFetcherClass(provider, chainId, this.batchBlocks, address)
  }

  async #getEvents ({ fromBlock, toBlock, eventName, fetchTxData = false }: GetEventsInput) {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && !this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid fromBlock "${toBlock}"`)
    }

    const provider = this.getProvider(chainId)
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

    console.log('hopV2Sdk: getEvents', fromBlock, toBlock, eventName)

    if (eventName == EventName.PathInitialized) {
      const eventFetcher = this.getEventFetcher(eventName)
      return eventFetcher.getEventsForRange(fromBlock, toBlock, fetchTxData)
    }

    // Get all RailsPath addresses for this chain
    const railsPathAddresses = await this.getAllRailsPathAddresses()

    console.log('hopV2Sdk: railsPathAddresses', railsPathAddresses)

    // Create event fetchers for each RailsPath address
    const eventFetchers = railsPathAddresses.map((address: string) =>
      this.getEventFetcher(eventName, address)
    )

    // Fetch events from all RailsPath contracts
    const eventsPromises = eventFetchers.map((fetcher: any) =>
      fetcher.getEventsForRange(fromBlock, toBlock, fetchTxData)
    )

    // Combine all events
    const eventsArrays = await Promise.all(eventsPromises)
    const allEvents = eventsArrays.flat()

    // Sort events by block number and log index
    allEvents.sort((a: any, b: any) => {
      if (a.blockNumber === b.blockNumber) {
        return a.logIndex - b.logIndex
      }
      return a.blockNumber - b.blockNumber
    })

    return allEvents
  }

  // Update the getAllRailsPathAddresses method
  async getAllRailsPathAddresses(): Promise<string[]> {
    const CHAIN_PATH_IDS: Record<string, Record<string, string[]>> = {
      '11155111': { // Sepolia
        'mock': [
          '0x548cef5cfe8ecabab46bfec342ef722f201a04630dc7f9ae2327dd66d916fa3f', // to 42069
          '0x5bc2ef90735775e882cfbd8d1a435d9d857cd4b44c30c0c00fb7d8188d0c61a8', // to 11155420
          '0x86649d3e4cb1d29f562051ebf7bcc10ea6c69853f76064aa4674c933ec7a53b2'  // to 84532
        ],
        'usdc': [
          '0xb11d88d122abd5a39e0015594ed52eb5e161a10f74430c032a692c0ddbcce6ba', // to 42069
          '0x3541ab0d01eacfd4bf63a96f8651aef9db4396ab9944d3acada716c2378cb07f', // to 11155420
          //'0x1da48538be012466f4dd90504bb95a5b22e96796fd4d78b4fde7a4ee9dc4aa8'   // to 84532
        ]
      },
      '42069': { // Base Sepolia
        'mock': [
          '0x548cef5cfe8ecabab46bfec342ef722f201a04630dc7f9ae2327dd66d916fa3f', // to 11155111
          '0xd5c426055ea754595f988b34f49a5c9db2ced10a3b33b3a5317e6e3b39892582', // to 11155420
          '0x4a216377b73851e314b778e848aa68391344794677f9853def38e30f7795c262'  // to 84532
        ],
        'usdc': [
          '0xb11d88d122abd5a39e0015594ed52eb5e161a10f74430c032a692c0ddbcce6ba', // to 11155111
          '0xf62ba159a0d86df28c37f212a589d45ea6a507a286c21441e509914afd2f9470', // to 11155420
          '0xad7a8a28d4cef1b36c7fbd1ee514311fc4bb66107617e9bb6056644faa114bfe'  // to 84532
        ]
      },
      '11155420': { // Optimism Sepolia
        'mock': [
          '0x5bc2ef90735775e882cfbd8d1a435d9d857cd4b44c30c0c00fb7d8188d0c61a8', // to 11155111
          '0xd5c426055ea754595f988b34f49a5c9db2ced10a3b33b3a5317e6e3b39892582', // to 42069
          '0x50f1df98039398d91f00794eb591408d100c9f699488086e1986ee92d5c93346'  // to 84532
        ],
        'usdc': [
          '0x3541ab0d01eacfd4bf63a96f8651aef9db4396ab9944d3acada716c2378cb07f', // to 11155111
          '0xf62ba159a0d86df28c37f212a589d45ea6a507a286c21441e509914afd2f9470', // to 42069
          '0xd2d47e6d4c2b36ee88f1db857ba436161744b1348b41bb48ef4457a830ea3c18'  // to 84532
        ]
      },
      '84532': { // Base Sepolia
        'mock': [
          '0x86649d3e4cb1d29f562051ebf7bcc10ea6c69853f76064aa4674c933ec7a53b2', // to 11155111
          '0x4a216377b73851e314b778e848aa68391344794677f9853def38e30f7795c262', // to 42069
          '0x50f1df98039398d91f00794eb591408d100c9f699488086e1986ee92d5c93346'  // to 11155420
        ],
        'usdc': [
          // '0x1da48538be012466f4dd90504bb95a5b22e96796fd4d78b4fde7a4ee9dc4aa8',   // to 11155111
          '0xad7a8a28d4cef1b36c7fbd1ee514311fc4bb66107617e9bb6056644faa114bfe', // to 42069
          '0xd2d47e6d4c2b36ee88f1db857ba436161744b1348b41bb48ef4457a830ea3c18'  // to 11155420
        ]
      }
    }

    const chainId = this.chainId.toString()
    const addresses = new Set<string>()

    // Get path IDs for the current chain
    const chainPathIds = CHAIN_PATH_IDS[chainId]
    if (!chainPathIds) {
      throw new ConfigError(`No path IDs configured for chain ID ${chainId}`)
    }

    // Get RailsPath addresses for all path IDs
    for (const tokenPathIds of Object.values(chainPathIds)) {
      for (const pathId of tokenPathIds) {
        try {
          const railsPath = await this.getRailsPath(pathId)
          const address = await railsPath.getRailsPathContractAddress()
          console.log('hopV2Sdk: address', address)
          if (address && address !== constants.AddressZero) {
            addresses.add(address)
          }
        } catch (err) {
          console.warn(`Failed to get RailsPath address on chain ${chainId} for pathId ${pathId}:`, err)
          continue
        }
      }
    }

    const addressArray = Array.from(addresses)
    if (addressArray.length === 0) {
      throw new ConfigError(`No RailsPath addresses found for chain ID ${chainId}`)
    }

    return addressArray
  }

  async getTransferSentEventFromTransactionReceipt ({ receipt }: GetTransferSentEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<TransferSent> | null> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!receipt) {
      throw new InputError('receipt is required')
    }
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }
    const address = this.getRailsGatewayContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = this.getEventFetcher(EventName.TransferSent)
    const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt)
    return events?.[0] ?? null
  }

  async getTransferSentEventFromTransactionHash ({ transactionHash }: GetTransferSentEventFromTransactionHashInput): Promise<EthersEventWithDecodedTypes<TransferSent> | null> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }
    const receipt = await provider.getTransactionReceipt(transactionHash)

    if (!receipt) {
      return null
    }

    return this.getTransferSentEventFromTransactionReceipt({ receipt })
  }

  async getTransferSentEventFromTransferId ({ transferId }: GetTransferSentEventFromTransferIdInput): Promise<EthersEventWithDecodedTypes<TransferSent>> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const address = this.getRailsGatewayContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${chainId}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.TransferSent)
    const filter = eventFetcher.getTransferIdFilter(transferId)
    const fromBlock = 0
    const toBlock = await provider.getBlockNumber()
    const events = await eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock, { returnOnFirstMatch: true })
    return events?.[0] ?? null
  }

  async getTransferSentEventsFromPathId ({ pathId }: GetTransferSentEventsFromPathIdInput): Promise<EthersEventWithDecodedTypes<TransferSent>[]> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const address = this.getRailsGatewayContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${chainId}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.TransferSent)
    const filter = eventFetcher.getPathIdFilter(pathId)
    const fromBlock = 0
    const toBlock = await provider.getBlockNumber()
    const events = await eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock)
    return events
  }

  async getTransferBondedEventFromTransactionReceipt ({ receipt }: GetTransferBondedEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<TransferBonded> | null> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!receipt) {
      throw new InputError('receipt is required')
    }
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }
    const address = this.getRailsGatewayContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = this.getEventFetcher(EventName.TransferBonded)
    const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt)
    return events?.[0] ?? null
  }

  async getTransferBondedEventFromTransactionHash ({ transactionHash }: GetTransferBondedEventFromTransactionHashInput): Promise<EthersEventWithDecodedTypes<TransferBonded> | null> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }
    const receipt = await provider.getTransactionReceipt(transactionHash)

    if (!receipt) {
      return null
    }

    return this.getTransferBondedEventFromTransactionReceipt({ receipt })
  }

  async getTransferBondedEventFromTransferId ({ transferId, fromBlock = 0 }: GetTransferBondedEventFromTransferIdInput): Promise<EthersEventWithDecodedTypes<TransferBonded> | null> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const address = this.getRailsGatewayContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${chainId}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.TransferBonded)
    const filter = eventFetcher.getClaimIdFilter(transferId)
    const toBlock = await provider.getBlockNumber()
    const events = await eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock, { returnOnFirstMatch: true })
    return events?.[0] ?? null
  }

  getEventFilter(eventName: EventName, input: GetEventFilterInput = {}) {
    if (eventName == EventName.TransferSent) {
      return this.getTransferSentEventFilter(input)
    }

    if (eventName == EventName.TransferBonded) {
      return this.getTransferBondedEventFilter(input)
    }

    if (eventName == EventName.ClaimPushed) {
      return this.getClaimPushedEventFilter(input)
    }

    if (eventName == EventName.ClaimReadded) {
      return this.getClaimReaddedEventFilter(input)
    }

    if (eventName == EventName.ClaimRemoved) {
      return this.getClaimRemovedEventFilter(input)
    }

    if (eventName == EventName.ClaimWithdrawn) {
      return this.getClaimWithdrawnEventFilter(input)
    }

    if (eventName == EventName.PathInitialized) {
      return this.getPathInitializedEventFilter(input)
    }

    throw new InputError(`event name ${eventName} not found`)
  }

  getPathInitializedEventFilter(input: GetPathInitializedEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.PathInitialized)
    return eventFetcher.getFilterWithIndexes(input)
  }

  getTransferSentEventFilter(input: GetTransferSentEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.TransferSent)
    return eventFetcher.getFilterWithIndexes(input)
  }

  getTransferBondedEventFilter(input: GetTransferBondedEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.TransferBonded)
    return eventFetcher.getFilterWithIndexes(input)
  }

  getClaimPushedEventFilter(input: GetClaimPushedEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.ClaimPushed)
    return eventFetcher.getFilterWithIndexes(input)
  }

  getClaimReaddedEventFilter(input: GetClaimReaddedEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.ClaimReadded)
    return eventFetcher.getFilterWithIndexes(input)
  }

  getClaimRemovedEventFilter(input: GetClaimRemovedEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.ClaimRemoved)
    return eventFetcher.getFilterWithIndexes(input)
  }

  getClaimWithdrawnEventFilter(input: GetClaimWithdrawnEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.ClaimWithdrawn)
    return eventFetcher.getFilterWithIndexes(input)
  }

  async getTransferSentEvents (input: TransferSentEventInput): Promise<EthersEventWithDecodedTypes<TransferSent>[]> {
    return this.#getEvents({ ...input, eventName: EventName.TransferSent })
  }

  async *getTransferSentEventsInBatches({ fromBlock, toBlock }: TransferSentEventInput) {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && !this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const latestBlock = await provider.getBlockNumber()
    const resolvedToBlock = toBlock ?? latestBlock
    let resolvedFromBlock = fromBlock ?? (latestBlock - 1000)

    if (resolvedFromBlock < 0) {
      resolvedFromBlock = resolvedToBlock + resolvedFromBlock
    }

    const eventFetcher = this.getEventFetcher(EventName.TransferSent)
    const eventsGenerator = eventFetcher.getEventsForRangeAsGenerator(resolvedFromBlock, resolvedToBlock)

    for await (const events of eventsGenerator) {
      yield events
    }
  }

  async getTransferBondedEvents (input: TransferBondedEventInput): Promise<EthersEventWithDecodedTypes<TransferBonded>[]> {
    return this.#getEvents({ ...input, eventName: EventName.TransferBonded })
  }

  addDecodedTypesToPathInitializedEvents (events: any[]): EthersEventWithDecodedTypes<PathInitialized>[] {
    return RailsGateway.addDecodedTypesToPathInitializedEvents(events, this.chainId)
  }

  addDecodedTypesToTransferSentEvents (events: any[]): EthersEventWithDecodedTypes<TransferSent>[] {
    return RailsGateway.addDecodedTypesToTransferSentEvents(events, this.chainId)
  }

  addDecodedTypesToTransferBondedEvents (events: any[]): EthersEventWithDecodedTypes<TransferBonded>[] {
    return RailsGateway.addDecodedTypesToTransferBondedEvents(events, this.chainId)
  }

  addDecodedTypesToClaimPushedEvents (events: any[]): EthersEventWithDecodedTypes<ClaimPushed>[] {
    return RailsGateway.addDecodedTypesToClaimPushedEvents(events, this.chainId)
  }

  addDecodedTypesToClaimReaddedEvents (events: any[]): EthersEventWithDecodedTypes<ClaimReadded>[] {
    return RailsGateway.addDecodedTypesToClaimReaddedEvents(events, this.chainId)
  }

  addDecodedTypesToClaimRemovedEvents (events: any[]): EthersEventWithDecodedTypes<ClaimRemoved>[] {
    return RailsGateway.addDecodedTypesToClaimRemovedEvents(events, this.chainId)
  }

  addDecodedTypesToClaimWithdrawnEvents (events: any[]): EthersEventWithDecodedTypes<ClaimWithdrawn>[] {
    return RailsGateway.addDecodedTypesToClaimWithdrawnEvents(events, this.chainId)
  }

  addDecodedTypesToEvent(event: any): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPushed | ClaimReadded | ClaimRemoved | ClaimWithdrawn> {
    return RailsGateway.addDecodedTypesToEvent(event, this.chainId)
  }

  addDecodedTypesToEvents(events: any[]): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPushed | ClaimReadded | ClaimRemoved | ClaimWithdrawn>[] {
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
        attestedClaimId: hop.attestedClaimId
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

  static getTransferSentEventSignature (): string {
    const eventFetcher = new TransferSentEventFetcher()
    return eventFetcher.getTopic0()
  }

  static getTransferBondedEventSignature (): string {
    const eventFetcher = new TransferBondedEventFetcher()
    return eventFetcher.getTopic0()
  }

  static addDecodedTypesToEvent(event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPushed | ClaimReadded | ClaimRemoved | ClaimWithdrawn> {
    const decoded = RailsGateway.addDecodedTypesToEvents([event], chainId)

    return decoded?.[0]
  }

  static addDecodedTypesToEvents(events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPushed | ClaimReadded | ClaimRemoved | ClaimWithdrawn>[] {
    const transferSentEventFetcher = new TransferSentEventFetcher()
    const transferBondedEventFetcher = new TransferBondedEventFetcher()
    const claimPostedEventFetcher = new ClaimPushedEventFetcher()
    const claimReaddedEventFetcher = new ClaimReaddedEventFetcher()
    const claimRemovedEventFetcher = new ClaimRemovedEventFetcher()
    const claimWithdrawnEventFetcher = new ClaimWithdrawnEventFetcher()
    const result = events.map(event => {
      if (transferSentEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.TransferSent) {
        return RailsGateway.addDecodedTypesToTransferSentEvent(event, chainId)
      }

      if (transferBondedEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.TransferBonded) {
        return RailsGateway.addDecodedTypesToTransferBondedEvent(event, chainId)
      }

      if (claimPostedEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.ClaimPushed) {
        return RailsGateway.addDecodedTypesToClaimPushedEvent(event, chainId)
      }

      if (claimReaddedEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.ClaimReadded) {
        return RailsGateway.addDecodedTypesToClaimReaddedEvent(event, chainId)
      }

      if (claimRemovedEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.ClaimRemoved) {
        return RailsGateway.addDecodedTypesToClaimRemovedEvent(event, chainId)
      }

      if (claimWithdrawnEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.ClaimWithdrawn) {
        return RailsGateway.addDecodedTypesToClaimWithdrawnEvent(event, chainId)
      }

      return event
    })

    return result
  }

  static addDecodedTypesToPathInitializedEvent (event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<PathInitialized> {
    const eventFetcher = new PathInitializedEventFetcher(undefined, chainId)
    return eventFetcher.addTypedEvent(event)
  }

  static addDecodedTypesToTransferSentEvent (event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferSent> {
    const eventFetcher = new TransferSentEventFetcher(undefined, chainId)
    return eventFetcher.addTypedEvent(event)
  }

  static addDecodedTypesToTransferBondedEvent (event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferBonded> {
    const eventFetcher = new TransferBondedEventFetcher(undefined, chainId)
    return eventFetcher.addTypedEvent(event)
  }

  static addDecodedTypesToClaimPushedEvent (event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<ClaimPushed> {
    const eventFetcher = new ClaimPushedEventFetcher(undefined, chainId)
    return eventFetcher.addTypedEvent(event)
  }

  static addDecodedTypesToClaimReaddedEvent (event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<ClaimReadded> {
    const eventFetcher = new ClaimReaddedEventFetcher(undefined, chainId)
    return eventFetcher.addTypedEvent(event)
  }

  static addDecodedTypesToClaimRemovedEvent (event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<ClaimRemoved> {
    const eventFetcher = new ClaimRemovedEventFetcher(undefined, chainId)
    return eventFetcher.addTypedEvent(event)
  }

  static addDecodedTypesToClaimWithdrawnEvent (event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<ClaimWithdrawn> {
    const eventFetcher = new ClaimWithdrawnEventFetcher(undefined, chainId)
    return eventFetcher.addTypedEvent(event)
  }

  static addDecodedTypesToPathInitializedEvents (events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<PathInitialized>[] {
    const eventFetcher = new PathInitializedEventFetcher(undefined, chainId)
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  static addDecodedTypesToTransferSentEvents (events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferSent>[] {
    const eventFetcher = new TransferSentEventFetcher(undefined, chainId)
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  static addDecodedTypesToTransferBondedEvents (events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferBonded>[] {
    const eventFetcher = new TransferBondedEventFetcher(undefined, chainId)
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  static addDecodedTypesToClaimPushedEvents (events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<ClaimPushed>[] {
    const eventFetcher = new ClaimPushedEventFetcher(undefined, chainId)
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  static addDecodedTypesToClaimReaddedEvents (events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<ClaimReadded>[] {
    const eventFetcher = new ClaimReaddedEventFetcher(undefined, chainId)
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  static addDecodedTypesToClaimRemovedEvents (events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<ClaimRemoved>[] {
    const eventFetcher = new ClaimRemovedEventFetcher(undefined, chainId)
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  static addDecodedTypesToClaimWithdrawnEvents (events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<ClaimWithdrawn>[] {
    const eventFetcher = new ClaimWithdrawnEventFetcher(undefined, chainId)
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  /** END STATIC METHODS */
}
