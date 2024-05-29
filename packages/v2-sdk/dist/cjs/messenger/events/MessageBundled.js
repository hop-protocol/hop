"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBundledEventFetcher = void 0;
const index_js_1 = require("#events/index.js");
const SpokeMessageBridge__factory_js_1 = require("#contracts/factories/SpokeMessageBridge__factory.js");
const ethers_1 = require("ethers");
class MessageBundledEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'MessageBundled';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageBundled();
        return filter;
    }
    getBundleIdFilter(bundleId) {
        const spokeMessageBridge = SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageBundled(bundleId);
        return filter;
    }
    getMessageIdFilter(messageId) {
        const spokeMessageBridge = SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageBundled(null, null, messageId);
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const bundleId = decoded.args.bundleId.toString();
        const treeIndex = Number(decoded.args.treeIndex.toString());
        const messageId = decoded.args.messageId.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            bundleId,
            treeIndex,
            messageId
        };
    }
}
exports.MessageBundledEventFetcher = MessageBundledEventFetcher;
//# sourceMappingURL=MessageBundled.js.map