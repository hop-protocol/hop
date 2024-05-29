"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationSentEventFetcher = void 0;
const ERC721Bridge__factory_js_1 = require("#contracts/factories/ERC721Bridge__factory.js");
const index_js_1 = require("#events/index.js");
const ethers_1 = require("ethers");
class ConfirmationSentEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'ConfirmationSent';
    }
    getFilter() {
        const nftBridge = ERC721Bridge__factory_js_1.ERC721Bridge__factory.connect(this.address, this.provider);
        const filter = nftBridge.filters.TokenSent();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(ERC721Bridge__factory_js_1.ERC721Bridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const tokenId = decoded.args.tokenId.toString();
        const toChainId = decoded.args.toChainId.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            tokenId,
            toChainId
        };
    }
}
exports.ConfirmationSentEventFetcher = ConfirmationSentEventFetcher;
//# sourceMappingURL=ConfirmationSent.js.map