import { ERC721Bridge__factory } from '#contracts/factories/ERC721Bridge__factory.js'
import { Event, EventBase } from '#events/index.js'
import { ethers, Event as EthersEvent, EventFilter } from 'ethers'

// event from ERC721Bridge
export interface ConfirmationSent extends EventBase {
  tokenId: string
  toChainId: string
}

export class ConfirmationSentEventFetcher extends Event<ConfirmationSent> {
  override eventName = 'ConfirmationSent'

  override getFilter (): EventFilter {
    const nftBridge = ERC721Bridge__factory.connect(this.address, this.provider)
    const filter = nftBridge.filters.TokenSent()
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ConfirmationSent {
    const iface = new ethers.utils.Interface(ERC721Bridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const tokenId = decoded.args.tokenId.toString()
    const toChainId = decoded.args.toChainId.toString()

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      tokenId,
      toChainId
    }
  }
}
