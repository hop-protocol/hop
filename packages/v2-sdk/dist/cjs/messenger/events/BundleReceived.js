"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleReceivedEventFetcher = void 0;
const ethers_1 = require("ethers");
const index_js_1 = require("#events/index.js");
const HubMessageBridge__factory_js_1 = require("#contracts/factories/HubMessageBridge__factory.js");
class BundleReceivedEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'BundleReceived';
    }
    getFilter() {
        const hubMessageBridge = HubMessageBridge__factory_js_1.HubMessageBridge__factory.connect(this.address, this.provider);
        const filter = hubMessageBridge.filters.BundleReceived();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(HubMessageBridge__factory_js_1.HubMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const bundleId = decoded.args.bundleId.toString();
        const bundleRoot = decoded.args.bundleRoot.toString();
        const bundleFees = decoded.args.bundleFees;
        const fromChainId = decoded.args.fromChainId.toString();
        const toChainId = decoded.args.toChainId.toString();
        const relayWindowStart = Number(decoded.args.relayWindowStart.toString());
        const relayer = decoded.args.relayer.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            bundleId,
            bundleRoot,
            bundleFees,
            fromChainId,
            toChainId,
            relayWindowStart,
            relayer
        };
    }
}
exports.BundleReceivedEventFetcher = BundleReceivedEventFetcher;
//# sourceMappingURL=BundleReceived.js.map