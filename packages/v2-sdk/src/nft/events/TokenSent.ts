import { ERC721Bridge__factory } from '#contracts/factories/ERC721Bridge__factory.js'
import { Event, EventBase } from '#events/index.js'
import { ethers, Event as EthersEvent, EventFilter } from 'ethers'

// event from ERC721Bridge
export interface TokenSent extends EventBase {
  toChainId: string
  to: string
  tokenId: string
  newTokenId: string
}

export class TokenSentEventFetcher extends Event<TokenSent> {
  override eventName = 'TokenSent'

  override getFilter (): EventFilter {
    const nftBridge = ERC721Bridge__factory.connect(this.address, this.provider)
    const filter = nftBridge.filters.TokenSent()
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): TokenSent {
    const iface = new ethers.utils.Interface(ERC721Bridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const toChainId = decoded.args.toChainId.toString()
    const tokenId = decoded.args.tokenId.toString()
    const to = decoded.args.to.toString()
    const newTokenId = decoded.args.newTokenId.toString()

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      toChainId,
      to,
      tokenId,
      newTokenId
    }
  }
}
