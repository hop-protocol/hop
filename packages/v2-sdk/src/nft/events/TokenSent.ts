import { ERC721Bridge__factory } from '#contracts/factories/ERC721Bridge__factory.js'
import { Event, EventBase } from '#events/index.js'
import { ethers } from 'ethers'

// event from ERC721Bridge
export interface TokenSent extends EventBase {
  toChainId: string
  to: string
  tokenId: string
  newTokenId: string
}

export class TokenSentEventFetcher extends Event<TokenSent> {
  override eventName = 'TokenSent'

  getFilter () {
    const nftBridge = ERC721Bridge__factory.connect(this.address, this.provider)
    const filter = nftBridge.filters.TokenSent()
    return filter
  }

  async getEvents (fromBlock: number, toBlock: number): Promise<TokenSent[]> {
    const filter = this.getFilter()
    return this.getEventsWithFilter(filter, fromBlock, toBlock)
  }

  override toTypedEvent (ethersEvent: any): TokenSent {
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
