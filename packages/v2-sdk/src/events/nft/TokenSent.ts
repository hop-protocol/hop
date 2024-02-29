import ERC721BridgeAbi from '../../config/abi/generated/ERC721Bridge.json' assert { type: "json" }
import { ERC721Bridge__factory } from '../../config/contracts/factories/generated/ERC721Bridge__factory'
import { Event } from '../Event'
import { EventBase } from '../types'
import { ethers } from 'ethers'

// event from ERC721Bridge
export interface TokenSent extends EventBase {
  toChainId: number
  to: string
  tokenId: string
  newTokenId: string
}

export class TokenSentEventFetcher extends Event {
  override eventName = 'TokenSent'

  getFilter () {
    const nftBridge = ERC721Bridge__factory.connect(this.address, this.provider)
    const filter = nftBridge.filters.TokenSent()
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<TokenSent[]> {
    const filter = this.getFilter()
    return this._getEvents(filter, startBlock, endBlock)
  }

  override toTypedEvent (ethersEvent: any): TokenSent {
    const iface = new ethers.utils.Interface(ERC721BridgeAbi)
    const decoded = iface.parseLog(ethersEvent)

    const toChainId = Number(decoded.args.toChainId.toString())
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
