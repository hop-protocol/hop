import { Event } from '#events/index.js';
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js';
import { ethers } from 'ethers';
export class MessageExecutedEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'MessageExecuted';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageExecuted();
        return filter;
    }
    getMessageIdFilter(messageId) {
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider);
        // TODO: after it's indexed in contract
        // const filter = spokeMessageBridge.filters.MessageExecuted(messageId)
        const filter = spokeMessageBridge.filters.MessageExecuted();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi);
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
//# sourceMappingURL=MessageExecuted.js.map