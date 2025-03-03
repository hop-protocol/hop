import { Base, TxOverrides, SignersOrProviders } from '#common/index.js'
import { Addresses } from '#addresses/types.js'
import { BigNumber, BigNumberish, Contract, Signer, providers, utils, constants } from 'ethers'
import { getNetwork, NetworkSlug } from '@hop-protocol/sdk'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'
import { StakingRegistry } from './StakingRegistry.js'
import { TransferSent, HopStruct, TransferSentEventFetcher, TransferSentIndexes } from '#railsGateway/events/TransferSent.js'
import { TransferBonded, TransferBondedEventFetcher, TransferBondedIndexes } from '#railsGateway/events/TransferBonded.js'
import { ClaimPosted, ClaimPostedEventFetcher, ClaimPostedIndexes } from '#railsGateway/events/ClaimPosted.js'
import { ClaimReadded, ClaimReaddedEventFetcher, ClaimReaddedIndexes } from '#railsGateway/events/ClaimReadded.js'
import { ClaimRemoved, ClaimRemovedEventFetcher, ClaimRemovedIndexes } from '#railsGateway/events/ClaimRemoved.js'
import { ConfigError, InputError, InsufficientBalanceError, InsufficientApprovalError } from '#error/index.js'
import { EthersEventWithDecodedTypes, EthersEventWithDecodedTypesAndBaseContext } from '#events/index.js'
import memcache from 'memory-cache'
import { getComputedNextHopsHash } from '../utils/getComputedNextHopsHash.js'
import { getComputedTransferId } from '../utils/getComputedTransferId.js'
import { getComputedTransferDataHash, GetComputedTransferDataHashInput } from '../utils/getComputedTransferDataHash.js'

const { getAddress: checksumAddress } = utils

const cache = new memcache.Cache()

export type EventFetcher = TransferSentEventFetcher | TransferBondedEventFetcher | ClaimPostedEventFetcher | ClaimReaddedEventFetcher | ClaimRemovedEventFetcher

export enum EventName {
  TransferSent = 'TransferSent',
  TransferBonded = 'TransferBonded',
  ClaimPosted = 'ClaimPosted',
  ClaimReadded = 'ClaimReadded',
  ClaimRemoved = 'ClaimRemoved',
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

export type GetFeePriceInput = {
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

export type GetEventFilterInput = TransferSentIndexes | TransferBondedIndexes | ClaimPostedIndexes | ClaimReaddedIndexes | ClaimRemovedIndexes

export type GetTransferSentEventFilterInput = TransferSentIndexes

export type GetTransferBondedEventFilterInput = TransferBondedIndexes

export type GetClaimPostedEventFilterInput = ClaimPostedIndexes

export type GetClaimReaddedEventFilterInput = ClaimReaddedIndexes

export type GetClaimRemovedEventFilterInput = ClaimRemovedIndexes

export type Token = {
  chainId: string
  address: string
  name: string
  symbol: string
  decimals: number
}

export type HopStructInput = {
  pathId: string
  maxBonderFee: BigNumberish
  maxTotalSent: BigNumberish
  attestedClaimId: string
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
  amountOut: BigNumberish
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

  async setFeeOracle ({ newFeeOracle }: SetFeeOracleInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidAddress(newFeeOracle)) {
      throw new InputError(`Invalid newFeeOracle "${newFeeOracle}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const tx = await contract.setFeeOracle(newFeeOracle)

    return tx
  }

  async setSendFeeGas({ gas }: SetSendFeeGasInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidNumericValue(gas)) {
      throw new InputError(`Invalid gas "${gas}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const tx = await contract.setSendFeeGas(gas)

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

  async setUpdateFeeGas({ gas }: SetUpdateFeeGasInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidNumericValue(gas)) {
      throw new InputError(`Invalid gas "${gas}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const tx = await contract.setUpdateFeeGas(gas)

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

  getEventNames (): string[] {
    return RailsGateway.getEventNames()
  }

  getEventFetcher(eventName: EventName): any { // TODO: return type
    const chainId = this.chainId
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const address = this.getRailsGatewayContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${chainId}`)
    }

    const eventFetcher: Record<EventName, any> = {
      [EventName.TransferSent]: TransferSentEventFetcher,
      [EventName.TransferBonded]: TransferBondedEventFetcher,
      [EventName.ClaimPosted]: ClaimPostedEventFetcher,
      [EventName.ClaimReadded]: ClaimReaddedEventFetcher,
      [EventName.ClaimRemoved]: ClaimRemovedEventFetcher,
    }

    const EventFetcherClass = eventFetcher[eventName]
    if (!EventFetcherClass) {
      throw new ConfigError(`Event fetcher not found for event name: ${eventName}`)
    }

    return new EventFetcherClass(provider, chainId, this.batchBlocks, address)
  }

  getEventFilter(eventName: EventName, input: GetEventFilterInput = {}) {
    if (eventName == EventName.TransferSent) {
      return this.getTransferSentEventFilter(input)
    }

    if (eventName == EventName.TransferBonded) {
      return this.getTransferBondedEventFilter(input)
    }

    if (eventName == EventName.ClaimPosted) {
      return this.getClaimPostedEventFilter(input)
    }

    if (eventName == EventName.ClaimReadded) {
      return this.getClaimReaddedEventFilter(input)
    }

    if (eventName == EventName.ClaimRemoved) {
      return this.getClaimRemovedEventFilter(input)
    }

    throw new InputError(`event name ${eventName} not found`)
  }

  getTransferSentEventFilter(input: GetTransferSentEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.TransferSent)
    return eventFetcher.getFilterWithIndexes(input)
  }

  getTransferBondedEventFilter(input: GetTransferBondedEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.TransferBonded)
    return eventFetcher.getFilterWithIndexes(input)
  }

  getClaimPostedEventFilter(input: GetClaimPostedEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.ClaimPosted)
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

  addDecodedTypesToEvent(event: any): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPosted | ClaimReadded | ClaimRemoved> {
    return RailsGateway.addDecodedTypesToEvent(event, this.chainId)
  }

  addDecodedTypesToEvents(events: any[]): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPosted | ClaimReadded | ClaimRemoved>[] {
    return RailsGateway.addDecodedTypesToEvents(events, this.chainId)
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

    const eventFetcher = this.getEventFetcher(eventName)
    return eventFetcher.getEventsForRange(fromBlock, toBlock, fetchTxData)
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

  addDecodedTypesToTransferSentEvents (events: any[]): EthersEventWithDecodedTypes<TransferSent>[] {
    return RailsGateway.addDecodedTypesToTransferSentEvents(events, this.chainId)
  }

  addDecodedTypesToTransferBondedEvents (events: any[]): EthersEventWithDecodedTypes<TransferBonded>[] {
    return RailsGateway.addDecodedTypesToTransferBondedEvents(events, this.chainId)
  }

  addDecodedTypesToClaimPostedEvents (events: any[]): EthersEventWithDecodedTypes<ClaimPosted>[] {
    return RailsGateway.addDecodedTypesToClaimPostedEvents(events, this.chainId)
  }

  addDecodedTypesToClaimReaddedEvents (events: any[]): EthersEventWithDecodedTypes<ClaimReadded>[] {
    return RailsGateway.addDecodedTypesToClaimReaddedEvents(events, this.chainId)
  }

  addDecodedTypesToClaimRemovedEvents (events: any[]): EthersEventWithDecodedTypes<ClaimRemoved>[] {
    return RailsGateway.addDecodedTypesToClaimRemovedEvents(events, this.chainId)
  }

  async getTransferBondedEvents (input: TransferBondedEventInput): Promise<EthersEventWithDecodedTypes<TransferBonded>[]> {
    return this.#getEvents({ ...input, eventName: EventName.TransferBonded })
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
      console.warn('getPathId error', err, { chainId0, token0, chainId1, token1, initialReserve }, this.getProvider(this.chainId))
      return this.throwError(err) as string
    }
  }

  async getPathInfo ({ pathId }: GetPathInfoInput): Promise<Path> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const pathInfoArray = await contract.getPathInfo(pathId)
    console.log('hopV2Sdk: pathInfo', pathInfoArray)
    const pathInfo: Path = {
      pathId,
      chainId: pathInfoArray[0].toString(),
      token: checksumAddress(pathInfoArray[1]),
      counterpartChainId: pathInfoArray[2].toString(),
      counterpartToken: checksumAddress(pathInfoArray[3]),
      initialReserve: pathInfoArray[4]
    }

    if (!(this.utils.isValidAddress(pathInfo.token) && this.utils.isValidAddress(pathInfo.counterpartToken))) {
      throw new InputError(`pathId "${pathId}" is invalid or not found. Check the chainId is correct for that pathId. Chain ID used: ${chainId.toString()}`)
    }

    console.log('hopV2Sdk: pathInfo', pathInfo)
    return pathInfo
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

  async feeManager (): Promise<string> {
    const contract = await this.getRailsGatewayContract()
    return contract.feeManager()
  }

  async feeOracle (): Promise<string> {
    const contract = await this.getRailsGatewayContract()
    return contract.feeOracle()
  }

  async gateways ({ counterpartChainId }: GetGatewaysInput): Promise<string> {
    if (!this.utils.isValidChainId(counterpartChainId)) {
      throw new InputError(`Invalid counterpartChainId "${counterpartChainId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.gateways(counterpartChainId)
  }

  async getBucket ({ pathId, index }: GetBucketInput): Promise<Bucket> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidNumericValue(index)) {
      throw new InputError(`Invalid index "${index}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const bucket = await contract.getBucket(pathId, index)

    return {
      completedAt: bucket.completedAt,
      finalClaimId: bucket.finalClaimId,
      totalAttested: bucket.totalAttested,
      maxConfirmed: bucket.maxConfirmed
    }
  }

  async getClaim ({ pathId, claimId }: GetClaimInput): Promise<Claim> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimid "${claimId}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const claim = await contract.getClaim(pathId, claimId)
      return claim
    } catch (err: unknown) {
      return this.throwError(err) as Claim
    }
  }

  async getClaimId ({ pathId, index }: GetClaimIdInput): Promise<string> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    if (!this.utils.isValidNumericValue(index)) {
      throw new InputError(`Invalid index "${index}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const claimId = await contract.getClaimId(pathId, index)

    return claimId
  }

  async getCounterpartChainId ({ pathId }: GetCounterpartChainIdInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const counterpartChainId = await contract.getCounterpartChainId(pathId)
    return counterpartChainId
  }

  async getFeeVault ({ chainId }: GetFeeVaultInput): Promise<string> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const feeVault = await contract.getFeeVault(chainId)
    return feeVault
  }

  async getHardConfirmedBucketIndex ({ pathId }: GetHardConfirmedBucketIndexInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const index = await contract.getHardConfirmedBucketIndex(pathId)
    return index
  }

  async getHardConfirmedClaimId ({ pathId }: GetHardConfirmedClaimIdInput): Promise<string> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const claimId = await contract.getHardConfirmedClaimId(pathId)
    return claimId
  }

  async getLastBondedClaimId ({ pathId, bonder }: GetLastBondedClaimIdInput): Promise<string> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    if (!this.utils.isValidAddress(bonder)) {
      throw new InputError(`Invalid bonder "${bonder}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const claimId = await contract.getLastBondedClaimId(pathId, bonder)
    return claimId
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

  async getClaimFeesFee ({ chainId }: GetClaimFeesFeeInput): Promise<BigNumber> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const fee = await contract.getClaimFeesFee(chainId)
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

  async getUpdateFee (): Promise<BigNumber> {
    const contract = await this.getRailsGatewayContract()

    try {
      const fee = await contract.getUpdateFee()
      return fee
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async getFeePrice ({ chainId }: GetFeePriceInput): Promise<BigNumber> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const fee = await contract.getFeePrice(chainId)
      return fee
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async getTotalClaims ({ pathId }: GetTotalClaimsInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const totalClaims = await contract.getTotalClaims(pathId)
    return totalClaims
  }

  async getTotalClaimsAtClaimId ({ pathId, claimId }: GetTotalClaimsAtClaimIdInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const totalClaims = await contract.getTotalClaimsAtClaimId(pathId)
    return totalClaims
  }

  async getTotalConfirmed ({ pathId }: GetTotalConfirmedInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathid "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    const totalConfirmed = await contract.getTotalConfirmed(pathId)
    return totalConfirmed
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

        const path = await this.getPathInfo({ pathId })
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

      postAndBond: async ({ pathId, claimId, to, amountOut, maxBonderFee, attestedClaimId, sourcePool, bonderFee, nextHops } : PostAndBondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
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

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.postAndBond(pathId, claimId, to, amountOut, maxBonderFee, attestedClaimId, sourcePool, bonderFee, nextHops)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      postAndWithdraw: async ({ pathId, claimId, to, amountOut, maxBonderFee, attestedClaimId, sourcePool, bonderFee, nextHops }: PostAndWithdrawInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
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

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.postAndWithdraw(pathId, claimId, to, amountOut, maxBonderFee, attestedClaimId, sourcePool, bonderFee, nextHops)

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

      withdrawClaim: async ({ pathId, claimId }: WithdrawClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
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
        const txData = await contract.populateTransaction.withdrawClaim(pathId, claimId)

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

        const path = await this.getPathInfo({ pathId })
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

      postClaim: async ({ pathId, transferId, to, amountOut, maxBonderFee, totalSent, totalClaims, attestedClaimId, nextHopsHash }: PostClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(transferId)) {
          throw new InputError(`Invalid transferId "${transferId}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid address "${to}"`)
        }

        if (!this.utils.isValidNumericValue(amountOut)) {
          throw new InputError(`Invalid amount "${amountOut}"`)
        }

        if (!this.utils.isValidNumericValue(maxBonderFee)) {
          throw new InputError(`Invalid maxBonderFee "${maxBonderFee}"`)
        }

        if (!this.utils.isValidNumericValue(totalClaims)) {
          throw new InputError(`Invalid totalClaims "${totalClaims}"`)
        }

        if (!this.utils.isValidBytes32(attestedClaimId)) {
          throw new InputError(`Invalid attestedClaimId "${attestedClaimId}"`)
        }

        if (!this.utils.isValidBytes32(nextHopsHash)) {
          throw new InputError(`Invalid nextHopsHash "${nextHopsHash}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.postClaim(pathId, transferId, to, amountOut, maxBonderFee, attestedClaimId, totalSent, totalClaims, nextHopsHash)

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

        const updateFee = await this.getUpdateFee()
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

      distributeExcessFees: async ({ pathId, recipients, amounts }: DistributeExcessFeesInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!Array.isArray(recipients)) {
          throw new InputError('Invalid recipients')
        }

        if (!Array.isArray(amounts)) {
          throw new InputError('Invalid amounts')
        }

        if (recipients.length !== amounts.length) {
          throw new InputError('recipients and amounts arrays must have the same length')
        }

        if (recipients.some(recipient => !this.utils.isValidAddress(recipient))) {
          throw new InputError('One or more recipients values are invalid')
        }

        if (amounts.some(amount => !this.utils.isValidNumericValue(amount))) {
          throw new InputError('One or more amounts values are invalid')
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.distributeExcessFees(pathId, recipients, amounts)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      setFeePrice: async ({ chainId, feePrice }: SetFeePriceInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        if (!this.chainId || !this.utils.isValidChainId(this.chainId)) {
          throw new InputError(`Invalid chainId "${this.chainId}"`)
        }

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidNumericValue(feePrice)) {
          throw new InputError(`Invalid feePrice "${feePrice}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.setFeePrice(chainId, feePrice)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(this.chainId)
        }
      },

      setFeePrices: async ({ chainIds, feePrices }: SetFeePricesInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        if (!this.chainId || !this.utils.isValidChainId(this.chainId)) {
          throw new InputError(`Invalid chainId "${this.chainId}"`)
        }

        if (!Array.isArray(chainIds)) {
          throw new InputError('Invalid chainIds')
        }

        if (!Array.isArray(feePrices)) {
          throw new InputError('Invalid feePrices')
        }

        if (chainIds.length !== feePrices.length) {
          throw new InputError('chainIds and feePrices arrays must have the same length')
        }

        if (!chainIds.every(chainId => this.utils.isValidChainId(chainId))) {
          throw new InputError('One or more chainIds values are invalid')
        }

        if (!feePrices.every(feePrice => this.utils.isValidNumericValue(feePrice))) {
          throw new InputError('One or more feePrices values are invalid')
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.setFeePrices(chainIds, feePrices)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(this.chainId)
        }
      }
    }
  }

  get helpers() {
    return {
      getAbi(): typeof RailsGateway__factory.abi {
        return RailsGateway__factory.abi
      },

      getNeedsApprovalForSend: async ({ pathId, amount, account }: GetNeedsApprovalForSendInput): Promise<boolean> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const path = await this.getPathInfo({ pathId })
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

        const path = await this.getPathInfo({ pathId })
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
          const pathInfo = await this.getPathInfo({ pathId })

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

        const { symbol: tokenSymbol } = await this.getTokenInfo({ address: tokenAddress })
        return this.helpers.getInitialReserveByTokenSymbol({ tokenSymbol })
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

    const path = await this.getPathInfo({ pathId })
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

  async postAndBond (input: PostAndBondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.postAndBond(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async postAndWithdraw (input: PostAndWithdrawInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.postAndWithdraw(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async pushClaim (input: PushClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.pushClaim(input, txOverrides)
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

  async getHeadClaimId ({ pathId }: GetHeadClaimIdInput): Promise<string> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getHeadClaimId(pathId)
  }

  async getWithdrawableBalance ({ pathId, recipient, claimId }: GetWithdrawableBalanceInput): Promise<BigNumber> {
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
  }

  async getWithdrawn ({ pathId, bonder }: GetWithdrawnInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidAddress(bonder)) {
      throw new InputError(`Invalid bonder "${bonder}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getWithdrawn(pathId, bonder)
  }

  async getTotalWithdrawableAtClaimId ({ pathId, bonder, claimId }: GetTotalWithdrawableAtClaimIdInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidAddress(bonder)) {
      throw new InputError(`Invalid bonder "${bonder}"`)
    }

    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getTotalWithdrawableAtClaimId(pathId, bonder, claimId)
  }

  async getTransferId ({ pathId, index }: GetTransferIdInput): Promise<string> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidNumericValue(index)) {
      throw new InputError(`Invalid index "${index}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getTransferId(pathId, index)
  }

  async getTransferIndex ({ pathId, transferId }: GetTransferIndexInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getTransferIndex(pathId, transferId)
  }

  async getRemovedBalance ({ pathId, bonder }: GetRemovedBalanceInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidAddress(bonder)) {
      throw new InputError(`Invalid bonder "${bonder}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getRemovedBalance(pathId, bonder)
  }

  async getHopTokenAddress (): Promise<string> {
    const chainId = this.chainId

    const tokenAddress = this.getConfigAddress(chainId, 'hopToken')
    if (!tokenAddress) {
      throw new Error(`HOP token address config not found for chain ${chainId}`)
    }

    return tokenAddress
  }

  async getHopBalance (address?: string | null): Promise<BigNumber> {
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

    const contract = await this.getHopTokenContract()

    try {
      const hopBalance = await contract.balanceOf(address)
      return hopBalance
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async getHopTokenContract (): Promise<Contract> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const hopTokenAddress = await this.getHopTokenAddress()
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }
    const contract = ERC20__factory.connect(hopTokenAddress, provider)
    return contract
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

  async getTokenInfo ({ address }: GetTokenInfoInput): Promise<Token> {
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

    const contract = this.getTokenContract({ address })

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
  }

  getTokenContract ({ address }: GetTokenContractInput): Contract {
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
  }

  async getHasSufficientBalance ({ tokenAddress, amount, account }: GetHasSufficientBalanceInput): Promise<boolean> {
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
  }

  async getIsClaimIdValid ({ pathId, claimId }: GetIsClaimIdValidInput): Promise<boolean> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const valid = await contract.isValidClaim(pathId, claimId)
      return valid
    } catch (err: unknown) {
      return this.throwError(err) as boolean
    }
  }

  async getTotalSent ({ pathId }: GetTotalSentInput): Promise<BigNumber> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const totalSent = await contract.getTotalSent(pathId)
      return totalSent
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async claimFeesFromPath (input: ClaimFeesFromPathInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.claimFeesFromPath(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async distributeClaimedFees (input: DistributeClaimedFeesInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.distributeClaimedFees(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async distributeExcessFees (input: DistributeExcessFeesInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.distributeExcessFees(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async setFeePrice (input: SetFeePriceInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.setFeePrice(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async setFeePrices (input: SetFeePricesInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.setFeePrices(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async getTransferDataHash ({ to, amountOut, sourcePool, hops }: GetTransferDataHashInput): Promise<string> {
    const contract = await this.getRailsGatewayContract()
    return contract.getTransferDataHash(to, amountOut, sourcePool, hops)
  }

  async getBucketIndex ({ pathId, claimId }: GetBucketIndexInput): Promise<number> {
    const contract = await this.getRailsGatewayContract()
    const index = await contract.getBucketIndex(pathId, claimId)
    return Number(index)
  }

  async getAmountOut ({ pathId, amount, attestedClaimId, sourcePool }: GetAmountOutInput): Promise<BigNumber> {
    const contract = await this.getRailsGatewayContract()
    return contract.getAmountOut(pathId, amount, attestedClaimId, sourcePool)
  }

  async isValidClaim ({ pathId, claimId }: IsValidClaimInput ): Promise<boolean> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.isValidClaim(pathId, claimId)
  }

  async isValidTransfer ({ pathId, claimId }: IsValidClaimInput ): Promise<boolean> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.isValidTransfer(pathId, claimId)
  }

  async getNextHopsHash ({ nextHops }: GetNextHopsHashInput): Promise<string> {
    if (!nextHops || !Array.isArray(nextHops)) {
      throw new InputError('Invalid nextHops')
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getNextHopsHash(nextHops)
  }

  async getTokenVault ({ pathId }: GetTokenVaultInput ): Promise<string> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getTokenVault(pathId)
  }

  async getStakingRegistryContractAddress(): Promise<string> {
    const contract = await this.getRailsGatewayContract()
    return contract.stakingRegistry()
  }

  async getSourcePool({ pathId, attestedClaimId }: GetSourcePoolInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidBytes32(attestedClaimId)) {
      throw new InputError(`Invalid attestedClaimId "${attestedClaimId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getSourcePool(pathId, attestedClaimId)
  }

  async getInitialReserve ({ pathId }: GetInitialReserveInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const { initialReserve } = await this.getPathInfo({ pathId })
    return initialReserve
  }

  getStakingRegistry(): StakingRegistry {
    return new StakingRegistry({
      chainId: this.chainId,
      contractAddresses: this.contractAddresses,
      signersOrProviders: this.signersOrProviders,
      network: this.network
    })
  }

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

  static addDecodedTypesToEvent(event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPosted | ClaimReadded | ClaimRemoved> {
    const decoded = RailsGateway.addDecodedTypesToEvents([event], chainId)

    return decoded?.[0]
  }

  static addDecodedTypesToEvents(events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPosted | ClaimReadded | ClaimRemoved>[] {
    const transferSentEventFetcher = new TransferSentEventFetcher()
    const transferBondedEventFetcher = new TransferBondedEventFetcher()
    const claimPostedEventFetcher = new ClaimPostedEventFetcher()
    const claimReaddedEventFetcher = new ClaimReaddedEventFetcher()
    const claimRemovedEventFetcher = new ClaimRemovedEventFetcher()

    console.log('her00', events.length)
    const result = events.map(event => {
      if (transferSentEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.TransferSent) {
        return RailsGateway.addDecodedTypesToTransferSentEvent(event, chainId)
      }

      if (transferBondedEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.TransferBonded) {
        return RailsGateway.addDecodedTypesToTransferBondedEvent(event, chainId)
      }

      if (claimPostedEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.ClaimPosted) {
        return RailsGateway.addDecodedTypesToClaimPostedEvent(event, chainId)
      }

      if (claimReaddedEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.ClaimReadded) {
        return RailsGateway.addDecodedTypesToClaimReaddedEvent(event, chainId)
      }

      if (claimRemovedEventFetcher.getEventNameFromTopic(event.topics[0]) === EventName.ClaimRemoved) {
        return RailsGateway.addDecodedTypesToClaimRemovedEvent(event, chainId)
      }

      return event
    })

    return result
  }

  static addDecodedTypesToTransferSentEvent (event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferSent> {
    const eventFetcher = new TransferSentEventFetcher(undefined, chainId)
    return eventFetcher.addTypedEvent(event)
  }

  static addDecodedTypesToTransferBondedEvent (event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferBonded> {
    const eventFetcher = new TransferBondedEventFetcher(undefined, chainId)
    return eventFetcher.addTypedEvent(event)
  }

  static addDecodedTypesToClaimPostedEvent (event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<ClaimPosted> {
    const eventFetcher = new ClaimPostedEventFetcher(undefined, chainId)
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

  static addDecodedTypesToTransferSentEvents (events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferSent>[] {
    const eventFetcher = new TransferSentEventFetcher(undefined, chainId)
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  static addDecodedTypesToTransferBondedEvents (events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferBonded>[] {
    const eventFetcher = new TransferBondedEventFetcher(undefined, chainId)
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  static addDecodedTypesToClaimPostedEvents (events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<ClaimPosted>[] {
    const eventFetcher = new ClaimPostedEventFetcher(undefined, chainId)
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
}
