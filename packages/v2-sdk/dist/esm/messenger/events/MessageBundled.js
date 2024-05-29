import { Event } from '#events/index.js';
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js';
import { ethers } from 'ethers';
export class MessageBundledEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'MessageBundled';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageBundled();
        return filter;
    }
    getBundleIdFilter(bundleId) {
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageBundled(bundleId);
        return filter;
    }
    getMessageIdFilter(messageId) {
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.MessageBundled(null, null, messageId);
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi);
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
//# sourceMappingURL=MessageBundled.js.map