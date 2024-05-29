"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageExecutedEventFetcher = void 0;
const index_js_1 = require("#events/index.js");
const SpokeMessageBridge__factory_js_1 = require("#contracts/factories/SpokeMessageBridge__factory.js");
const ethers_1 = require("ethers");
class MessageExecutedEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'MessageExecuted';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageExecuted();
        return filter;
    }
    getMessageIdFilter(messageId) {
        const spokeMessageBridge = SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.connect(this.address, this.provider);
        // TODO: after it's indexed in contract
        // const filter = spokeMessageBridge.filters.MessageExecuted(messageId)
        const filter = spokeMessageBridge.filters.MessageExecuted();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const messageId = decoded.args.messageId.toString();
        const fromChainId = decoded.args.fromChainId.toString();
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            messageId,
            fromChainId
        };
    }
}
exports.MessageExecutedEventFetcher = MessageExecutedEventFetcher;
//# sourceMappingURL=MessageExecuted.js.map