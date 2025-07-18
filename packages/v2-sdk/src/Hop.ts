import { Base, SignersOrProviders, TxOverrides } from '#common/index.js'
import { BigNumber, BigNumberish, providers, Event as EthersEvent, Contract, constants } from 'ethers'
import { EventFetcher, InputFilter, Filter, Event } from '#events/index.js'
import { GasPriceOracle } from '#gasPriceOracle/index.js'
import { Messenger, FeesSentToHub, BundleCommitted, BundleForwarded, BundleReceived, BundleSet, MessageBundled, MessageExecuted, MessageSent, EventName as MessengerEventName } from '#messenger/index.js'
import { HubConnector, ConnectTargetsInput } from '#hubConnector/index.js'
import { RailsGateway, Path, TransferBonded, TransferSent, HopStructInput, EventName as RailsGatewayEventName, PathInitialized } from '#railsGateway/index.js'
import { EventName as StakingRegistryEventName } from '#railsGateway/StakingRegistry.js'
import { EventName as RailsPathEventName, RailsPath } from '#railsGateway/RailsPath.js'
import { Addresses } from '#addresses/types.js'
import { ConfigError, InputError, CustomError } from '#error/index.js'
import { EthersEventWithDecodedTypes, EthersEventWithDecodedTypesAndContext } from '#events/index.js'
import { getBlockNumberFromDate } from '@hop-protocol/sdk'
import { fetchJsonOrThrow } from '@hop-protocol/sdk'
import memcache from 'memory-cache'

const cache = new memcache.Cache()

export type AllEventTypes = TransferSent | TransferBonded | FeesSentToHub | BundleCommitted | BundleForwarded | BundleReceived | BundleSet | MessageBundled | MessageExecuted | MessageSent | PathInitialized

export enum EventName {
  TransferSent = RailsPathEventName.TransferSent,
  TransferBonded = RailsPathEventName.TransferBonded,
  ClaimPushed = RailsPathEventName.ClaimPushed,
  ClaimReadded = RailsPathEventName.ClaimReadded,
  ClaimRemoved = RailsPathEventName.ClaimRemoved,
  BonderPreference = StakingRegistryEventName.BonderPreference,
  PathInitialized = RailsGatewayEventName.PathInitialized,

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
  network?: string
  batchBlocks?: number
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
  to: string
  amount: BigNumberish
  minAmountOut: BigNumberish
  attestedClaimId?: string
}

export type GetEstimatedReceivedInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  fromToken: string
  toToken: string
  amount: BigNumberish
  minAmountOut: BigNumberish
}

export type GetAmountOutInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  fromToken: string
  toToken: string
  amount: BigNumberish
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
  amountOut: BigNumber
  estimatedReceived: BigNumber
  sendFee: BigNumber
  maxBonderFee: BigNumber
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
  transferId?: string
  transactionHash?: string
  fromChainId?: BigNumberish
  toChainId?: BigNumberish
}

export type GetTransferStatusFromEventsInput = {
  transferId: string
  fromChainId: BigNumberish
  toChainId: BigNumberish
}

export type GetTransferStatusFromApiInput = {
  transferId?: string
  transactionHash?: string
  chainId?: BigNumberish
}

export enum TransferState {
  PendingBond = 'PendingBond',
  Bonded = 'Bonded',
  NotFound = 'NotFound'
}

// TODO: replace with actual Event type once it's available
type ClaimWithdrawn = {
  claimId: string
  pathId: string
}

export type TransferStatus = {
  state: TransferState
  transferId: string
  transferSentEvent: EthersEventWithDecodedTypes<TransferSent> | null
  transferBondedEvents: EthersEventWithDecodedTypes<TransferBonded>[]
  claimWithdrawnEvents: EthersEventWithDecodedTypes<ClaimWithdrawn>[]
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

export type GetMaxBonderFeeInput = {
  amountIn: BigNumberish
}

export type EstimateGasCostForSendInput = {
  from: string
  fromChainId: BigNumberish
  toChainId: BigNumberish
  fromToken: string
  toToken: string
  to?: string
  amount: BigNumberish
  minAmountOut: BigNumberish
  gasPrice?: BigNumberish
}

export class Hop extends Base {
  static EventName = EventName
  private readonly eventFetcher: EventFetcher
  private readonly providers: Record<string, providers.Provider> = {}
  private readonly gasPriceOracle: GasPriceOracle
  readonly railsGateways: Record<string, RailsGateway> = {}
  readonly hubConnector: HubConnector

  constructor(options?: HopConstructorInput) {
    if (!options) {
      throw new ConfigError('options is required')
    }

    const { signersOrProviders } = options
    super({ signersOrProviders, network: options.network })

    if (Object.keys(signersOrProviders).length < 2) {
      throw new ConfigError('At least 2 providers are needed for instantiation. Please provide a source provider and destination provider.')
    }

    const sharedConfig = { contractAddresses: this.contractAddresses, signersOrProviders: this.signersOrProviders, network: this.network }
    this.hubConnector = new HubConnector(sharedConfig)
    this.gasPriceOracle = new GasPriceOracle(this.network)
  }

  get version () {
    return '0.0.1' // TODO: get version from package.json
  }

  getMessenger(chainId: BigNumberish):Messenger {
    chainId = chainId?.toString()
    const key = `Messenger:${chainId}`
    let instance = cache.get(key) as Messenger
    if (!instance) {
      instance = new Messenger({
        network: this.network,
        chainId,
        signerOrProvider: this.signersOrProviders[chainId]
      })

      cache.put(key, instance)
    }

    return instance
  }

  getHubConnectorContractAddress (chainId: BigNumberish): string {
    return this.hubConnector.getHubConnectorContractAddress(chainId)
  }

  getRailsGatewayContractAddress (chainId: BigNumberish): string {
    return this.getRailsGateway(chainId).getRailsGatewayContractAddress()
  }

  get populateTransaction() {
    return {
      sendTokensMultiHop: async ({ fromChainId: originChainId, toChainId: destChainId, fromToken: originToken, toToken: destToken, amount, minAmountOut, to, attestedClaimId }: SendTokensInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(originChainId)) {
          throw new InputError(`Invalid fromChainId "${originChainId}"`)
        }

        if (!this.utils.isValidChainId(destChainId)) {
          throw new InputError(`Invalid toChainId "${destChainId}"`)
        }

        if (originChainId?.toString() === destChainId?.toString()) {
          throw new InputError('fromChainId and toChainId must be different')
        }

        if (!this.utils.isValidAddress(originToken)) {
          throw new InputError(`Invalid fromToken "${originToken}"`)
        }

        if (!this.utils.isValidAddress(destToken)) {
          throw new InputError(`Invalid toToken "${destToken}"`)
        }

        if (!this.utils.isValidNumericValue(minAmountOut)) {
          throw new InputError(`Invalid minAmountOut "${minAmountOut}"`)
        }

        if (!to) {
          to = (await this.getSignerAddress(originChainId)) as string
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid "to" address "${to}"`)
        }

        const nextChainId = this.getHubChainId()
        const tokenSymbol = this.getTokenSymbolByTokenAddress(originChainId, originToken)
        const nextToken = this.getTokenAddressByTokenSymbol(nextChainId, tokenSymbol)

        const initialReserve = await this.getRailsGateway(originChainId).helpers.getInitialReserveByTokenSymbol({ tokenSymbol })

        const originPathId = await this.getRailsGateway(originChainId).getPathId({
          chainId0: originChainId,
          token0: originToken,
          chainId1: nextChainId,
          token1: nextToken,
          initialReserve
        })

        console.log('hopV2Sdk: originPathId', originPathId)
        console.log({
          chainId0: nextChainId,
          token0: nextToken,
          chainId1: destChainId,
          token1: destToken,
          initialReserve
        })

        const destPathId = await this.getRailsGateway(nextChainId).getPathId({
          chainId0: nextChainId,
          token0: nextToken,
          chainId1: destChainId,
          token1: destToken,
          initialReserve
        })

        console.log('hopV2Sdk: destPathId', destPathId)

        let isClaimIdValid = false

        if (attestedClaimId) {
          if (!this.utils.isValidBytes32(attestedClaimId)) {
            throw new InputError(`Invalid attestedClaimid "${attestedClaimId}"`)
          }
        }

        if (attestedClaimId == null) {
          console.log('hopV2Sdk: pathId', destPathId)
          attestedClaimId = await this.getRailsGateway(originChainId).helpers.getHeadClaimId({
            pathId: originPathId
          })
          console.log('hopV2Sdk: attestedClaimId', attestedClaimId)

          isClaimIdValid = await this.getRailsGateway(nextChainId).helpers.isValidClaim({
            pathId: originPathId,
            claimId: attestedClaimId
          })

          console.log('hopV2Sdk: isClaimIdValid', isClaimIdValid)
        } else {
          isClaimIdValid = await this.getRailsGateway(nextChainId).helpers.isValidClaim({
            pathId: originPathId,
            claimId: attestedClaimId
          })

          console.log('hopV2Sdk: isClaimIdValid', isClaimIdValid)
        }

        // new path without checkpoints will return 0 bytes32
        if (!isClaimIdValid && BigNumber.from(attestedClaimId).eq(0)) {
          isClaimIdValid = true
        }

        if (!isClaimIdValid) {
          // throw new CustomError('Latest attestedClaimId is invalid')
        }

        const nextMaxTotalSent = await this.getRailsGateway(originChainId).helpers.getTotalSent({ pathId: originPathId })
        const nextMaxBonderFee = await this.getMaxBonderFee({ amountIn: amount })

        const destMaxTotalSent = await this.getRailsGateway(nextChainId).helpers.getTotalSent({ pathId: destPathId })
        const destAttestedClaimId = await this.getRailsGateway(nextChainId).helpers.getHeadClaimId({
          pathId: destPathId
        })
        const destMaxBonderFee = await this.getMaxBonderFee({ amountIn: amount })

        const hops: HopStructInput[] = [
          {
            pathId: originPathId,
            maxBonderFee: nextMaxBonderFee,
            maxTotalSent: nextMaxTotalSent,
            attestedClaimId: attestedClaimId
          },
          {
            pathId: destPathId,
            maxBonderFee: destMaxBonderFee,
            maxTotalSent: destMaxTotalSent,
            attestedClaimId: destAttestedClaimId
          }
        ]

        const fee = await this.getRailsGateway(nextChainId).getSendFee({ pathId: originPathId })

        const populatedTx = await this.getRailsGateway(originChainId).populateTransaction.send({
          to,
          amount,
          hops,
          fee
        }, txOverrides)

        console.log('hopV2Sdk: populatedTx', populatedTx)

        return populatedTx
      },

      sendTokens: async ({ fromChainId, toChainId, fromToken, toToken, amount, minAmountOut, to, attestedClaimId }: SendTokensInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(fromChainId)) {
          throw new InputError(`Invalid fromChainId "${fromChainId}"`)
        }

        if (!this.utils.isValidChainId(toChainId)) {
          throw new InputError(`Invalid toChainId "${toChainId}"`)
        }

        if (fromChainId?.toString() === toChainId?.toString()) {
          throw new InputError('fromChainId and toChainId must be different')
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

        const initialReserve = await this.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress({ tokenAddress: fromToken })

        const pathId = await this.getRailsGateway(fromChainId).getPathId({
          chainId0: fromChainId,
          token0: fromToken,
          chainId1: toChainId,
          token1: toToken,
          initialReserve
        })

        let isClaimIdValid = false

        if (attestedClaimId) {
          if (!this.utils.isValidBytes32(attestedClaimId)) {
            throw new InputError(`Invalid attestedClaimid "${attestedClaimId}"`)
          }
        }

        if (attestedClaimId == null) {
          console.log('hopV2Sdk: pathId', pathId)
          attestedClaimId = await this.getRailsGateway(fromChainId).helpers.getHeadClaimId({
            pathId
          })
          console.log('hopV2Sdk: attestedClaimId', attestedClaimId)

          isClaimIdValid = await this.getRailsGateway(toChainId).helpers.isValidClaim({
            pathId,
            claimId: attestedClaimId
          })

          console.log('hopV2Sdk: isClaimIdValid', isClaimIdValid)
        } else {
          isClaimIdValid = await this.getRailsGateway(toChainId).helpers.isValidClaim({
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
          // throw new CustomError('Latest attestedClaimId is invalid')
        }

        const maxBonderFee = await this.getMaxBonderFee({ amountIn: amount })
        const maxTotalSent = await this.getRailsGateway(fromChainId).helpers.getTotalSent({ pathId })

        const hops: HopStructInput[] = [{
          pathId,
          maxBonderFee,
          maxTotalSent,
          attestedClaimId        }]

        console.log('hopV2Sdk hops', hops)

        const fee = await this.getRailsGateway(toChainId).getSendFee({ pathId })

        const populatedTx = await this.getRailsGateway(fromChainId).populateTransaction.send({
          to,
          amount,
          hops,
          fee
        }, txOverrides)

        console.log('hopV2Sdk: populatedTx', populatedTx)

        return populatedTx
      },

      approveSendTokens: async ({ fromChainId, toChainId, fromToken, toToken, amount }: ApproveSendTokensInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const initialReserve = await this.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress({ tokenAddress: fromToken })

        const pathId = await this.getRailsGateway(fromChainId).getPathId({
          chainId0: fromChainId,
          token0: fromToken,
          chainId1: toChainId,
          token1: toToken,
          initialReserve
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

  async sendTokensMultiHop (input: SendTokensInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.sendTokensMultiHop(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async approveSendTokens (input: ApproveSendTokensInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.approveSendTokens(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async getNeedsApprovalForSendTokens (input: GetNeedsApprovalForSendTokensInput): Promise<boolean> {
    const { fromChainId, fromToken, toChainId, toToken, amount, account } = input

    const initialReserve = await this.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress({ tokenAddress: fromToken })
    const pathId = await this.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken,
      initialReserve
    })
    console.log('hopV2Sdk: getPathId', pathId)
    return this.getRailsGateway(fromChainId).helpers.getNeedsApprovalForSend({ pathId, amount, account })
  }

  async getPathInfo ({ chainId, pathId }: GetPathInfoInput): Promise<Path> {
    return this.getRailsGateway(chainId).helpers.getPathInfo({ pathId })
  }

  async connectTargets (input: ConnectTargetsInput, txOverrides: TxOverrides = {}): Promise<{tx: providers.TransactionResponse, connectorAddress: string}> {
    const tx = await this.hubConnector.connectTargets(input, txOverrides)
    const connectorAddress = await this.hubConnector.getConnectorAddressFromTx(tx)
    return { tx, connectorAddress }
  }

  async switchChain (chainId: BigNumberish, currentSignerChainId: BigNumberish = chainId): Promise<void> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId: ${chainId}`)
    }

    const signer = await this.getSigner(currentSignerChainId)

    if (!signer) {
      throw new ConfigError('No signer connected to switch chains')
    }

    if (!signer.provider) {
      throw new ConfigError('No provider connected to signer')
    }

    await this.utils.switchChain(chainId, signer.provider)
  }

  async getSendFee ({ fromChainId, fromToken, toChainId, toToken }: GetSendFeeInput): Promise<BigNumber> {
    const initialReserve = await this.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress({ tokenAddress: fromToken })
    const gateway = this.getRailsGateway(fromChainId)
    const pathId = await gateway.getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken,
      initialReserve
    })

    console.log('getSendFee',
      {
        chainId0: fromChainId,
        token0: fromToken,
        chainId1: toChainId,
        token1: toToken,
        initialReserve
      }
    )

    return gateway.getSendFee({
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
    const initialReserve = await this.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress({ tokenAddress: fromToken })
    const pathId = await this.getRailsGateway(fromChainId).getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken,
      initialReserve
    })

    const attestedClaimId  = await this.getRailsGateway(fromChainId).helpers.getHeadClaimId({
      pathId
    })

    const maxBonderFee = await this.getMaxBonderFee({ amountIn: amount })
    const maxTotalSent = await this.getRailsGateway(fromChainId).helpers.getTotalSent({ pathId })

    const hops: HopStructInput[] = [{
      pathId,
      attestedClaimId,
      maxBonderFee,
      maxTotalSent
    }]

    const fee = await this.getRailsGateway(toChainId).getSendFee({ pathId })

    const populatedTx = await this.getRailsGateway(fromChainId).populateTransaction.send({
      to,
      amount,
      hops,
      fee
    })

    const provider = this.getProvider(fromChainId)
    if (!provider) {
      throw new CustomError(`Provider not found for chainId: ${fromChainId}`)
    }

    return this.utils.willTransactionFail(provider, { ...populatedTx, from })
  }

  async getAmountOut ({ fromChainId, toChainId, fromToken, toToken, amount }: GetAmountOutInput): Promise<BigNumber> {
    const initialReserve = await this.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress({ tokenAddress: fromToken })
    const rails = this.getRailsGateway(toChainId)
    const pathId = await rails.getPathId({
      chainId0: fromChainId,
      token0: fromToken,
      chainId1: toChainId,
      token1: toToken,
      initialReserve
    })

    const attestedClaimId = await rails.helpers.getHeadClaimId({
      pathId
    })

    const sourcePool = await rails.helpers.getSourcePool({ pathId, attestedClaimId })

    const amountOut = await rails.getAmountOut({ pathId, amount, attestedClaimId, sourcePool })
    return amountOut
  }

  async getEstimatedReceived({ fromChainId, toChainId, fromToken, toToken, amount, minAmountOut }: GetEstimatedReceivedInput): Promise<BigNumber> {
    const amountOut = await this.getAmountOut({ fromChainId, toChainId, fromToken, toToken, amount })
    const maxBonderFee = await this.getMaxBonderFee({ amountIn: amountOut })
    const estimatedReceived = amountOut.sub(maxBonderFee)
    return estimatedReceived
  }

  async getSendData ({ fromChainId, toChainId, fromToken, toToken, amount, minAmountOut }: GetSendDataInput ): Promise<SendData> {
    const amountIn = BigNumber.from(amount)
    const [
      amountOut,
      estimatedReceived,
      sendFee,
      maxBonderFee
    ] = await Promise.all([
      this.getAmountOut({ fromChainId, toChainId, fromToken, toToken, amount }),
      this.getEstimatedReceived({ fromChainId, toChainId, fromToken, toToken, amount, minAmountOut }),
      this.getSendFee({ fromChainId, fromToken, toChainId, toToken }),
      this.getMaxBonderFee({ amountIn })
    ])
    const routeChainIds = [fromChainId, toChainId].map((id) => id.toString())

    console.log('hopV2Sdk: getSendData', {
      amountIn,
      amountOut,
      estimatedReceived,
      sendFee,
      maxBonderFee,
      routeChainIds,
    })

    return {
      amountIn,
      amountOut,
      estimatedReceived,
      sendFee,
      maxBonderFee,
      routeChainIds,
    }
  }

  async getSendDataMultiHop ({ fromChainId, toChainId, fromToken, toToken, amount, minAmountOut }: GetSendDataInput ): Promise<SendData> {
    const hubChainId = this.getHubChainId()
    const tokenSymbol = this.getTokenSymbolByTokenAddress(fromChainId, fromToken)
    const hubToken = this.getTokenAddressByTokenSymbol(hubChainId, tokenSymbol)
    const amountIn = BigNumber.from(amount)
    const [
      amountOut,
      estimatedReceived,
      sendFee,
      maxBonderFee
    ] = await Promise.all([
      this.getAmountOut({ fromChainId, toChainId: hubChainId, fromToken, toToken: hubToken, amount }),
      this.getEstimatedReceived({ fromChainId, toChainId: hubChainId, fromToken, toToken: hubToken, amount, minAmountOut }),
      this.getSendFee({ fromChainId, fromToken, toChainId: hubChainId, toToken: hubToken }),
      this.getMaxBonderFee({ amountIn })
    ])

    const routeChainIds = [fromChainId, hubChainId, toChainId].map((id) => id.toString())

    return {
      amountIn,
      amountOut,
      estimatedReceived,
      sendFee,
      maxBonderFee,
      routeChainIds,
    }
  }

  getTokenContract ({ chainId, address }: GetTokenContractInput): Contract {
    return this.getRailsGateway(chainId).helpers.getTokenContract({ address })
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

    const messenger = this.getMessenger(chainId)
    const railsGateway = this.getRailsGateway(chainId)
    const stakingRegistry = railsGateway.getStakingRegistry()
    const railsPath = await this.getRailsPath(chainId)

    const allEventNames = [
      ...messenger.getEventNames(),
      ...railsGateway.getEventNames(),
      ...stakingRegistry.getEventNames(),
      ...railsPath.getEventNames(),
    ]

    // Get all RailsPath addresses for this chain
    let railsPathAddresses: string[] = []
    try {
      railsPathAddresses = await this.getAllRailsPathAddresses(chainId)
    } catch (err) {
      console.warn('Failed to get RailsPath addresses:', err)
    }

    for (const name of eventNames) {
      if (messenger.getEventNames().includes(name)) {
        const fetcher = messenger.getEventFetcher(name)
        const filter = fetcher.getFilter()
        filters.push(filter)
        eventFetcherMap[filter.topics?.[0] as string] = fetcher
      } else if (name == EventName.PathInitialized) {
        const fetcher = railsGateway.getEventFetcher(name)
        const filter = fetcher.getFilter()
        filters.push(filter)
        eventFetcherMap[filter.topics?.[0] as string] = fetcher
      } else if (railsPath.getEventNames().includes(name)) {
        // For RailsGateway events, create fetchers for each RailsPath address
        for (const address of railsPathAddresses) {
          try {
            const railsPathWithAddress = await this.getRailsPath(chainId, undefined, address)
            const fetcher = railsPathWithAddress.getEventFetcher(name)
            const filter = fetcher.getFilter()
            filters.push(filter)
            eventFetcherMap[filter.topics?.[0] as string] = fetcher
          } catch (err) {
            console.warn(`Failed to create fetcher for event ${name} at address ${address} for chainId ${chainId}:`, err)
          }
        }
      } else if (stakingRegistry.getEventNames().includes(name)) {
        const fetcher = stakingRegistry.getEventFetcher(name)
        const filter = fetcher.getFilter()
        filters.push(filter)
        eventFetcherMap[filter.topics?.[0] as string] = fetcher
      }
    }

    // console.log('hopV2Sdk: getEvents filters', filters)
    const options = { fromBlock: fromBlock as number, toBlock: toBlock as number }
    const events = await eventFetcher.fetchEvents(filters as InputFilter[], options)

    const decoded: EthersEvent[] = []
    for (const event of events) {
      const res = await eventFetcherMap[event.topics[0] as string].populateEvents([event], fetchTxData) as EthersEvent[]
      decoded.push(...res)
    }

    // Sort events by block number and log index
    decoded.sort((a, b) => {
      if (a.blockNumber === b.blockNumber) {
        return a.logIndex - b.logIndex
      }
      return a.blockNumber - b.blockNumber
    })

    return decoded as EthersEventWithDecodedTypesAndContext<AllEventTypes>[]
  }

  override setProviderUrls (signersOrProviders: Record<string, string | string[]>): void {
    super.setProviderUrls(signersOrProviders)
    this.hubConnector.setProviderUrls(signersOrProviders)

    for (const chainId in signersOrProviders) {
      this.getRailsGateway(chainId).setProviderUrls(signersOrProviders)
      this.getMessenger(chainId).setProviderUrls(signersOrProviders)
    }
  }

  async getTransferIdFromTransactionHash ({ chainId, transactionHash}: GetTransferIdFromTransactionHashInput): Promise<string> {
    const railsPath = await this.getRailsPath(chainId)
    const transferSentEvent = await railsPath.getEventFromTransactionHash<TransferSent>({
      eventName: RailsPathEventName.TransferSent,
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

  async getTransferStatus({ fromChainId, toChainId, transferId, transactionHash }: GetTransferStatusInput): Promise<TransferStatus> {
    if (transactionHash && fromChainId) {
      try {
        transferId = await this.getTransferIdFromTransactionHash({ chainId: fromChainId, transactionHash })

        if (!transferId) {
          throw new InputError('could not find transferId from transaction hash')
        }
      } catch(err: any) {
        console.warn('hopV2Sdk: getTransferStatus error', err)
      }
    }

    return this.getTransferStatusFromApi({ transferId, transactionHash, chainId: fromChainId })
    // return this.getTransferStatusFromEvents({ fromChainId, toChainId, transferId })
  }

  async getTransferStatusFromApi ({ transferId, transactionHash, chainId }: GetTransferStatusFromApiInput): Promise<TransferStatus> {
    if (transferId && !this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }

    if (transactionHash && !this.utils.isValidBytes32(transactionHash)) {
      throw new InputError(`Invalid transactionHash "${transactionHash}"`)
    }

    if (!transferId && !transactionHash) {
      throw new InputError('expected transferId or transactionHash')
    }

    const params = new URLSearchParams({
      eventName: 'explorer'
    })

    // Add filter parameters
    if (transferId) {
      params.append('filter[transferId]', transferId)
    }

    if (transactionHash) {
      params.append('filter[transactionHash]', transactionHash)
    }

    if (chainId) {
      params.append('filter[chainId]', chainId?.toString())
    }

    const url = `${this.getExplorerApiBaseUrl()}/v1/explorer?${params.toString()}`
    const json = await fetchJsonOrThrow(url.toString())

    const event = json?.events?.[0]
    if (!event) {
      return {
        state: TransferState.NotFound,
        transferId: transferId ?? '',
        transferSentEvent: null as any,
        transferBondedEvents: [],
        claimWithdrawnEvents: []
      }
    }

    const transferSentEvent = {
      ...event,
      ...event.context
    }
    const transferBondedEvents = transferSentEvent.transferBondedEvents.map((event: any) => {
      return {
        ...event,
        ...event.context
      }
    })

    const claimWithdrawnEvents = event.claimWithdrawnEvents ?? []

    delete transferSentEvent.transferBondedEvents

    let transferState = event?.state ?? TransferState.NotFound

    if (event && event.hops?.length > 0 && transferBondedEvents.length !== event.hops?.length) {
      transferState = TransferState.PendingBond
    }

    if (event && transferBondedEvents.length > 0 && transferBondedEvents.length === event.hops?.length) {
      transferState = TransferState.Bonded
    }

    if (event && claimWithdrawnEvents.length > 0) {
      transferState = TransferState.Bonded
    }

    return {
      state: transferState,
      transferId: event?.transferId ?? '',
      transferSentEvent,
      transferBondedEvents,
      claimWithdrawnEvents
    }
  }

  async getTransferStatusFromEvents ({ fromChainId, toChainId, transferId }: GetTransferStatusFromEventsInput): Promise<TransferStatus> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }

    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }

    const railsGateway= await this.getRailsGateway(fromChainId)
    const originalTransferSentEvent = await railsGateway.helpers.getTransferSentEventFromTransferId({
      transferId
    })

    let transferSentEvent: any = originalTransferSentEvent

    const transferBondedEvents: EthersEventWithDecodedTypes<TransferBonded>[] = []
    let originalHops : HopStructInput[] = []

    if (transferSentEvent) {
      const fromProvider = this.getProvider(fromChainId)
      if (!fromProvider) {
        throw new ConfigError('fromChainId provider not found')
      }

      const { hops } = transferSentEvent.decoded
      originalHops = hops
      let currentHopChainId : BigNumberish = fromChainId
      let fromBlock = await fromProvider.getBlock(transferSentEvent.blockNumber)
      let currentTransferId = transferId
      for (const hop of hops) {
        const { pathId } = hop
        const toChainId = await this.getCounterpartChainId(currentHopChainId, pathId)

        const toProvider = this.getProvider(toChainId)
        if (!toProvider) {
          throw new ConfigError('toChainId provider not found')
        }

        const fromTimestamp = fromBlock.timestamp
        const block = await toProvider.getBlock('latest')
        let earliestBlock = block.number - 10000
        try {
          earliestBlock = await getBlockNumberFromDate(toProvider, fromTimestamp)
        } catch (err: any) {
          console.log('hopV2Sdk: getBlockNumberFromDate error', err)
        }

        const railsGateway = await this.getRailsGateway(toChainId)
        const transferBondedEvent = await railsGateway.helpers.getTransferBondedEventFromTransferId({
          transferId: currentTransferId,
          fromBlock: earliestBlock
        })
        if (!transferBondedEvent) {
          break
        }
        transferBondedEvents.push(transferBondedEvent)
        currentHopChainId = toChainId
        fromBlock = await toProvider.getBlock(transferBondedEvent.blockNumber)
        const railsPath = await this.getRailsPath(toChainId)
        transferSentEvent = railsPath.getEventFromTransactionHash({
          eventName: RailsPathEventName.TransferSent,
          transactionHash: transferBondedEvent.transactionHash
        })!
        if (!transferSentEvent) {
          continue
        }
        currentTransferId = transferSentEvent.decoded.transferId
      }
    }

    let transferState = TransferState.NotFound

    if (originalTransferSentEvent && transferBondedEvents.length !== originalHops.length) {
      transferState = TransferState.PendingBond
    }

    if (originalTransferSentEvent && transferBondedEvents.length === originalHops.length) {
      transferState = TransferState.Bonded
    }

    const bondedEvents = transferBondedEvents.map((event: any) => {
      const transactionHashExplorerUrl = this.utils.getTransactionHashExplorerUrl(event.transactionHash, event.context.chainId)
      return {
        ...event,
        transactionHashExplorerUrl
      }
    })

    const transferEvent : any = originalTransferSentEvent
    transferEvent.transactionHashExplorerUrl = this.utils.getTransactionHashExplorerUrl(transferEvent.transactionHash, transferEvent.context.chainId)

    return {
      state: transferState,
      transferId: originalTransferSentEvent?.decoded.transferId ?? '',
      transferSentEvent: originalTransferSentEvent,
      transferBondedEvents: bondedEvents,
      claimWithdrawnEvents: [] // TODO
    }
  }

  getRailsGateway (chainId: BigNumberish): RailsGateway {
    chainId = chainId?.toString()
    const key = `RailsGateway:${chainId}`
    let instance = cache.get(key) as RailsGateway
    if (!instance) {
      instance = new RailsGateway({
        network: this.network,
        chainId,
        signerOrProvider: this.signersOrProviders[chainId]
      })

      cache.put(key, instance)
    }

    return instance
  }

  async getRailsPath (chainId: BigNumberish, pathId?: string, address?: string): Promise<RailsPath> {
    const railsGateway = this.getRailsGateway(chainId)
    return railsGateway.getRailsPath(pathId, address)
  }

  async getCounterpartChainId (originChainId: BigNumberish, pathId: string): Promise<string> {
    const pathInfo = await this.getRailsGateway(originChainId).helpers.getPathInfo({ pathId })
    const { counterpartChainId, chainId } = pathInfo

    let toChainId = counterpartChainId
    if (toChainId === originChainId) {
      toChainId = chainId
    }

    return toChainId
  }

  async getMaxBonderFee ({ amountIn }: GetMaxBonderFeeInput): Promise<BigNumber> {
    return BigNumber.from(amountIn).mul(BigNumber.from(4)).div(BigNumber.from(10000))
  }

  async estimateGasCostForSend({ from, fromChainId, toChainId, fromToken, toToken, amount, minAmountOut, to, gasPrice }: EstimateGasCostForSendInput): Promise<BigNumber> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }

    if (fromChainId?.toString() === toChainId?.toString()) {
      throw new InputError('fromChainId and toChainId must be different')
    }

    if (!this.utils.isValidAddress(fromToken)) {
      throw new InputError(`Invalid fromToken "${fromToken}"`)
    }

    if (!this.utils.isValidAddress(toToken)) {
      throw new InputError(`Invalid toToken "${toToken}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
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

    try {
      const initialReserve = await this.getRailsGateway(fromChainId).helpers.getInitialReserveByTokenAddress({ tokenAddress: fromToken })

      const pathId = await this.getRailsGateway(fromChainId).getPathId({
        chainId0: fromChainId,
        token0: fromToken,
        chainId1: toChainId,
        token1: toToken,
        initialReserve
      })

      const attestedClaimId = await this.getRailsGateway(fromChainId).helpers.getHeadClaimId({
        pathId
      })

      const maxBonderFee = await this.getMaxBonderFee({ amountIn: amount })
      const maxTotalSent = await this.getRailsGateway(fromChainId).helpers.getTotalSent({ pathId })

      const hops: HopStructInput[] = [{
        pathId,
        maxBonderFee,
        maxTotalSent,
        attestedClaimId
      }]

      const fee = await this.getRailsGateway(toChainId).getSendFee({ pathId })

      // Use the RailsGateway's estimateGasCostForSend method
      return await this.getRailsGateway(fromChainId).helpers.estimateGasCostForSend({
        from,
        to,
        amount,
        hops,
        fee,
        gasPrice
      })
    } catch (err: unknown) {
      console.warn('hopV2Sdk: estimateGasCostForSend error', err)
      return this.throwError(err) as BigNumber
    }
  }

  async getAllRailsPathAddresses(chainId: BigNumberish): Promise<string[]> {
    chainId = chainId.toString()
    const addresses = new Set<string>()

    // Get token configs for the current chain
    const chainConfig = this.contractAddresses[chainId]
    if (!chainConfig?.tokens) {
      throw new ConfigError(`No tokens configured for chain ID ${chainId}`)
    }

    // Get RailsPath addresses for all path IDs
    for (const [tokenSymbol, tokenConfig] of Object.entries(chainConfig.tokens)) {
      if (!tokenConfig.railsPaths) continue

      for (const [targetChainId, pathConfig] of Object.entries(tokenConfig.railsPaths)) {
        if (!(pathConfig as any).pathId) continue
        const pathId = (pathConfig as any).pathId

        try {
          const railsPath = await this.getRailsPath(chainId, pathId)
          const address = await railsPath.getRailsPathContractAddress()
          console.log('hopV2Sdk:', 'chainId', chainId, 'pathId', pathId, 'address', address)
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
}
