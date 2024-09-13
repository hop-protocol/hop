import { Base } from '#common/index.js'
import { BigNumber, BigNumberish, Signer, providers, Event as EthersEvent, Contract } from 'ethers'
import { EventFetcher, InputFilter, Filter, Event } from '#events/index.js'
import { GasPriceOracle } from '#gasPriceOracle/index.js'
import { Messenger, FeesSentToHub, BundleCommitted, BundleForwarded, BundleReceived, BundleSet, MessageBundled, MessageExecuted, MessageSent } from '#messenger/index.js'
import { HubConnector, ConnectTargetsInput } from '#hubConnector/index.js'
import { RailsGateway, GetPathInfoInput, Path, GetTokenContractInput, GetTransferStatusInput, TransferStatus, TransferBonded, TransferSent, HopStruct, CalcAmountOutMinInput } from '#railsGateway/index.js'
import { Addresses } from '#addresses/types.js'
import { ConfigError, InputError, CustomError } from '#error/index.js'
import { EthersEventWithDecodedTypes, EthersEventWithDecodedTypesAndContext } from '#events/index.js'

export type AllEventTypes = TransferSent | TransferBonded | FeesSentToHub | BundleCommitted | BundleForwarded | BundleReceived | BundleSet | MessageBundled | MessageExecuted | MessageSent

export type HopConstructorInput = {
  network: string
  batchBlocks?: number,
  signer?: Signer
  contractAddresses?: Addresses
  requireChainIdInput?: boolean
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

export class Hop extends Base {
  private readonly eventFetcher: EventFetcher
  private readonly providers: Record<string, providers.Provider> = {}
  private readonly gasPriceOracle: GasPriceOracle
  readonly messenger: Messenger
  readonly railsGateway: RailsGateway
  readonly hubConnector: HubConnector

  constructor(options?: HopConstructorInput) {
    if (!options) {
      throw new ConfigError('options is required')
    }

    const { network, signer } = options
    super({ network, signer })

    if (!['mainnet', 'sepolia'].includes(network)) {
      throw new ConfigError(`Invalid network: ${network}`)
    }

    const sharedConfig = { network, signer: this.signer, contractAddresses: this.contractAddresses }
    this.messenger = new Messenger(sharedConfig)
    this.hubConnector = new HubConnector(sharedConfig)
    this.railsGateway = new RailsGateway(sharedConfig)
    this.gasPriceOracle = new GasPriceOracle(network)
    this.network = network
  }

  override connect (signer: Signer) {
    return new Hop({ network: this.network, signer, contractAddresses: this.contractAddresses })
  }

  get version () {
    return '0.0.1' // TODO
  }

  getRailsGateway() {
    return this.railsGateway
  }

  getMessenger() {
    return this.messenger
  }

  getHubConnectorContractAddress (chainId: BigNumberish): string {
    return this.hubConnector.getHubConnectorContractAddress(chainId)
  }

  getRailsGatewayContractAddress (chainId: BigNumberish): string {
    return this.railsGateway.getRailsGatewayContractAddress(chainId)
  }

  get populateTransaction() {
    return {
      sendTokens: async ({ fromChainId, toChainId, fromToken, toToken, amount, minAmountOut, to }: SendTokensInput): Promise<providers.TransactionRequest> => {
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
          to = (await this.getSignerAddress()) as string
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid "to" address "${to}"`)
        }

        const pathId = await this.railsGateway.getPathId({
          chainId0: fromChainId,
          token0: fromToken,
          chainId1: toChainId,
          token1: toToken
        })

        console.log('hopV2Sdk: pathId', pathId)
        const attestedClaimId = await this.railsGateway.getLatestClaim({
          chainId: fromChainId,
          pathId
        })
        console.log('hopV2Sdk: attestedClaimId', attestedClaimId)

        let isClaimIdValid = await this.railsGateway.getIsClaimIdValid({
          chainId: toChainId,
          pathId,
          claimId: attestedClaimId
        })

        console.log('hopV2Sdk: isClaimIdValid', isClaimIdValid)

        // new path without checkpoints will return 0 bytes32
        if (!isClaimIdValid && BigNumber.from(attestedClaimId).eq(0)) {
          isClaimIdValid = true
        }

        if (!isClaimIdValid) {
          throw new CustomError('Latest attestedClaimId is invalid')
        }

        const maxTotalSent = await this.railsGateway.getTotalSent({ chainId: fromChainId, pathId })

        const nextHops: HopStruct[] = []

        const fee = await this.railsGateway.getFee({ chainId: toChainId, pathId })

        const populatedTx = await this.railsGateway.populateTransaction.send({
          chainId: fromChainId,
          pathId,
          to,
          amount,
          attestedClaimId,
          nextHops,
          maxTotalSent,
          fee
        })

        console.log('hopV2Sdk: populatedTx', populatedTx)

        return populatedTx
      },

      approveSendTokens: async ({ fromChainId, toChainId, fromToken, toToken, amount }: ApproveSendTokensInput): Promise<providers.TransactionRequest> => {
        const pathId = await this.railsGateway.getPathId({
          chainId0: fromChainId,
          token0: fromToken,
          chainId1: toChainId,
          token1: toToken
        })

        const populatedTx = await this.railsGateway.populateTransaction.approveSend({
          chainId: fromChainId,
          pathId,
          amount
        })

        return populatedTx
      }
    }
  }

  async sendTokens (input: SendTokensInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.sendTokens(input)
    return this.sendTransaction(populatedTx)
  }

  async approveSendTokens (input: ApproveSendTokensInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.approveSendTokens(input)
    return this.sendTransaction(populatedTx)
  }

  async getNeedsApprovalForSendTokens (input: GetNeedsApprovalForSendTokensInput): Promise<boolean> {
    const { fromChainId, fromToken, toChainId, toToken, amount, account } = input
    const pathId = await this.railsGateway.getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken
    })
    console.log('hopV2Sdk: getPathId', pathId)
    return this.railsGateway.getNeedsApprovalForSend({ chainId: fromChainId, pathId, amount, account })
  }

  async getPathInfo (input: GetPathInfoInput): Promise<Path> {
    return this.railsGateway.getPathInfo(input)
  }

  async connectTargets (input: ConnectTargetsInput): Promise<{tx: providers.TransactionResponse, connectorAddress: string}> {
    const tx = await this.hubConnector.connectTargets(input)
    const connectorAddress = await this.hubConnector.getConnectorAddressFromTx(tx)
    return { tx, connectorAddress }
  }

  async switchChain (chainId: BigNumberish): Promise<void> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId: ${chainId}`)
    }

    if (!this.signer) {
      throw new ConfigError('No signer connected to switch chains')
    }

    if (!this.signer.provider) {
      throw new ConfigError('No provider connected to signer')
    }

    await this.utils.switchChain(chainId, this.signer.provider)
  }

  async getSendFee ({ fromChainId, fromToken, toChainId, toToken }: GetSendFeeInput): Promise<BigNumber> {
    const pathId = await this.railsGateway.getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken
    })

    return this.railsGateway.getFee({
      chainId: fromChainId,
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
    const pathId = await this.railsGateway.getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken
    })

    const attestedClaimId  = await this.railsGateway.getLatestClaim({
      chainId: fromChainId,
      pathId
    })

    const maxTotalSent = await this.railsGateway.getTotalSent({ chainId: toChainId, pathId })

    const nextHops: HopStruct[] = []

    const fee = await this.railsGateway.getFee({ chainId: toChainId, pathId })

    const populatedTx = await this.railsGateway.populateTransaction.send({
      chainId: fromChainId,
      pathId,
      to,
      amount,
      attestedClaimId,
      nextHops,
      maxTotalSent,
      fee
    })

    const provider = this.getRpcProviderForChainId(fromChainId)
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
    return this.railsGateway.getTokenContract({ chainId, address })
  }

  async getTransferStatus(input: GetTransferStatusInput): Promise<TransferStatus> {
    return this.railsGateway.getTransferStatus(input)
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

    const provider = this.getRpcProviderForChainId(chainId)
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
      ...this.railsGateway.getEventNames()
    ]

    for (const name of eventNames) {
      let subclass: any = null
      if (this.messenger.getEventNames().includes(name)) {
        subclass = this.messenger
      } else if (this.railsGateway.getEventNames().includes(name)) {
        subclass = this.railsGateway
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

  override setChainRpcProviderUrls (chainProviders: Record<string, string | string[]>): void {
    super.setChainRpcProviderUrls(chainProviders)
    this.railsGateway.setChainRpcProviderUrls(chainProviders)
    this.messenger.setChainRpcProviderUrls(chainProviders)
    this.hubConnector.setChainRpcProviderUrls(chainProviders)
  }

  async getTransferIdFromTransactionHash ({ chainId, transactionHash}: GetTransferIdFromTransactionHashInput): Promise<string> {
    const transferSentEvent = await this.railsGateway.getTransferSentEventFromTransactionHash({
      chainId,
      transactionHash
    })

    if (!transferSentEvent) {
      throw new CustomError(`TransferSent event not found for transaction hash "${transactionHash}" on chainId "${chainId}", could not get transferId`)
    }

    return transferSentEvent.decoded.transferId
  }

  calcAmountOutMin (input: CalcAmountOutMinInput): BigNumber {
    return this.railsGateway.calcAmountOutMin(input)
  }
}
