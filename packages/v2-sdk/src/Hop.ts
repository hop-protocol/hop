import { Base, SignersOrProviders, TxOverrides } from '#common/index.js'
import { BigNumber, BigNumberish, Signer, providers, Event as EthersEvent, Contract } from 'ethers'
import { EventFetcher, InputFilter, Filter, Event } from '#events/index.js'
import { GasPriceOracle } from '#gasPriceOracle/index.js'
import { Messenger, FeesSentToHub, BundleCommitted, BundleForwarded, BundleReceived, BundleSet, MessageBundled, MessageExecuted, MessageSent, EventName as MessengerEventName } from '#messenger/index.js'
import { HubConnector, ConnectTargetsInput } from '#hubConnector/index.js'
import { RailsGateway, Path, TransferBonded, TransferSent, HopStruct, EventName as RailsGatewayEventName } from '#railsGateway/index.js'
import { Addresses } from '#addresses/types.js'
import { ConfigError, InputError, CustomError } from '#error/index.js'
import { EthersEventWithDecodedTypes, EthersEventWithDecodedTypesAndContext } from '#events/index.js'
import { getBlockNumberFromDate } from '@hop-protocol/sdk'
import memcache from 'memory-cache'

const cache = new memcache.Cache()

export type AllEventTypes = TransferSent | TransferBonded | FeesSentToHub | BundleCommitted | BundleForwarded | BundleReceived | BundleSet | MessageBundled | MessageExecuted | MessageSent

export enum EventName {
  TransferSent = RailsGatewayEventName.TransferSent,
  TransferBonded = RailsGatewayEventName.TransferBonded,

  BundleCommitted = MessengerEventName.BundleCommitted,
  BundleForwarded = MessengerEventName.BundleForwarded,
  BundleReceived = MessengerEventName.BundleReceived,
  BundleSet = MessengerEventName.BundleSet,
  FeesSentToHub = MessengerEventName.FeesSentToHub,
  MessageBundled = MessengerEventName.MessageBundled,
  MessageExecuted = MessengerEventName.MessageExecuted,
  MessageSent = MessengerEventName.MessageSent,
}

export type HopConstructorInput = {
  batchBlocks?: number,
  contractAddresses?: Addresses
  signersOrProviders: SignersOrProviders
}

export type GetEventsInput = {
  chainId: BigNumberish
  fromBlock: number
  toBlock?: number
}

export type GetGeneralEventsInput = {
  eventName?: string
  eventNames?: string[]
  chainId: BigNumberish
  fromBlock: number
  toBlock?: number
  fetchTxData?: boolean
}

export type SendTokensInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  fromToken: string
  toToken: string
  to?: string
  amount: BigNumberish
  minAmountOut: BigNumberish
  attestedClaimId?: string
}

export type GetSendDataInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  fromToken: string
  toToken: string
  to?: string
  amount: BigNumberish
  minAmountOut: BigNumberish
}

export type SendData = {
  amountIn: BigNumber
  estimatedReceived: BigNumber
  bonderFee: BigNumber
  routeChainIds: string[]
}

export type WillSendTokensFailInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  fromToken: string
  toToken: string
  to: string
  amount: BigNumberish
  minAmountOut: BigNumberish
  from: string
}

export type ApproveSendTokensInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  fromToken: string
  toToken: string
  amount: BigNumberish
}

export type GetNeedsApprovalForSendTokensInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  fromToken: string
  toToken: string
  amount: BigNumberish
  account?: string
}

export type GetSendFeeInput = {
  fromChainId: BigNumberish
  fromToken: string
  toChainId: BigNumberish
  toToken: string
}

export type GetTransferIdFromTransactionHashInput = {
  chainId: BigNumberish
  transactionHash: string
}

export type GetTransferStatusInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  transferId: string
}

export enum TransferState {
  PendingBond = 'PendingBond',
  Bonded = 'Bonded',
  NotFound = 'NotFound'
}

export type TransferStatus = {
  state: TransferState
  transferId: string
  transferSentEvent: EthersEventWithDecodedTypes<TransferSent>
  transferBondedEvent: EthersEventWithDecodedTypes<TransferBonded> | null
}

export type CalcAmountOutMinInput = {
  amountOut: BigNumberish,
  slippageTolerance: number
}

export type GetPathInfoInput = {
  chainId: BigNumberish
  pathId: string
}

export type GetTokenContractInput = {
  chainId: BigNumberish
  address: string
}

export class Hop extends Base {
  private readonly eventFetcher: EventFetcher
  private readonly providers: Record<string, providers.Provider> = {}
  private readonly gasPriceOracle: GasPriceOracle
  readonly messenger: Messenger
  readonly railsGateways: Record<string, RailsGateway> = {}
  readonly hubConnector: HubConnector

  constructor(options?: HopConstructorInput) {
    if (!options) {
      throw new ConfigError('options is required')
    }

    const { signersOrProviders } = options
    super({ signersOrProviders })

    if (Object.keys(signersOrProviders).length < 2) {
      throw new ConfigError('At least 2 providers are needed for instantiation. Please provide a source provider and destination provider.')
    }

    const sharedConfig = { contractAddresses: this.contractAddresses, signersOrProviders: this.signersOrProviders }
    this.messenger = new Messenger(sharedConfig)
    this.hubConnector = new HubConnector(sharedConfig)
    this.gasPriceOracle = new GasPriceOracle(this.network)
  }

  get version () {
    return '0.0.1' // TODO
  }

  getMessenger() {
    return this.messenger
  }

  getHubConnectorContractAddress (chainId: BigNumberish): string {
    return this.hubConnector.getHubConnectorContractAddress(chainId)
  }

  getRailsGatewayContractAddress (chainId: BigNumberish): string {
    return this.getRailsGateway(chainId).getRailsGatewayContractAddress()
  }

  get populateTransaction() {
    return {
      sendTokens: async ({ fromChainId, toChainId, fromToken, toToken, amount, minAmountOut, to, attestedClaimId }: SendTokensInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(fromChainId)) {
          throw new InputError(`Invalid fromChainId "${fromChainId}"`)
        }

        if (!this.utils.isValidChainId(toChainId)) {
          throw new InputError(`Invalid toChainId "${toChainId}"`)
        }

        if (!this.utils.isValidAddress(fromToken)) {
          throw new InputError(`Invalid fromToken "${fromToken}"`)
        }

        if (!this.utils.isValidAddress(toToken)) {
          throw new InputError(`Invalid toToken "${toToken}"`)
        }

        if (!this.utils.isValidNumericValue(minAmountOut)) {
          throw new InputError(`Invalid minAmountOut "${minAmountOut}"`)
        }

        if (!to) {
          to = (await this.getSignerAddress(fromChainId)) as string
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid "to" address "${to}"`)
        }

        const pathId = await this.getRailsGateway(fromChainId).getPathId({
          chainId0: fromChainId,
          token0: fromToken,
          chainId1: toChainId,
          token1: toToken
        })

        let isClaimIdValid = false

        if (attestedClaimId) {
          if (!this.utils.isValidBytes32(attestedClaimId)) {
            throw new InputError(`Invalid attestedClaimid "${attestedClaimId}"`)
          }
        }

        if (attestedClaimId == null) {
          console.log('hopV2Sdk: pathId', pathId)
          attestedClaimId = await this.getRailsGateway(fromChainId).getHeadClaim({
            pathId
          })
          console.log('hopV2Sdk: attestedClaimId', attestedClaimId)

          isClaimIdValid = await this.getRailsGateway(toChainId).getIsClaimIdValid({
            pathId,
            claimId: attestedClaimId
          })

          console.log('hopV2Sdk: isClaimIdValid', isClaimIdValid)
        }

        // new path without checkpoints will return 0 bytes32
        if (!isClaimIdValid && BigNumber.from(attestedClaimId).eq(0)) {
          isClaimIdValid = true
        }

        if (!isClaimIdValid) {
          throw new CustomError('Latest attestedClaimId is invalid')
        }

        const maxTotalSent = await this.getRailsGateway(fromChainId).getTotalSent({ pathId })

        const nextHops: HopStruct[] = []

        const fee = await this.getRailsGateway(toChainId).getFee({ pathId })

        const populatedTx = await this.getRailsGateway(fromChainId).populateTransaction.send({
          pathId,
          to,
          amount,
          attestedClaimId,
          nextHops,
          maxTotalSent,
          fee
        }, txOverrides)

        console.log('hopV2Sdk: populatedTx', populatedTx)

        return populatedTx
      },

      approveSendTokens: async ({ fromChainId, toChainId, fromToken, toToken, amount }: ApproveSendTokensInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const pathId = await this.getRailsGateway(fromChainId).getPathId({
          chainId0: fromChainId,
          token0: fromToken,
          chainId1: toChainId,
          token1: toToken
        })

        const populatedTx = await this.getRailsGateway(fromChainId).populateTransaction.approveSend({
          pathId,
          amount
        }, txOverrides)

        return populatedTx
      }
    }
  }

  async sendTokens (input: SendTokensInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.sendTokens(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async approveSendTokens (input: ApproveSendTokensInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.approveSendTokens(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async getNeedsApprovalForSendTokens (input: GetNeedsApprovalForSendTokensInput): Promise<boolean> {
    const { fromChainId, fromToken, toChainId, toToken, amount, account } = input
    const pathId = await this.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken
    })
    console.log('hopV2Sdk: getPathId', pathId)
    return this.getRailsGateway(fromChainId).helpers.getNeedsApprovalForSend({ pathId, amount, account })
  }

  async getPathInfo ({ chainId, pathId }: GetPathInfoInput): Promise<Path> {
    return this.getRailsGateway(chainId).getPathInfo({ pathId })
  }

  async connectTargets (input: ConnectTargetsInput, txOverrides: TxOverrides = {}): Promise<{tx: providers.TransactionResponse, connectorAddress: string}> {
    const tx = await this.hubConnector.connectTargets(input, txOverrides)
    const connectorAddress = await this.hubConnector.getConnectorAddressFromTx(tx)
    return { tx, connectorAddress }
  }

  async switchChain (chainId: BigNumberish): Promise<void> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId: ${chainId}`)
    }

    const signer = await this.getSigner(chainId)

    if (!signer) {
      throw new ConfigError('No signer connected to switch chains')
    }

    if (!signer.provider) {
      throw new ConfigError('No provider connected to signer')
    }

    await this.utils.switchChain(chainId, signer.provider)
  }

  async getSendFee ({ fromChainId, fromToken, toChainId, toToken }: GetSendFeeInput): Promise<BigNumber> {
    const pathId = await this.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken
    })

    return this.getRailsGateway(fromChainId).getFee({
      pathId
    })
  }

  async getWillSendTokensFail ({
    fromChainId,
    toChainId,
    fromToken,
    toToken,
    to,
    amount,
    minAmountOut,
    from
  }: WillSendTokensFailInput): Promise<boolean> {
    const pathId = await this.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken
    })

    const attestedClaimId  = await this.getRailsGateway(fromChainId).getHeadClaim({
      pathId
    })

    const maxTotalSent = await this.getRailsGateway(toChainId).getTotalSent({ pathId })

    const nextHops: HopStruct[] = []

    const fee = await this.getRailsGateway(toChainId).getFee({ pathId })

    const populatedTx = await this.getRailsGateway(fromChainId).populateTransaction.send({
      pathId,
      to,
      amount,
      attestedClaimId,
      nextHops,
      maxTotalSent,
      fee
    })

    const provider = this.getProvider(fromChainId)
    if (!provider) {
      throw new CustomError(`Provider not found for chainId: ${fromChainId}`)
    }

    return this.utils.willTransactionFail(provider, { ...populatedTx, from })
  }

  async getEstimatedReceived({ fromChainId, toChainId, fromToken, toToken, amount, minAmountOut }: SendTokensInput): Promise<BigNumber> {
    // TODO: will fill in once we have contract implementation for this
    return BigNumber.from(amount)
  }

  async getSendData ({ fromChainId, toChainId, fromToken, toToken, amount, minAmountOut }: GetSendDataInput ): Promise<SendData> {
    const amountIn = BigNumber.from(amount)
    const estimatedReceived = await this.getEstimatedReceived({ fromChainId, toChainId, fromToken, toToken, amount, minAmountOut })
    const bonderFee = await this.getSendFee({ fromChainId, fromToken, toChainId, toToken })
    const routeChainIds = [fromChainId, toChainId].map((id) => id.toString())

    return {
      amountIn,
      estimatedReceived,
      bonderFee,
      routeChainIds,
    }
  }

  getTokenContract ({ chainId, address }: GetTokenContractInput): Contract {
    return this.getRailsGateway(chainId).getTokenContract({ address })
  }

  async getEvents({
    eventName,
    eventNames,
    chainId,
    fromBlock,
    toBlock,
    fetchTxData
  }: GetGeneralEventsInput): Promise<EthersEventWithDecodedTypesAndContext<AllEventTypes>[]> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }
    if (!fromBlock) {
      throw new InputError('fromBlock is required')
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new CustomError(`Provider not found for chainId: ${chainId}`)
    }

    const latestBlock = await provider.getBlockNumber()
    toBlock = toBlock ?? latestBlock
    fromBlock = fromBlock ?? (latestBlock - 1000)

    if (fromBlock < 0) {
      fromBlock = toBlock + fromBlock
    }

    if (eventName) {
      eventNames = [eventName]
    }

    if (!eventNames?.length) {
      throw new InputError('expected eventName or eventNames')
    }

    const filters: Filter[] = []
    const eventFetcher = new EventFetcher({ provider, batchBlocks: this.batchBlocks })
    const eventFetcherMap: Record<string, Event<any>> = {} // TODO: type

    const allEventNames = [
      ...this.messenger.getEventNames(),
      ...this.getRailsGateway(chainId).getEventNames()
    ]

    for (const name of eventNames) {
      let subclass: any = null
      if (this.messenger.getEventNames().includes(name)) {
        subclass = this.messenger
      } else if (this.getRailsGateway(chainId).getEventNames().includes(name)) {
        subclass = this.getRailsGateway(chainId)
      }

      if (subclass) {
        const fetcher = subclass.getEventFetcher(name, chainId)
        const filter = fetcher.getFilter()
        filters.push(filter)
        eventFetcherMap[filter.topics?.[0] as string] = fetcher
      }
    }

    const options = { fromBlock: fromBlock as number, toBlock: toBlock as number }
    const events = await eventFetcher.fetchEvents(filters as InputFilter[], options)

    const decoded: EthersEvent[] = []
    for (const event of events) {
      const res = await eventFetcherMap[event.topics[0] as string].populateEvents([event], fetchTxData) as EthersEvent[]
      decoded.push(...res)
    }

    return decoded as EthersEventWithDecodedTypesAndContext<AllEventTypes>[]
  }

  override setProviderUrls (signersOrProviders: Record<string, string | string[]>): void {
    super.setProviderUrls(signersOrProviders)
    this.messenger.setProviderUrls(signersOrProviders)
    this.hubConnector.setProviderUrls(signersOrProviders)

    for (const chainId in signersOrProviders) {
      this.getRailsGateway(chainId).setProviderUrls(signersOrProviders)
    }
  }

  async getTransferIdFromTransactionHash ({ chainId, transactionHash}: GetTransferIdFromTransactionHashInput): Promise<string> {
    const transferSentEvent = await this.getRailsGateway(chainId).getTransferSentEventFromTransactionHash({
      transactionHash
    })

    if (!transferSentEvent) {
      throw new CustomError(`TransferSent event not found for transaction hash "${transactionHash}" on chainId "${chainId}", could not get transferId`)
    }

    return transferSentEvent.decoded.transferId
  }

  static calcAmountOutMin ({ amountOut, slippageTolerance }: CalcAmountOutMinInput): BigNumber {
    // if (!this.utils.isValidNumericValue(amountOut)) {
    //   throw new InputError(`Invalid amountOut "${amountOut}"`)
    // }

    // if (!this.utils.isValidNumericValue(slippageTolerance)) {
    //   throw new InputError(`Invalid slippageTolerance "${slippageTolerance}"`)
    // }

    amountOut = BigNumber.from(amountOut.toString())
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    return amountOut.mul(minBps).div(10000)
  }

  calcAmountOutMin ({ amountOut, slippageTolerance }: CalcAmountOutMinInput): BigNumber {
    return Hop.calcAmountOutMin({ amountOut, slippageTolerance })
  }

  async getTransferStatus({ fromChainId, toChainId, transferId }: GetTransferStatusInput): Promise<TransferStatus> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }

    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }

    const transferSentEvent = await this.getRailsGateway(fromChainId).getTransferSentEventFromTransferId({
      transferId
    })

    let transferBondedEvent: EthersEventWithDecodedTypes<TransferBonded> | null = null

    if (transferSentEvent) {
      const fromProvider = this.getProvider(fromChainId)
      if (!fromProvider) {
        throw new ConfigError('fromChainId provider not found')
      }
      const toProvider = this.getProvider(toChainId)
      if (!toProvider) {
        throw new ConfigError('toChainId provider not found')
      }
      const fromBlock = await fromProvider.getBlock(transferSentEvent.blockNumber)
      const fromTimestamp = fromBlock.timestamp
      const earliestBlock = await getBlockNumberFromDate(toProvider, fromTimestamp)

      transferBondedEvent = await this.getRailsGateway(toChainId).getTransferBondedEventFromTransferId({
        transferId,
        fromBlock: earliestBlock
      })
    }

    let transferState = TransferState.NotFound

    if (transferSentEvent && !transferBondedEvent) {
      transferState = TransferState.PendingBond
    }

    if (transferSentEvent && transferBondedEvent) {
      transferState = TransferState.Bonded
    }

    return {
      state: transferState,
      transferId: transferSentEvent?.decoded.transferId ?? '',
      transferSentEvent,
      transferBondedEvent
    }
  }

  getRailsGateway (chainId: BigNumberish): RailsGateway {
    chainId = chainId?.toString()
    const key = `RailsGateway:${chainId}`
    let instance = cache.get(key) as RailsGateway
    if (!instance) {
      instance = new RailsGateway({
        chainId,
        signerOrProvider: this.signersOrProviders[chainId]
      })

      cache.put(key, instance)
    }

    return instance
  }
}
