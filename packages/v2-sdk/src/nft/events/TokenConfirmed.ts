import { ERC721Bridge__factory } from '#contracts/factories/ERC721Bridge__factory.js'
import { Event, EventBase } from '#events/index.js'
import { ethers, Event as EthersEvent, EventFilter } from 'ethers'

// event from ERC721Bridge
export interface TokenConfirmed extends EventBase {
  tokenId: string
}

export class TokenConfirmedEventFetcher extends Event<TokenConfirmed> {
  override eventName = 'TokenConfirmed'

  override getFilter (): EventFilter {
    const nftBridge = ERC721Bridge__factory.connect(this.address, this.provider)
    const filter = nftBridge.filters.TokenSent()
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): TokenConfirmed {
    const iface = new ethers.utils.Interface(ERC721Bridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const tokenId = decoded.args.tokenId.toString()

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      tokenId
    }
  }
}
