import { ethers } from 'ethers';
import { Event } from '#events/index.js';
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js';
export class BundleCommittedEventFetcher extends Event {
    constructor() {
        super(...arguments);
        this.eventName = 'BundleCommitted';
    }
    getFilter() {
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider);
        const filter = spokeMessageBridge.filters.BundleCommitted();
        return filter;
    }
    toTypedEvent(ethersEvent) {
        const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi);
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
//# sourceMappingURL=BundleCommitted.js.map