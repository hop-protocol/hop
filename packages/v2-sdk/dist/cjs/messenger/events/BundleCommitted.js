"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleCommittedEventFetcher = void 0;
const ethers_1 = require("ethers");
const index_js_1 = require("#events/index.js");
const SpokeMessageBridge__factory_js_1 = require("#contracts/factories/SpokeMessageBridge__factory.js");
class BundleCommittedEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'BundleCommitted';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.BundleCommitted();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const bundleId = decoded.args.bundleId.toString();
        const bundleRoot = decoded.args.bundleRoot.toString();
        const bundleFees = decoded.args.bundleFees;
        const toChainId = decoded.args.toChainId.toString();
        const commitTime = Number(decoded.args.commitTime.toString());
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            bundleId,
            bundleRoot,
            bundleFees,
            toChainId,
            commitTime
        };
    }
}
exports.BundleCommittedEventFetcher = BundleCommittedEventFetcher;
//# sourceMappingURL=BundleCommitted.js.map