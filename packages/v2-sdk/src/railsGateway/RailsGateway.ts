import { BaseConfig } from '#common/index.js'
import { BigNumber, BigNumberish, Contract, Signer, providers, utils, constants, EventFilter } from 'ethers'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'
import { StakingRegistry } from './StakingRegistry.js'
import { TransferSent, HopStruct, TransferSentEventFetcher } from '#railsGateway/events/TransferSent.js'
import { TransferBonded, TransferBondedEventFetcher } from '#railsGateway/events/TransferBonded.js'
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
  chainId: BigNumberish
  fromBlock: number
  toBlock: number
  eventName: EventName
  fetchTxData?: boolean
}

export type TransferSentEventInput = {
  chainId: BigNumberish
  fromBlock: number
  toBlock: number
  fetchTxData?: boolean
}

export type TransferBondedEventInput = {
  chainId: BigNumberish
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
  chainId: BigNumberish
  pathId: string
}

export type SendInput = {
  chainId: BigNumberish
  pathId: string
  to: string
  amount: BigNumberish
  attestedClaimId: string
  nextHops: HopStructInput[]
  maxTotalSent: BigNumberish
  fee: BigNumberish
}

export type ApproveSendInput = {
  chainId: BigNumberish
  pathId: string
  amount: BigNumberish
}

export type BondInput = {
  chainId: BigNumberish
  pathId: string
  transferId: string
  nextHops: HopStructInput[]
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
  to: string
  amount: BigNumberish
  totalSent: BigNumberish
  attestedClaimId: string
  attestedTotalClaims: BigNumberish
  nextHopsHash: string
}

export type RemoveClaimInput = {
  chainId: BigNumberish
  pathId: string
  transferId: string
}

export type ConfirmClaimInput = {
  chainId: BigNumberish
  pathId: string
  transferId: string
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
  account?: string
}

export type GetNeedsApprovalForSendInput = {
  chainId: BigNumberish
  pathId: string
  amount: BigNumberish
  account?: string
}

export type GetNeedsApprovalForBondInput = {
  chainId: BigNumberish
  pathId: string
  amount: BigNumberish
  account?: string
}

export type GetLatestClaimInput = {
  chainId: BigNumberish
  pathId: string
}

export type GetIsClaimIdValidInput = {
  chainId: BigNumberish
  pathId: string
  claimId: string
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
  transferSentEvent: TransferSent
  transferBondedEvent: TransferBonded
}

export type GetTransferSentEventFilterInput = {
  chainId: BigNumberish
  indexes?: {
    transferId?: string
    pathId?: string
  }
}

export type GetTransferBondedEventFilterInput = {
  chainId: BigNumberish
  indexes?: {
    transferId?: string
    pathId?: string
  }
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

export type GetIsCheckpointValidInput = {
  chainId: BigNumberish
  pathId: string
  checkpoint: string
}

export type GetTotalSentInput = {
  chainId: BigNumberish
  pathId: string
}

export type GetIsTransferBondedInput = {
  chainId: BigNumberish
  transferId: string
}

export type GetIsTransferClaimedInput = {
  chainId: BigNumberish
  transferId: string
}

export type GetNextHopsHashInput = {
  nextHops: HopStruct[]
}

export type GetIsPathIdLiveInput = {
  chainId: BigNumberish
  pathId: string
}

export type RailsGatewayConstructorInput = BaseConfig

export class RailsGateway extends StakingRegistry {
  constructor ({ network, signer, contractAddresses }: RailsGatewayConstructorInput) {
    super({
      network,
      signer,
      contractAddresses
    })
  }

  override connect (signer: Signer) {
    return new RailsGateway({ network: this.network, signer, contractAddresses: this.contractAddresses })
  }

  getEventNames (): string[] {
    return Object.keys(EventName)
  }

  getEventFetcher(eventName: EventName, chainId: BigNumberish) {
    const provider = this.getRpcProviderForChainId(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const address = this.getRailsGatewayContractAddress(chainId)
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

  getTransferSentEventFilter({ chainId, indexes = {} }: GetTransferSentEventFilterInput): EventFilter {
    const { transferId, pathId } = indexes
    const eventFetcher = this.getEventFetcher(EventName.TransferSent, chainId)

    if (transferId) {
      return eventFetcher.getTransferIdFilter(transferId)
    }

    if (pathId) {
      return eventFetcher.getPathIdFilter(pathId)
    }

    return eventFetcher.getFilter()
  }

  getTransferBondedEventFilter({ chainId, indexes = {} }: GetTransferBondedEventFilterInput): EventFilter {
    const { transferId, pathId } = indexes
    const eventFetcher = this.getEventFetcher(EventName.TransferBonded, chainId)

    if (transferId) {
      return eventFetcher.getTransferIdFilter(transferId)
    }

    if (pathId) {
      return eventFetcher.getPathIdFilter(pathId)
    }

    return eventFetcher.getFilter()
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

  async #getEvents ({ chainId, fromBlock, toBlock, eventName, fetchTxData = false }: GetEventsInput) {
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

    const eventFetcher = this.getEventFetcher(eventName, chainId)
    return eventFetcher.getEventsForRange(fromBlock, toBlock, fetchTxData)
  }

  async getTransferSentEvents (input: TransferSentEventInput): Promise<EthersEventWithDecodedTypes<TransferSent>[]> {
    return this.#getEvents({ ...input, eventName: EventName.TransferSent })
  }

  async *getTransferSentEventsInBatches({ chainId, fromBlock, toBlock }: TransferSentEventInput) {
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

    const eventFetcher = this.getEventFetcher(EventName.TransferSent, chainId)
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

    const contract = await this.getRailsGatewayContract(chainId0)
    return contract.getPathId(chainId0, token0, chainId1, token1)
  }

  async getPathInfo ({ chainId, pathId }: GetPathInfoInput): Promise<Path> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
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

  async getFee ({ chainId, pathId }: GetFeeInput): Promise<BigNumber> {
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
      send: async ({ chainId, pathId, to, amount, attestedClaimId, nextHops = [], maxTotalSent, fee }: SendInput): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid to "${to}"`)
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
            throw new InputError(`Invalid attestedCheckpoint "${hop.maxTotalSent}"`)
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

        const contract = await this.getRailsGatewayContract(chainId)

        if (fee != null && !this.utils.isValidNumericValue(fee)) {
          throw new InputError(`Invalid amount "${fee}"`)
        }

        if (!fee) {
          fee = await this.getFee({ chainId, pathId })
        }

        const txData = await contract.populateTransaction.send(pathId, to, amount, attestedClaimId, nextHops, maxTotalSent, {
          value: fee
        })

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      approveSend: async ({ chainId, pathId, amount }: ApproveSendInput): Promise<providers.TransactionRequest> => {
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

      bond: async ({ chainId, pathId, transferId, nextHops = []}: BondInput): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(transferId)) {
          throw new InputError(`Invalid checkpoint "${transferId}"`)
        }

        if (!nextHops || !Array.isArray(nextHops)) {
          throw new InputError('Invalid nextHops')
        }

        for (const hop of nextHops) {
          if (!this.utils.isValidBytes32(hop.pathId)) {
            throw new InputError(`Invalid pathId "${hop.pathId}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxTotalSent)) {
            throw new InputError(`Invalid attestedCheckpoint "${hop.maxTotalSent}"`)
          }

          if (hop.attestedClaimId) {
            if (!this.utils.isValidBytes32(hop.attestedClaimId)) {
              throw new InputError(`Invalid minAmountOut "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.bond(pathId, transferId, nextHops)

        return {
          ...txData,
          chainId: Number(chainId),
        }
      },

      approveBond: async ({ chainId, pathId, amount }: ApproveBondInput): Promise<providers.TransactionRequest> => {
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

      postClaim: async ({ chainId, pathId, transferId, to, amount, totalSent, attestedClaimId, attestedTotalClaims, nextHopsHash }: PostClaimInput): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(chainId)) {
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

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.postClaim(pathId, transferId, to, amount, totalSent, attestedClaimId, attestedTotalClaims, nextHopsHash)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      removeClaim: async ({ chainId, pathId, transferId }: RemoveClaimInput): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(transferId)) {
          throw new InputError(`Invalid transferID "${transferId}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.removeClaim(pathId, transferId)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      withdrawClaim: async ({ chainId, pathId, amount, timeWindow }: WithdrawInput): Promise<providers.TransactionRequest> => {
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
        const txData = await contract.populateTransaction['withdraw(bytes32,uint256,uint256)'](pathId, amount, Number(timeWindow))

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      withdrawAllClaims: async ({ chainId, pathId, timeWindow }: WithdrawAllInput): Promise<providers.TransactionRequest> => {
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
        const txData = await contract.populateTransaction.withdrawAll(pathId, timeWindow)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      confirmClaim: async ({ chainId, pathId, transferId }: ConfirmClaimInput): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(pathId)) {
          throw new InputError(`Invalid pathId "${pathId}"`)
        }

        if (!this.utils.isValidBytes32(transferId)) {
          throw new InputError(`Invalid transferId "${transferId}"`)
        }

        const contract = await this.getRailsGatewayContract(chainId)
        const txData = await contract.populateTransaction.confirmClaim(pathId, transferId)

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      approveStakeHop: async ({ chainId, role, staker, amount }: StakeHopInput): Promise<providers.TransactionRequest> => {
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

      stakeHop: async ({ chainId, role, staker, amount }: StakeHopInput): Promise<providers.TransactionRequest> => {
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

        if (balance.lt(minRequired)) {
          throw new InsufficientBalanceError(`Insufficient balance to stake ${minRequired.toString()} HOP`)
        }

        const txData = await this.registryStakeHopPopulatedTx({ chainId, role, staker, amount })

        return {
          ...txData,
          chainId: Number(chainId)
        }
      },

      unstakeHop: async ({ chainId, role, amount }: UnstakeHopInput): Promise<providers.TransactionRequest> => {
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

      withdrawHop: async ({ chainId, role }: WithdrawHopInput): Promise<providers.TransactionRequest> => {
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
    return this.sendTransaction(populatedTx)
  }

  async approveSend (input: ApproveSendInput): Promise<providers.TransactionResponse> {
    const txData = await this.populateTransaction.approveSend(input)
    return this.sendTransaction(txData)
  }

  async bond (input: BondInput): Promise<providers.TransactionResponse> {
    const { chainId, pathId, transferId } = input

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const event = await this.getTransferSentEventFromTransferId({ fromChainId: chainId, transferId })
    if (!event) {
      throw new InputError(`Transfer not found for transferId "${transferId}"`)
    }

    const amount = event.amount

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

  async confirmClaim (input: ConfirmClaimInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.confirmClaim(input)
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

  async getNeedsApprovalForSend ({ chainId, pathId, amount, account }: GetNeedsApprovalForSendInput): Promise<boolean> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo({ chainId, pathId })
    const tokenAddress = path.token
    const provider = this.getRpcProviderForChainId(chainId)
    console.log('hopV2Sdk: rails approval token', tokenAddress)
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const spender = this.getRailsGatewayContractAddress(chainId)
    account ??= (await this.getSignerAddress())!
    if (!account) {
      throw new InputError('signer not set')
    }
    console.log('hopV2Sdk: rails approval account', account)
    console.log('hopV2Sdk: rails approval spender', spender)
    const approved = await tokenContract.allowance(account, spender)
    return approved.lt(amount)
  }

  async getNeedsApprovalForBond ({ chainId, pathId, amount, account }: GetNeedsApprovalForBondInput): Promise<boolean> {
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
    account ??= (await this.getSignerAddress())!
    if (!account) {
      throw new InputError('signer not set')
    }
    const approved = await tokenContract.allowance(account, spender)
    return approved.lt(amount)
  }

  async getLatestClaim ({ chainId, pathId }: GetLatestClaimInput): Promise<string> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getHeadClaim(pathId)
  }

  async getIsCheckpointValid ({ chainId, pathId, checkpoint }: GetIsCheckpointValidInput): Promise<boolean> {
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

  async getWithdrawableBalance ({ chainId, pathId, recipient, timeWindow }: WithdrawBalanceInput): Promise<BigNumber> {
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

    const contract = await this.getRailsGatewayContract(chainId)
    return contract['getWithdrawableBalance(bytes32,address,uint256)'](pathId, recipient, timeWindow)
  }

  async getTransferId ({ chainId, pathId, to, adjustedAmount, minAmountOut, totalSent, nonce, attestedCheckpoint }: GetTransferIdInput): Promise<string> {
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

    if (attestedCheckpoint) {
      if (!this.utils.isValidBytes32(attestedCheckpoint)) {
        throw new InputError(`Invalid attestedCheckpoint  "${attestedCheckpoint}"`)
      }
    } else {
      attestedCheckpoint = '0x' + '0'.repeat(64)
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

  calcAmountOutMin ({ amountOut, slippageTolerance }: CalcAmountOutMinInput): BigNumber {
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

  async getTransferSentEventFromTransactionReceipt ({ fromChainId, receipt }: GetTransferSentEventFromTransactionReceiptInput): Promise<TransferSent | null> {
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
    const eventFetcher = this.getEventFetcher(EventName.TransferSent, fromChainId)
    const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt)
    return events?.[0] ?? null
  }

  async getTransferSentEventFromTransactionHash ({ fromChainId, transactionHash }: GetTransferSentEventFromTransactionHashInput): Promise<TransferSent | null> {
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

  async getTransferSentEventFromTransferId ({ fromChainId, transferId }: GetTransferSentEventFromTransferIdInput): Promise<TransferSent> {
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

    const eventFetcher = this.getEventFetcher(EventName.TransferSent, fromChainId)
    const filter = eventFetcher.getTransferIdFilter(transferId)
    const fromBlock = 0
    const toBlock = await provider.getBlockNumber()
    const events = await eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getTransferBondedEventFromTransactionReceipt ({ fromChainId, receipt }: GetTransferBondedEventFromTransactionReceiptInput): Promise<TransferBonded | null> {
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
    const eventFetcher = this.getEventFetcher(EventName.TransferBonded, fromChainId)
    const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt)
    return events?.[0] ?? null
  }

  async getTransferBondedEventFromTransactionHash ({ fromChainId, transactionHash }: GetTransferBondedEventFromTransactionHashInput): Promise<TransferBonded | null> {
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

  async getTransferBondedEventFromTransferId ({ fromChainId, transferId }: GetTransferBondedEventFromTransferIdInput): Promise<TransferBonded> {
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

    const eventFetcher = this.getEventFetcher(EventName.TransferBonded, fromChainId)
    const filter = eventFetcher.getTransferIdFilter(transferId)
    const fromBlock = 0
    const toBlock = await provider.getBlockNumber()
    const events = await eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getTokenInfo ({ chainId, address }: GetTokenInfoInput): Promise<Token> {
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
        chainId: cached.chainId,
        address: cached.address,
        name: cached.name,
        symbol: cached.symbol,
        decimals: Number(cached.decimals)
      }
    }

    const contract = this.getTokenContract({ chainId, address })

    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals()
    ])

    const response = {
      chainId: chainId.toString(),
      address: checksumAddress(address),
      name,
      symbol,
      decimals: Number(decimals)
    }

    cache.put(key, response)

    return response
  }

  getTokenContract ({ chainId, address }: GetTokenContractInput): Contract {
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

  async getHasSufficientBalance ({ chainId, tokenAddress, amount, account }: GetHasSufficientBalanceInput): Promise<boolean> {
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
    account ??= (await this.getSignerAddress())!
    if (!account) {
      throw new InputError('signer not set')
    }
    const balance = await tokenContract.balanceOf(account)
    return balance.lt(amount)
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

    const transferSentEvent = await this.getTransferSentEventFromTransferId({
      fromChainId,
      transferId
    })

    const transferBondedEvent = await this.getTransferBondedEventFromTransferId({
      fromChainId: toChainId,
      transferId
    })

    let transferState = TransferState.NotFound

    if (transferSentEvent && !transferBondedEvent) {
      transferState = TransferState.PendingBond
    }

    if (transferSentEvent && transferBondedEvent) {
      transferState = TransferState.Bonded
    }

    return {
      state: transferState,
      transferId: transferSentEvent?.transferId ?? '',
      transferSentEvent,
      transferBondedEvent
    }
  }

  async getIsClaimIdValid ({ chainId, pathId, claimId }: GetIsClaimIdValidInput): Promise<boolean> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    const valid = await contract.isClaimValid(pathId, claimId)

    return valid
  }

  async getTotalSent ({ chainId, pathId }: GetTotalSentInput): Promise<BigNumber> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    return contract.getTotalSent(pathId)
  }

  async getIsTransferBonded ({ chainId, transferId }: GetIsTransferBondedInput): Promise<boolean> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }

    // TODO: call contract state once it's available
    return false
  }

  async getIsTransferClaimed ({ chainId, transferId }: GetIsTransferClaimedInput): Promise<boolean> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }

    // TODO: call contract state once it's available
    return false
  }

  async getIsPathIdLive ({ chainId, pathId }: GetIsPathIdLiveInput): Promise<boolean> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    const contract = await this.getRailsGatewayContract(chainId)
    const pathInfoArray = await contract.getPathInfo(pathId)

    const pathChainId = pathInfoArray[0].toString()
    const pathToken = pathInfoArray[1]
    const counterpartChainId = pathInfoArray[2].toString()
    const counterpartToken = checksumAddress(pathInfoArray[3])

    if (pathChainId !== '0' && counterpartChainId !== '0' && pathToken !== constants.AddressZero && counterpartToken !== constants.AddressZero) {
      return true
    }

    return false
  }

  getNextHopsHash ({ nextHops }: GetNextHopsHashInput): string {
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
}

