import { ERC721Bridge__factory } from '#contracts/factories/ERC721Bridge__factory.js';
import { Event } from '#events/index.js';
import { ethers } from 'ethers';
export class TokenConfirmedEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'TokenConfirmed';
    }
    getFilter() {
        const nftBridge = ERC721Bridge__factory.connect(this.address, this.provider);
        const filter = nftBridge.filters.TokenSent();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(ERC721Bridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const tokenId = decoded.args.tokenId.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            tokenId
        };
    }
}
//# sourceMappingURL=TokenConfirmed.js.map