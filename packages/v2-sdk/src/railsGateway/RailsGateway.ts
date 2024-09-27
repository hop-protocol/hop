import { BaseConfig, TxOverrides, ChainProviders } from '#common/index.js'
import { Addresses } from '#addresses/types.js'
import { BigNumber, BigNumberish, Contract, Signer, providers, utils, constants } from 'ethers'
import { getProviderFromUrl, rateLimitRetry, getNetwork, NetworkSlug } from '@hop-protocol/sdk'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'
import { StakingRegistry } from './StakingRegistry.js'
import { TransferSent, HopStruct, TransferSentEventFetcher, TransferSentIndexes } from '#railsGateway/events/TransferSent.js'
import { TransferBonded, TransferBondedEventFetcher, TransferBondedIndexes } from '#railsGateway/events/TransferBonded.js'
import { ConfigError, InputError, InsufficientBalanceError, InsufficientApprovalError } from '#error/index.js'
import { EthersEventWithDecodedTypes } from '#events/index.js'
import memcache from 'memory-cache'

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
  attestedClaimId: string
  nextHops: HopStructInput[]
  maxTotalSent: BigNumberish
  fee: BigNumberish
}

export type ApproveSendInput = {
  pathId: string
  amount: BigNumberish
}

export type BondInput = {
  pathId: string
  transferId: string
  nextHops: HopStructInput[]
  amount: BigNumberish
}

export type ApproveBondInput = {
  pathId: string
  amount: BigNumberish
}

export type PostClaimInput = {
  pathId: string
  transferId: string
  to: string
  amount: BigNumberish
  totalSent: BigNumberish
  attestedClaimId: string
  attestedTotalClaims: BigNumberish
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
  timeWindow: number
}

export type WithdrawAllInput = {
  pathId: string
  timeWindow: number
}

export type WithdrawBalanceInput = {
  pathId?: string
  path?: Path
  recipient: string
  timeWindow: number
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

export type GetLatestClaimInput = {
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

export type GetEventFilterInput = {
  indexes?: TransferSentIndexes | TransferBondedIndexes
}

export type GetTransferSentEventFilterInput = {
  indexes?: TransferSentIndexes
}

export type GetTransferBondedEventFilterInput = {
  indexes?: TransferBondedIndexes
}

export type Token = {
  chainId: string
  address: string
  name: string
  symbol: string
  decimals: number
}

export type HopStructInput = {
  pathId: string
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

export type RailsGatewayConstructorInput = {
  network?: string
  signer?: Signer
  gasPriceMultiplier?: number
  chainProviders?: ChainProviders
  contractAddresses?: Addresses
  requireChainIdInput?: boolean
  chainId: BigNumberish
  signerOrProvider?: Signer | providers.Provider
}

export class RailsGateway extends StakingRegistry {
  chainId: BigNumberish

  constructor ({ contractAddresses, chainId, signerOrProvider, chainProviders }: RailsGatewayConstructorInput) {
    super({
      signer: Signer.isSigner(signerOrProvider) ? signerOrProvider : undefined,
      contractAddresses,
      chainProviders: {
        [chainId?.toString()]: Signer.isSigner(signerOrProvider) ? signerOrProvider.provider! : signerOrProvider!
      },
      network: RailsGateway.deriveNetwork(chainId)
    })
    this.chainId = chainId
  }

  static deriveNetwork (chainId: BigNumberish): string {
    chainId = chainId?.toString()
    const networks = [NetworkSlug.Mainnet, NetworkSlug.Sepolia]

    for (const net of networks) {
      const network = getNetwork(net)
      const chain = Object.values(network.chains).find(chain => chain.chainId === chainId)

      if (chain) {
        return net
      }
    }

    throw new Error('could not derive network')
  }

  override connect (signer: Signer) {
    return new RailsGateway({ signer, contractAddresses: this.contractAddresses, chainProviders: this.chainProviders, chainId: this.chainId })
  }

  static getEventNames (): string[] {
    return Object.keys(EventName)
  }

  getEventNames (): string[] {
    return RailsGateway.getEventNames()
  }

  getEventFetcher(eventName: EventName) {
    const chainId = this.chainId
    const provider = this.getRpcProviderForChainId(chainId)
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

  getEventFilter(eventName: EventName, input: GetTransferSentEventFilterInput = {}) {
    if (eventName == EventName.TransferSent) {
      return this.getTransferSentEventFilter(input)
    }

    if (eventName == EventName.TransferBonded) {
      return this.getTransferBondedEventFilter(input)
    }

    throw new InputError(`event name ${eventName} not found`)
  }

  getTransferSentEventFilter({ indexes = {} }: GetTransferSentEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.TransferSent)
    return eventFetcher.getFilterWithIndexes(indexes)
  }

  getTransferBondedEventFilter({ indexes = {} }: GetTransferBondedEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(EventName.TransferBonded)
    return eventFetcher.getFilterWithIndexes(indexes)
  }

  addDecodedTypesToEvent(event: any): EthersEventWithDecodedTypes<TransferSent | TransferBonded> {
    const decoded = this.addDecodedTypesToEvents([event])

    return decoded?.[0]
  }

  addDecodedTypesToEvents(events: any[]): EthersEventWithDecodedTypes<TransferSent | TransferBonded>[] {
    const transferSentEventFetcher = new TransferSentEventFetcher()
    const transferBondedEventFetcher = new TransferBondedEventFetcher()

    if (events.some(event => transferSentEventFetcher.getEventNameFromTopic(event.topics[0]))) {
      return this.addDecodedTypesToTransferSentEvents(events)
    }

    if (events.some(event => transferBondedEventFetcher.getEventNameFromTopic(event.topics[0]))) {
      return this.addDecodedTypesToTransferBondedEvents(events)
    }

    return events
  }

  async #getEvents ({ fromBlock, toBlock, eventName, fetchTxData = false }: GetEventsInput) {
    let chainId = this.chainId
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

    const eventFetcher = this.getEventFetcher(eventName)
    return eventFetcher.getEventsForRange(fromBlock, toBlock, fetchTxData)
  }

  async getTransferSentEvents (input: TransferSentEventInput): Promise<EthersEventWithDecodedTypes<TransferSent>[]> {
    return this.#getEvents({ ...input, eventName: EventName.TransferSent })
  }

  async *getTransferSentEventsInBatches({ fromBlock, toBlock }: TransferSentEventInput) {
    let chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && !this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
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

  #addDecodedTypesToEvents <T>(events: any[], Fetcher: any): EthersEventWithDecodedTypes<T>[] {
    const eventFetcher = new Fetcher()
    return events.map(event => eventFetcher.addTypedEvent(event))
  }

  addDecodedTypesToTransferSentEvents (events: any[]): EthersEventWithDecodedTypes<TransferSent>[] {
    return this.#addDecodedTypesToEvents<TransferSent>(events, TransferSentEventFetcher)
  }

  addDecodedTypesToTransferBondedEvents (events: any[]): EthersEventWithDecodedTypes<TransferBonded>[] {
    return this.#addDecodedTypesToEvents<TransferBonded>(events, TransferBondedEventFetcher)
  }

  async getTransferBondedEvents (input: TransferBondedEventInput): Promise<EthersEventWithDecodedTypes<TransferBonded>[]> {
    return this.#getEvents({ ...input, eventName: EventName.TransferBonded })
  }

  getRailsGatewayContractAddress (): string {
    let chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'railsGateway')
  }

  async getRailsGatewayContract (): Promise<Contract> {
    let chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const address = this.getRailsGatewayContractAddress()
    const provider = this.getRpcProviderForChainId(chainId)
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
    let chainId = this.chainId
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
    let chainId = this.chainId
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
      send: async ({ pathId, to, amount, attestedClaimId, nextHops = [], maxTotalSent, fee }: SendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        let chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        if (!this.utils.isValidNumericValue(maxTotalSent)) {
          throw new InputError(`Invalid maxTotalSent "${maxTotalSent}"`)
        }

        if (!this.utils.isValidBytes32(attestedClaimId)) {
          throw new InputError(`Invalid attestedClaimId "${attestedClaimId}"`)
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

          if (hop.attestedClaimId) {
            if (!this.utils.isValidBytes32(hop.attestedClaimId)) {
              throw new InputError(`Invalid minAmountOut "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        if (!to) {
          to = (await this.getSignerAddress()) as string
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid "to" address "${to}"`)
        }

        const contract = await this.getRailsGatewayContract()

        if (!this.utils.isValidNumericValue(fee)) {
          throw new InputError(`Invalid amount "${fee}"`)
        }

        const txData = await contract.populateTransaction.send(pathId, to, amount, attestedClaimId, nextHops, maxTotalSent, {
          value: fee
        })

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      approveSend: async ({ pathId, amount }: ApproveSendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

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
        const provider = this.getRpcProviderForChainId(chainId)
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const address = this.getRailsGatewayContractAddress()
        const txData = await tokenContract.populateTransaction.approve(address, amount)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      bond: async ({ pathId, transferId, nextHops = []}: BondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(transferId)) {
          throw new InputError(`Invalid transferId "${transferId}"`)
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

          if (hop.attestedClaimId) {
            if (!this.utils.isValidBytes32(hop.attestedClaimId)) {
              throw new InputError(`Invalid minAmountOut "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.bond(pathId, transferId, nextHops)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      approveBond: async ({ pathId, amount }: ApproveBondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

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
        const provider = this.getRpcProviderForChainId(chainId)
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const address = this.getRailsGatewayContractAddress()
        const txData = await tokenContract.populateTransaction.approve(address, amount)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      postClaim: async ({ pathId, transferId, to, amount, totalSent, attestedClaimId, attestedTotalClaims, nextHopsHash }: PostClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

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

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        if (!this.utils.isValidNumericValue(totalSent)) {
          throw new InputError(`Invalid totalSent "${totalSent}"`)
        }

        if (!this.utils.isValidBytes32(attestedClaimId)) {
          throw new InputError(`Invalid attestedClaimId "${attestedClaimId}"`)
        }

        if (!this.utils.isValidNumericValue(attestedTotalClaims)) {
          throw new InputError(`Invalid totalSent "${attestedClaimId}"`)
        }

        if (!this.utils.isValidBytes32(nextHopsHash)) {
          throw new InputError(`Invalid nextHopsHash "${nextHopsHash}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.postClaim(pathId, transferId, to, amount, totalSent, attestedClaimId, attestedTotalClaims, nextHopsHash)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      removeClaim: async ({ pathId, transferId }: RemoveClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

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

      withdrawClaim: async ({ pathId, amount, timeWindow }: WithdrawInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

        if (!chainId || !this.utils.isValidChainId(chainId)) {
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

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction['withdraw(bytes32,uint256,uint256)'](pathId, amount, Number(timeWindow))

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      withdrawAllClaims: async ({ pathId, timeWindow }: WithdrawAllInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidNumericValue(timeWindow)) {
          throw new InputError(`Invalid timeWindow "${timeWindow}"`)
        }

        const contract = await this.getRailsGatewayContract()
        const txData = await contract.populateTransaction.withdrawAll(pathId, timeWindow)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      confirmClaim: async ({ pathId, transferId }: ConfirmClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

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
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!staker) {
          staker = (await this.getSignerAddress()) as string
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
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!staker) {
          staker = (await this.getSignerAddress()) as string
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
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

        if (!chainId || !this.utils.isValidChainId(chainId)) {
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
        let chainId = this.chainId
        if (!chainId && !this.requireChainIdInput) {
          chainId = await this.getSignerProviderChainId()
        }

        if (!chainId || !this.utils.isValidChainId(chainId)) {
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
          ...txOverrides,
          chainId: Number(chainId)
        }
      }
    }
  }

  async send (input: SendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const { pathId, amount } = input
    let chainId = this.chainId

    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

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
    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const signerAddress = (await this.getSignerAddress()) as string
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

  async approveSend (input: ApproveSendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.approveSend(input, txOverrides)
    return this.sendTransaction(txData)
  }

  async bond (input: BondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const { pathId, transferId, amount } = input
    let chainId = this.chainId

    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

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
    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const signerAddress = (await this.getSignerAddress()) as string
    const balance = await tokenContract.balanceOf(signerAddress)
    if (balance.lt(amount)) {
      throw new InsufficientBalanceError('Insufficient balance')
    }

    const address = this.getRailsGatewayContractAddress()
    const approved = await tokenContract.allowance(signerAddress, address)
    if (approved.lt(amount)) {
      throw new InsufficientApprovalError('Insufficient approval')
    }

    const populatedTx = await this.populateTransaction.bond(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async approveBond (input: ApproveBondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.approveBond(input, txOverrides)
    return this.sendTransaction(txData)
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

  async withdrawClaim (input: WithdrawInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async withdrawAllClaims (input: WithdrawAllInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawAllClaims(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async getNeedsApprovalForSend ({ pathId, amount, account }: GetNeedsApprovalForSendInput): Promise<boolean> {
    let chainId = this.chainId

    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    console.log('hopV2Sdk: rails approval token', tokenAddress)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const spender = this.getRailsGatewayContractAddress()
    account ??= (await this.getSignerAddress())!
    if (!account) {
      throw new InputError('signer not set')
    }
    console.log('hopV2Sdk: rails approval account', account)
    console.log('hopV2Sdk: rails approval spender', spender)
    const approved = await tokenContract.allowance(account, spender)
    return approved.lt(amount)
  }

  async getNeedsApprovalForBond ({ pathId, amount, account }: GetNeedsApprovalForBondInput): Promise<boolean> {
    let chainId = this.chainId

    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const spender = this.getRailsGatewayContractAddress()
    account ??= (await this.getSignerAddress())!
    if (!account) {
      throw new InputError('signer not set')
    }
    const approved = await tokenContract.allowance(account, spender)
    return approved.lt(amount)
  }

  async getLatestClaim ({ pathId }: GetLatestClaimInput): Promise<string> {
    let chainId = this.chainId

    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

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

  async getWithdrawableBalance ({ pathId, recipient, timeWindow }: WithdrawBalanceInput): Promise<BigNumber> {
    let chainId = this.chainId

    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!pathId) {
      throw new InputError('pathId is required')
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidAddress(recipient)) {
      throw new InputError(`Invalid recipient "${recipient}"`)
    }

    if (!this.utils.isValidNumericValue(timeWindow)) {
      throw new InputError(`Invalid timeWindow "${timeWindow}"`)
    }

    const contract = await this.getRailsGatewayContract()

    try {
      const balance = await contract['getWithdrawableBalance(bytes32,address,uint256)'](pathId, recipient, timeWindow)
      return balance
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async getTransferId ({ pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint }: GetTransferIdInput): Promise<string> {
    let chainId = this.chainId

    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

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
    let chainId = this.chainId

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsGatewayContract()
    return contract.hopToken()
  }

  async getMinBonderStake (): Promise<BigNumber> {
    let chainId = this.chainId
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
    let chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!address) {
      address = await this.getSignerAddress()
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
    let chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const hopTokenAddress = await this.getHopTokenAddress()
    const provider = this.getRpcProviderForChainId(chainId)
    const contract = ERC20__factory.connect(hopTokenAddress, provider)
    return contract
  }

  async getTransferSentEventFromTransactionReceipt ({ receipt }: GetTransferSentEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<TransferSent> | null> {
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!receipt) {
      throw new InputError('receipt is required')
    }
    const provider = this.getRpcProviderForChainId(chainId)
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
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }
    const provider = this.getRpcProviderForChainId(chainId)
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
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }
    const provider = this.getRpcProviderForChainId(chainId)
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

  async getTransferBondedEventFromTransactionReceipt ({ receipt }: GetTransferBondedEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<TransferBonded> | null> {
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!receipt) {
      throw new InputError('receipt is required')
    }
    const provider = this.getRpcProviderForChainId(chainId)
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
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }
    const provider = this.getRpcProviderForChainId(chainId)
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
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }
    const provider = this.getRpcProviderForChainId(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const address = this.getRailsGatewayContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${chainId}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.TransferBonded)
    const filter = eventFetcher.getTransferIdFilter(transferId)
    const toBlock = await provider.getBlockNumber()
    const events = await eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock, { returnOnFirstMatch: true })
    return events?.[0] ?? null
  }

  async getTokenInfo ({ address }: GetTokenInfoInput): Promise<Token> {
    let chainId = this.chainId
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
    let chainId = this.chainId
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

  async getHasSufficientBalance ({ tokenAddress, amount, account }: GetHasSufficientBalanceInput): Promise<boolean> {
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
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
    account ??= (await this.getSignerAddress())!
    if (!account) {
      throw new InputError('signer not set')
    }
    const balance = await tokenContract.balanceOf(account)
    return balance.lt(amount)
  }

  async getIsClaimIdValid ({ pathId, claimId }: GetIsClaimIdValidInput): Promise<boolean> {
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

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
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

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

  async getIsTransferBonded ({ transferId }: GetIsTransferBondedInput): Promise<boolean> {
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }

    // TODO: call contract state once it's available
    return false
  }

  async getIsTransferClaimed ({ transferId }: GetIsTransferClaimedInput): Promise<boolean> {
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }

    // TODO: call contract state once it's available
    return false
  }

  async getIsPathIdLive ({ pathId }: GetIsPathIdLiveInput): Promise<boolean> {
    let chainId = this.chainId
    if (!chainId && !this.requireChainIdInput) {
      chainId = await this.getSignerProviderChainId()
    }

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
  }

  getNextHopsHash ({ nextHops }: GetNextHopsHashInput): string {
    return RailsGateway.getNextHopsHash({ nextHops })
  }

  static getNextHopsHash ({ nextHops }: GetNextHopsHashInput): string {
    if (!nextHops || !Array.isArray(nextHops)) {
      throw new InputError('Invalid nextHops')
    }

    if (nextHops.length === 0) return constants.HashZero

    const encodedHops = utils.defaultAbiCoder.encode(
      ['bytes32[]', 'uint256[]', 'bytes32[]'],
      [
        nextHops.map(hop => hop.pathId),
        nextHops.map(hop => hop.maxTotalSent),
        nextHops.map(hop => hop.attestedClaimId)
      ]
    )

    return utils.keccak256(encodedHops)
  }

  static getTransferSentEventSignature (): string {
    const eventFetcher = new TransferSentEventFetcher()
    return eventFetcher.getTopic0()
  }

  static getTransferBondedEventSignature (): string {
    const eventFetcher = new TransferBondedEventFetcher()
    return eventFetcher.getTopic0()
  }
}

