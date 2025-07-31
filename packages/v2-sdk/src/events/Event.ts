import { EventContext, EthersEventWithDecodedTypes, EthersEventWithDecodedTypesAndBaseContext, BaseEventContext } from './types.js'
import { providers, BigNumberish, Event as EthersEvent, utils } from 'ethers'

export class Event<T> {
  provider: providers.Provider
  chainId: BigNumberish
  address: string
  eventName: string
  abi: any
  factory: any

  constructor(
    provider?: providers.Provider,
    chainId?: BigNumberish,
    address?: string
  ) {
    this.provider = provider ?? this.provider
    this.chainId = chainId ?? this.chainId
    this.address = address ?? this.address
  }

  getEventNameFromTopic(topic0: string): string | null {
    const iface = new utils.Interface(this.abi)
    const eventFragment = Object.values(iface.events).find(eventFragment => iface.getEventTopic(eventFragment) === topic0)
    return eventFragment ? eventFragment.name : null
  }

  parseEthersEventLog(ethersEvent: EthersEvent): any {
    const iface = new utils.Interface(this.abi)
    return iface.parseLog(ethersEvent)
  }

  getTopic0(): string {
    const iface = new utils.Interface(this.abi)
    return iface.getEventTopic(this.eventName)
  }

  // TODO: V2: Fix this
  addTypedEvent(ethersEvent: EthersEvent, chainId?: string): EthersEventWithDecodedTypesAndBaseContext<T> {
    const decoded = this.toTypedEvent(ethersEvent)
    const eventWithDecoded = {
      ...ethersEvent,
      decoded
    } as EthersEventWithDecodedTypes<T>

    return {
      ...ethersEvent,
      decoded,
      // TODO: V2: Fix this
      context: this.getBaseEventContext(eventWithDecoded, chainId)
    }
  }

  toTypedEvent(ethersEvent: EthersEvent): T {
    throw new Error('Not implemented')
  }

  // TODO: V2: Fix this
  getBaseEventContext(event: EthersEventWithDecodedTypes<T>, chainId?: string): BaseEventContext {
    try {
      // TODO: V2: Fix this
      const chainSlug = this.getChainSlug(chainId ?? this.chainId ?? 0)
      const { transactionHash, transactionIndex, logIndex, blockNumber } = event

      return {
        eventName: this.eventName,
        chainSlug,
        // TODO: V2: Fix this
        chainId: chainId ?? this.chainId.toString(),
        transactionHash,
        transactionIndex,
        logIndex,
        blockNumber
      }
    } catch (err: unknown) {
      console.error('hopV2Sdk: getEventContext error:', err, this.chainId, event)
      throw err
    }
  }
}
