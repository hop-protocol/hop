import { TxOverrides, SignersOrProviders } from '#common/index.js'
import { Addresses } from '#addresses/types.js'
import { BigNumber, BigNumberish, Contract, Signer, providers, utils, constants } from 'ethers'
import { getNetwork, NetworkSlug } from '@hop-protocol/sdk'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'
import { StakingRegistry } from './StakingRegistry.js'
import { TransferSent, HopStruct, TransferSentEventFetcher, TransferSentIndexes } from '#railsGateway/events/TransferSent.js'
import { TransferBonded, TransferBondedEventFetcher, TransferBondedIndexes } from '#railsGateway/events/TransferBonded.js'
import { ConfigError, InputError, InsufficientBalanceError, InsufficientApprovalError } from '#error/index.js'
import { EthersEventWithDecodedTypes } from '#events/index.js'
import memcache from 'memory-cache'
import { getComputedNextHopsHash } from '../utils/getComputedNextHopsHash.js'

const { getAddress: checksumAddress } = utils

const cache = new memcache.Cache()

export type EventFetcher = TransferSentEventFetcher | TransferBondedEventFetcher

export enum EventName {
  TransferSent = 'TransferSent',
  TransferBonded = 'TransferBonded',
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
}

export type GetPathIdInput = {
  chainId0: BigNumberish
  token0: string
  chainId1: BigNumberish
  token1: string
}

export type GetPathInfoInput = {
  pathId: string
}

export type SendInput = {
  pathId: string
  to: string
  amount: BigNumberish
  hops: HopStructInput[]
  fee: BigNumberish
}

export type ApproveSendInput = {
  pathId: string
  amount: BigNumberish
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
  transferId: string
}

export type ConfirmClaimInput = {
  pathId: string
  transferId: string
}

export type GetTransferIdInput = {
  pathId: string
  to: string
  adjustedAmount: BigNumberish
  minAmountOut: BigNumberish
  totalSent: BigNumberish
  nonce: BigNumberish
  attestedCheckpoint: string
}

export type WithdrawInput = {
  pathId: string
  amount: BigNumberish
  bucketIndex: number
}

export type WithdrawAllInput = {
  pathId: string
  bucketIndex: number
}

export type WithdrawableBalanceInput = {
  pathId: string
  recipient: string
  bucketIndex: number
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

export type GetHeadClaimInput = {
  pathId: string
}

export type GetIsClaimIdValidInput = {
  pathId: string
  claimId: string
}

export type GetFeeInput = {
  pathId: string
}

export type StakeHopInput = {
  role: string
  staker?: string
  amount: BigNumberish
}

export type UnstakeHopInput = {
  role: string
  amount: BigNumberish
}

export type WithdrawHopInput = {
  role: string
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

export type GetEventFilterInput = TransferSentIndexes | TransferBondedIndexes

export type GetTransferSentEventFilterInput = TransferSentIndexes

export type GetTransferBondedEventFilterInput = TransferBondedIndexes

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
  nextHops: HopStruct[]
}

export type GetIsPathIdLiveInput = {
  pathId: string
}

export type BatchUpdateClaimChainInput = {
  pathId: string
  transferDataHashes: string[]
  finalTransferId: string
}

export type ClaimFeesFromPathInput = {
  pathId: string
  messageFee: BigNumberish
}

export type DistributeFeesInput = {
  pathId: string
  account: string
  totalFees: BigNumberish
  lastClaimId: string
}

export type GetTransferDataHashInput = {
  to: string
  amountOut: BigNumberish
  totalSent: BigNumberish
  totalClaims: BigNumberish
  hops: HopStruct[]
}

export type UpdateClaimChainInput = {
  pathId: string
  transferDataHash: string
  headTransferId: string
}

export type GetBucketIndexInput = {
  pathId: string
  claimId: string
}

export type GetAmountOutInput = {
  pathId: string
  amount: BigNumberish
  attestedClaimId: string
}

export type RailsGatewayConstructorInput = {
  network?: string
  gasPriceMultiplier?: number
  signersOrProviders?: SignersOrProviders
  contractAddresses?: Addresses
  chainId: BigNumberish
  signerOrProvider?: Signer | providers.Provider
}

export class RailsGateway extends StakingRegistry {
  static EventName = EventName
  chainId: BigNumberish

  constructor ({ contractAddresses, chainId, signerOrProvider, signersOrProviders }: RailsGatewayConstructorInput) {
    super({
      contractAddresses,
      signersOrProviders: {
        [chainId?.toString()]: signerOrProvider!
      },
      network: RailsGateway.deriveNetwork(chainId)
    })
    this.chainId = chainId
  }

  getEventNames (): string[] {
    return RailsGateway.getEventNames()
  }

  getEventFetcher(eventName: EventName) {
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
      [EventName.TransferBonded]: TransferBondedEventFetcher
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

  addDecodedTypesToEvent(event: any): EthersEventWithDecodedTypes<TransferSent | TransferBonded> {
    return RailsGateway.addDecodedTypesToEvent(event)
  }

  addDecodedTypesToEvents(events: any[]): EthersEventWithDecodedTypes<TransferSent | TransferBonded>[] {
    return RailsGateway.addDecodedTypesToEvents(events)
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
    return RailsGateway.addDecodedTypesToTransferSentEvents(events)
  }

  addDecodedTypesToTransferBondedEvents (events: any[]): EthersEventWithDecodedTypes<TransferBonded>[] {
    return RailsGateway.addDecodedTypesToTransferBondedEvents(events)
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

  async getPathId ({ chainId0, token0, chainId1, token1 }: GetPathIdInput): Promise<string> {
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
      const pathId = await contract.getPathId(chainId0, token0, chainId1, token1)
      return pathId
    } catch (err: unknown) {
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
      counterpartToken: checksumAddress(pathInfoArray[3])
    }

    if (!(this.utils.isValidAddress(pathInfo.token) && this.utils.isValidAddress(pathInfo.counterpartToken))) {
      throw new InputError('pathId is invalid or not found')
    }

    console.log('hopV2Sdk: pathInfo', pathInfo)
    return pathInfo
  }

  async getFee ({ pathId }: GetFeeInput): Promise<BigNumber> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const fee = await contract.getFee(pathId)
      return fee
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  get populateTransaction() {
    return {
      send: async ({ pathId, to, amount, hops = [], fee }: SendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid "to" address "${to}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
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
              throw new InputError(`Invalid minAmountOut "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        const contract = await this.getRailsGatewayContract()

        const txData = await contract.populateTransaction.send(pathId, to, amount, hops, {
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
              throw new InputError(`Invalid minAmountOut "${hop.attestedClaimId}"`)
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

      removeClaim: async ({ pathId, transferId }: RemoveClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(transferId)) {
          throw new InputError(`Invalid transferID "${transferId}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.removeClaim(pathId, transferId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      withdraw: async ({ pathId, amount, bucketIndex }: WithdrawInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
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

        if (!this.utils.isValidNumericValue(bucketIndex)) {
          throw new InputError(`Invalid bucketIndex "${bucketIndex}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction['withdraw(bytes32,uint256,uint256)'](pathId, amount, Number(bucketIndex))

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      withdrawAll: async ({ pathId, bucketIndex }: WithdrawAllInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(bucketIndex)) {
          throw new InputError(`Invalid bucketIndex "${bucketIndex}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.withdrawAll(pathId, Number(bucketIndex))

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      confirmClaim: async ({ pathId, transferId }: ConfirmClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
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

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.confirmClaim(pathId, transferId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      approveStakeHop: async ({ role, staker, amount }: StakeHopInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!staker) {
          staker = (await this.getSignerAddress(chainId)) as string
        }

        if (!staker) {
          throw new InputError('Staker address not set')
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

        const hopTokenContract = await this.getHopTokenContract()
        const address = this.getRailsGatewayContractAddress()
        const txData = await hopTokenContract.populateTransaction.approve(address, amount)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      stakeHop: async ({ role, staker, amount }: StakeHopInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!staker) {
          staker = (await this.getSignerAddress(chainId)) as string
        }

        if (!staker) {
          throw new InputError('Staker address not set')
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
        const balance = await this.getHopBalance(staker)

        if (balance.lt(amount)) {
          throw new InsufficientBalanceError(`Insufficient balance to stake ${amount.toString()} HOP`)
        }

        if (balance.lt(minRequired)) {
          throw new InsufficientBalanceError(`Insufficient balance to stake ${minRequired.toString()} HOP`)
        }

        const txData = await this.registryStakeHopPopulatedTx({ chainId, role, staker, amount })

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      unstakeHop: async ({ role, amount }: UnstakeHopInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(role)) {
          throw new InputError(`Invalid role "${role}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const staker = await this.getSignerAddress(chainId)
        if (!staker) {
          throw new InputError('Staker address not set')
        }
        const balance = await this.getWithdrawableStakeBalance({ chainId: this.chainId, role, staker })

        if (balance.lt(amount)) {
          throw new InsufficientBalanceError('Insufficient balance to unstake')
        }

        const txData = await this.registryUnstakeHopPopulatedTx({ chainId, role, amount })

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      withdrawHop: async ({ role }: WithdrawHopInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(role)) {
          throw new InputError(`Invalid role "${role}"`)
        }

        const staker = await this.getSignerAddress(chainId)
        if (!staker) {
          throw new InputError('Staker address not set')
        }
        const txData = await this.registryWithdrawPopulatedTx({ chainId, role, staker })

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      batchUpdateClaimChain: async ({ pathId, transferDataHashes, finalTransferId }: BatchUpdateClaimChainInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(finalTransferId)) {
          throw new InputError(`Invalid finalTransferId "${finalTransferId}"`)
        }

        if (!transferDataHashes || !Array.isArray(transferDataHashes)) {
          throw new InputError('Invalid transferDataHashes')
        }

        if (!transferDataHashes.every(hash => this.utils.isValidBytes32(hash))) {
          throw new InputError('One or more transferDataHashes values is invalid')
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.batchUpdateClaimChain(pathId, transferDataHashes, finalTransferId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      claimFeesFromPath: async ({ pathId, messageFee }: ClaimFeesFromPathInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(messageFee)) {
          throw new InputError(`Invalid messageFee "${messageFee?.toString()}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.claimFeesFromPath(pathId, messageFee)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      distributeFees: async ({ pathId, account, totalFees, lastClaimId }: DistributeFeesInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
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
        const txData = await contract.populateTransaction.distributeFees(pathId, account, totalFees, lastClaimId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      updateClaimChain: async ({ pathId, transferDataHash, headTransferId }: UpdateClaimChainInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(transferDataHash)) {
          throw new InputError(`Invalid transferDataHash "${transferDataHash}"`)
        }

        if (!this.utils.isValidBytes32(headTransferId)) {
          throw new InputError(`Invalid headTransferId "${headTransferId}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.updateClaimChain(pathId, transferDataHash, headTransferId)

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
          const pathInfoArray = await contract.getPathInfo(pathId)

          const pathChainId = pathInfoArray[0].toString()
          const pathToken = pathInfoArray[1]
          const counterpartChainId = pathInfoArray[2].toString()
          const counterpartToken = checksumAddress(pathInfoArray[3])

          if (pathChainId !== '0' && counterpartChainId !== '0' && pathToken !== constants.AddressZero && counterpartToken !== constants.AddressZero) {
            return true
          }
        } catch (err: unknown) {
          return this.throwError(err) as boolean
        }

        return false
      },

      getComputedNextHopsHash: ({ nextHops }: GetNextHopsHashInput): string => {
        return RailsGateway.getComputedNextHopsHash({ nextHops })
      }
    }
  }

  async send (input: SendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const { pathId, amount } = input
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

  async confirmClaim (input: ConfirmClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.confirmClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async withdraw (input: WithdrawInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdraw(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async withdrawAll (input: WithdrawAllInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawAll(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async getHeadClaim ({ pathId }: GetHeadClaimInput): Promise<string> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getHeadClaim(pathId)
  }

  async stakeHop (input: StakeHopInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.stakeHop(input)
    return this.sendTransaction(populatedTx)
  }

  async unstakeHop (input: UnstakeHopInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.unstakeHop(input)
    return this.sendTransaction(populatedTx)
  }

  async withdrawHop (input: WithdrawHopInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawHop(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async getWithdrawableBalance ({ pathId, recipient, bucketIndex }: WithdrawableBalanceInput): Promise<BigNumber> {
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

    if (!this.utils.isValidNumericValue(bucketIndex)) {
      throw new InputError(`Invalid bucketIndex "${bucketIndex}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const balance = await contract['getWithdrawableBalance(bytes32,address,uint256)'](pathId, recipient, Number(bucketIndex))
      return balance
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async getTransferId ({ pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint }: GetTransferIdInput): Promise<string> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
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

    if (attestedCheckpoint) {
      if (!this.utils.isValidBytes32(attestedCheckpoint)) {
        throw new InputError(`Invalid attestedCheckpoint  "${attestedCheckpoint}"`)
      }
    } else {
      attestedCheckpoint = '0x' + '0'.repeat(64)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const transferId = await contract.getTransferId(pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint)
      return transferId
    } catch (err: unknown) {
      return this.throwError(err) as string
    }
  }

  async getHopTokenAddress (): Promise<string> {
    const chainId = this.chainId

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.hopToken()
  }

  async getMinBonderStake (): Promise<BigNumber> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const minStake = await contract.minBonderStake()
      return minStake
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
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

    const contract = this.getTokenContract({ address })

    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals()
    ])

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
      const valid = await contract.isClaimValid(pathId, claimId)
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


  async batchUpdateClaimChain (input: BatchUpdateClaimChainInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.batchUpdateClaimChain(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async claimFeesFromPath (input: ClaimFeesFromPathInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.claimFeesFromPath(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async distributeFees (input: DistributeFeesInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.distributeFees(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async updateClaimChain (input: UpdateClaimChainInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.updateClaimChain(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async getTransferDataHash ({ to, amountOut, totalSent, totalClaims, hops }: GetTransferDataHashInput): Promise<string> {
    const contract = await this.getRailsGatewayContract()
    return contract.getTransferDataHash(to, amountOut, totalSent, totalClaims, hops)
  }

  async getBucketIndex ({ pathId, claimId }: GetBucketIndexInput): Promise<number> {
    const contract = await this.getRailsGatewayContract()
    const index = await contract.getBucketIndex(pathId, claimId)
    return Number(index)
  }

  async getAmountOut ({ pathId, amount, attestedClaimId }: GetAmountOutInput): Promise<BigNumber> {
    const contract = await this.getRailsGatewayContract()
    return contract.getAmountOut(pathId, amount, attestedClaimId)
  }

  async getNextHopsHash ({ nextHops }: GetNextHopsHashInput): Promise<string> {
    if (!nextHops || !Array.isArray(nextHops)) {
      throw new InputError('Invalid nextHops')
    }

    const contract = await this.getRailsGatewayContract()
    return contract.getNextHopsHash(nextHops)
  }

  static getComputedNextHopsHash ({ nextHops }: GetNextHopsHashInput): string {
    if (!nextHops || !Array.isArray(nextHops)) {
      throw new InputError('Invalid nextHops')
    }

    return getComputedNextHopsHash(nextHops)
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
    return Object.keys(EventName)
  }

  static getTransferSentEventSignature (): string {
    const eventFetcher = new TransferSentEventFetcher()
    return eventFetcher.getTopic0()
  }

  static getTransferBondedEventSignature (): string {
    const eventFetcher = new TransferBondedEventFetcher()
    return eventFetcher.getTopic0()
  }

  static addDecodedTypesToEvent(event: any): EthersEventWithDecodedTypes<TransferSent | TransferBonded> {
    const decoded = RailsGateway.addDecodedTypesToEvents([event])

    return decoded?.[0]
  }

  static addDecodedTypesToEvents(events: any[]): EthersEventWithDecodedTypes<TransferSent | TransferBonded>[] {
    const transferSentEventFetcher = new TransferSentEventFetcher()
    const transferBondedEventFetcher = new TransferBondedEventFetcher()

    if (events.some(event => transferSentEventFetcher.getEventNameFromTopic(event.topics[0]))) {
      return RailsGateway.addDecodedTypesToTransferSentEvents(events)
    }

    if (events.some(event => transferBondedEventFetcher.getEventNameFromTopic(event.topics[0]))) {
      return RailsGateway.addDecodedTypesToTransferBondedEvents(events)
    }

    return events
  }

  static addDecodedTypesToTransferSentEvents (events: any[]): EthersEventWithDecodedTypes<TransferSent>[] {
    const eventFetcher = new TransferSentEventFetcher()
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  static addDecodedTypesToTransferBondedEvents (events: any[]): EthersEventWithDecodedTypes<TransferBonded>[] {
    const eventFetcher = new TransferBondedEventFetcher()
    return events.map(event => eventFetcher.addTypedEvent(event))
  }
}

