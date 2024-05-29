"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleSetEventFetcher = void 0;
const index_js_1 = require("#events/index.js");
const SpokeMessageBridge__factory_js_1 = require("#contracts/factories/SpokeMessageBridge__factory.js");
const ethers_1 = require("ethers");
class BundleSetEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'BundleSet';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.BundleSet();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const bundleId = decoded.args.bundleId.toString();
        const bundleRoot = decoded.args.bundleRoot.toString();
        const fromChainId = decoded.args.fromChainId.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            bundleId,
            bundleRoot,
            fromChainId
        };
    }
}
exports.BundleSetEventFetcher = BundleSetEventFetcher;
//# sourceMappingURL=BundleSet.js.map