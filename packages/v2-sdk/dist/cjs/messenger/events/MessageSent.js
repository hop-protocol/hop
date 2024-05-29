"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSentEventFetcher = void 0;
const index_js_1 = require("#events/index.js");
const SpokeMessageBridge__factory_js_1 = require("#contracts/factories/SpokeMessageBridge__factory.js");
const ethers_1 = require("ethers");
class MessageSentEventFetcher extends index_js_1.Event {
    constructor() {
        super(...arguments);
        this.eventName = 'MessageSent';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageSent();
        return filter;
    }
    getMessageIdFilter(messageId) {
        const spokeMessageBridge = SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageSent(messageId);
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers_1.ethers.utils.Interface(SpokeMessageBridge__factory_js_1.SpokeMessageBridge__factory.abi);
        const decoded = iface.parseLog(ethersEvent);
        const messageId = decoded.args.messageId.toString();
        const from = decoded.args.from;
        const toChainId = decoded.args.toChainId.toString();
        const to = decoded.args.to;
        const data = decoded.args.data;
        return {
            eventName: this.eventName,
            eventLog: ethersEvent,
            messageId,
            from,
            toChainId,
            to,
            data
        };
    }
}
exports.MessageSentEventFetcher = MessageSentEventFetcher;
//# sourceMappingURL=MessageSent.js.map