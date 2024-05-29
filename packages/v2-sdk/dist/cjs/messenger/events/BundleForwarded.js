"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleForwardedEventFetcher = void 0;
const index_js_1 = require("#events/index.js");
const ethers_1 = require("ethers");
const HubMessageBridge__factory_js_1 = require("#contracts/factories/HubMessageBridge__factory.js");
class BundleForwardedEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'BundleForwarded';
    }
    getFilter() {
        const hubMessageBridge = HubMessageBridge__factory_js_1.HubMessageBridge__factory.connect(this.address, this.provider);
        const filter = hubMessageBridge.filters.BundleForwarded();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(HubMessageBridge__factory_js_1.HubMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const bundleId = decoded.args.bundleId.toString();
        const bundleRoot = decoded.args.bundleRoot.toString();
        const fromChainId = decoded.args.fromChainId.toString();
        const toChainId = decoded.args.toChainId.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            bundleId,
            bundleRoot,
            fromChainId,
            toChainId
        };
    }
}
exports.BundleForwardedEventFetcher = BundleForwardedEventFetcher;
//# sourceMappingURL=BundleForwarded.js.map