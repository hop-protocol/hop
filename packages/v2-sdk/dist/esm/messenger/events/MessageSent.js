import { Event } from '#events/index.js';
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js';
import { ethers } from 'ethers';
export class MessageSentEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'MessageSent';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageSent();
        return filter;
    }
    getMessageIdFilter(messageId) {
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageSent(messageId);
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi);
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
//# sourceMappingURL=MessageSent.js.map