"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSentEventFetcher = void 0;
const ERC721Bridge__factory_js_1 = require("#contracts/factories/ERC721Bridge__factory.js");
const index_js_1 = require("#events/index.js");
const ethers_1 = require("ethers");
class TokenSentEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'TokenSent';
    }
    getFilter() {
        const nftBridge = ERC721Bridge__factory_js_1.ERC721Bridge__factory.connect(this.address, this.provider);
        const filter = nftBridge.filters.TokenSent();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(ERC721Bridge__factory_js_1.ERC721Bridge__factory.abi);
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
exports.TokenSentEventFetcher = TokenSentEventFetcher;
//# sourceMappingURL=TokenSent.js.map