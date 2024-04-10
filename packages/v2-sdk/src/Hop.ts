import { Base } from '#common/index.js'
import { BigNumber, Signer, providers } from 'ethers'
import { BundleCommitted, BundleCommittedEventFetcher } from '#messenger/events/BundleCommitted.js'
import { BundleForwarded, BundleForwardedEventFetcher } from '#messenger/events/BundleForwarded.js'
import { BundleReceived, BundleReceivedEventFetcher } from '#messenger/events/BundleReceived.js'
import { BundleSet, BundleSetEventFetcher } from '#messenger/events/BundleSet.js'
import { ConfirmationSent, ConfirmationSentEventFetcher } from '#nft/events/ConfirmationSent.js'
import { DateTime } from 'luxon'
import { ERC721Bridge__factory } from '#contracts/factories/ERC721Bridge__factory.js'
import { EventFetcher } from '#events/index.js'
import { ExitRelayer } from '#exitRelayers/ExitRelayer.js'
import { FeesSentToHub, FeesSentToHubEventFetcher } from '#messenger/events/FeesSentToHub.js'
import { GasPriceOracle } from '#gasPriceOracle/index.js'
import { HubERC5164ConnectorFactory__factory } from '#contracts/factories/HubERC5164ConnectorFactory__factory.js'
import { HubMessageBridge__factory } from '#contracts/factories/HubMessageBridge__factory.js'
import { MerkleTree } from '#utils/MerkleTree.js'
import { MessageBundled, MessageBundledEventFetcher } from '#messenger/events/MessageBundled.js'
import { MessageExecuted, MessageExecutedEventFetcher } from '#messenger/events/MessageExecuted.js'
import { MessageSent, MessageSentEventFetcher } from '#messenger/events/MessageSent.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { TokenConfirmed, TokenConfirmedEventFetcher } from '#nft/events/TokenConfirmed.js'
import { TokenSent, TokenSentEventFetcher } from '#nft/events/TokenSent.js'
import { TransferBondedEventFetcher } from '#railsHub/events/TransferBonded.js'
import { TransferSentEventFetcher } from '#railsHub/events/TransferSent.js'
import { chainSlugMap } from '#utils/chainSlugMap.js'
import { getProvider } from '#utils/getProvider.js'
import { formatEther, formatUnits, getAddress, parseEther } from 'ethers/lib/utils.js'
import { addresses } from '#addresses/index.js'
import { Messenger } from '#messenger/index.js'
import { RailsHub } from '#railsHub/index.js'
import { Nft } from '#nft/index.js'

const cache : Record<string, any> = {}

export type Options = {
  batchBlocks?: number,
  signer?: Signer
  contractAddresses?: Record<string, any> // TODO: types
}

export type GetEventsInput = {
  chainId: number
  fromBlock: number
  toBlock?: number
}

export type GetGeneralEventsInput = {
  eventName?: string
  eventNames?: string[]
  chainId: number
  fromBlock: number
  toBlock?: number
}

export type ConnectTargetsInput = {
  hubChainId: number
  spokeChainId: number
  target1: string
  target2: string
  signer: Signer
}

export class Hop extends Base {
  eventFetcher: EventFetcher
  batchBlocks?: number

  providers: Record<string, any> = {}
  gasPriceOracle: GasPriceOracle
  messenger: Messenger
  railsHub: RailsHub
  nft: Nft

  constructor (network: string = 'goerli', options?: Options) {
    super({ network, signer: options?.signer })
    if (!['mainnet', 'goerli', 'sepolia'].includes(network)) {
      throw new Error(`Invalid network: ${network}`)
    }

    this.network = network

    if (options?.batchBlocks) {
      this.batchBlocks = options.batchBlocks
    }

    const url = 'https://v2-gas-price-oracle-goerli.hop.exchange'
    this.gasPriceOracle = new GasPriceOracle(url)

    this.messenger = new Messenger({ network, signer: this.signer, contractAddresses: this.contractAddresses })
    this.railsHub = new RailsHub({ network, signer: this.signer, contractAddresses: this.contractAddresses })
    this.nft = new Nft({ network, signer: this.signer, contractAddresses: this.contractAddresses })
  }

  get version () {
    return '' // TODO
  }

  async getEvents (input: GetGeneralEventsInput): Promise<any[]> {
    let { eventName, eventNames, chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getProviderForChainId(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
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

    if (eventName) {
      eventNames = [eventName]
    }

    if (!eventNames?.length) {
      throw new Error('expected eventName or eventNames')
    }

    const filters :any[] = []
    const eventFetcher = new EventFetcher({
      provider,
      batchBlocks: this.batchBlocks
    })
    const map : any = {}
    for (const eventName of eventNames) {
      if (eventName === 'BundleCommitted') {
        const address = await this.messenger.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new BundleCommittedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'BundleForwared') {
        const address = await this.messenger.getHubMessageBridgeContractAddress(chainId)
        const _eventFetcher = new BundleForwardedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'BundleReceived') {
        const address = await this.messenger.getHubMessageBridgeContractAddress(chainId)
        const _eventFetcher = new BundleReceivedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'BundleSet') {
        const address = await this.messenger.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new BundleSetEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'FeesSentToHub') {
        const address = await this.messenger.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new FeesSentToHubEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'MessageBundled') {
        const address = await this.messenger.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new MessageBundledEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'MessageExecuted') {
        const address = await this.messenger.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new MessageExecutedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'MessageSent') {
        const address = await this.messenger.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new MessageSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'ConfirmationSent') { // nft
        const address = await this.getNftBridgeContractAddress(chainId)
        const _eventFetcher = new ConfirmationSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'TokenConfirmed') { // nft
        const address = await this.getNftBridgeContractAddress(chainId)
        const _eventFetcher = new TokenConfirmedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'TokenSent') { // nft
        const address = await this.getNftBridgeContractAddress(chainId)
        const _eventFetcher = new TokenSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'TransferSent') { // RailsHub
        const address = await this.getRailsHubContractAddress(chainId)
        const _eventFetcher = new TransferSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'TransferBonded') { // RailsHub
        const address = await this.getRailsHubContractAddress(chainId)
        const _eventFetcher = new TransferBondedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      }
    }
    const options = {
      fromBlock,
      toBlock
    }
    const events = await eventFetcher.fetchEvents(filters, options as any)
    const decoded : any[] = []
    for (const event of events) {
      const res = await map[event.topics[0] as string].populateEvents([event])
      decoded.push(...res)
    }
    return decoded
  }

  getEventNames (): string[] {
    return [
      'BundleCommitted',
      'BundleForwarded',
      'BundleReceived',
      'BundleSet',
      'FeesSentToHub',
      'MessageBundled',
      'MessageExecuted',
      'MessageSent'
    ]
  }

  getSupportedChainIds (): number[] {
    const keys = Object.keys(this.contractAddresses[this.network])
    return keys.map((chainId: string) => Number(chainId))
  }

  async connectTargets (input: ConnectTargetsInput): Promise<any> {
    const { hubChainId, spokeChainId, target1, target2, signer } = input
    const provider = this.getProviderForChainId(hubChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${hubChainId}`)
    }
    const address = this.contractAddresses[this.network]?.[hubChainId]?.hubConnectorFactory
    if (!address) {
      throw new Error('address not found for hub connector factory')
    }
    const factory = HubERC5164ConnectorFactory__factory.connect(address, signer)
    const tx = await (factory as any).deployConnectors(hubChainId, target1, spokeChainId, target2)
    const receipt = await tx.wait()
    const event = receipt.events?.find(
      (event: any) => event.event === 'ConnectorDeployed'
    )
    const connectorAddress = getAddress(event?.args?.connector)
    return { connectorAddress }
  }

  async getRailsHubContractAddress (chainId: number): Promise<string> {
    return this.railsHub.getRailsHubAddress(chainId)
  }

  async getNftBridgeContractAddress (chainId: number): Promise<string> {
    return this.nft.getNftBridgeContractAddress(chainId)
  }
}
