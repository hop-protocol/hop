import { Event } from '#events/index.js';
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js';
import { ethers } from 'ethers';
export class BundleSetEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'BundleSet';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.BundleSet();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi);
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
//# sourceMappingURL=BundleSet.js.map