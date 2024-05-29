import { ERC721Bridge__factory } from '#contracts/factories/ERC721Bridge__factory.js';
import { Event } from '#events/index.js';
import { ethers } from 'ethers';
export class TokenSentEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'TokenSent';
    }
    getFilter() {
        const nftBridge = ERC721Bridge__factory.connect(this.address, this.provider);
        const filter = nftBridge.filters.TokenSent();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(ERC721Bridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const toChainId = decoded.args.toChainId.toString();
        const tokenId = decoded.args.tokenId.toString();
        const to = decoded.args.to.toString();
        const newTokenId = decoded.args.newTokenId.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            toChainId,
            to,
            tokenId,
            newTokenId
        };
    }
}
//# sourceMappingURL=TokenSent.js.map